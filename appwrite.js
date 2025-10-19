import { Client, Databases, Query, ID } from 'appwrite';

// Read env vars and sanitize endpoint (strip accidental surrounding quotes)
const APPWRITE_ENDPOINT = (import.meta.env.VITE_APPWRITE_ENDPOINT || '').replace(/^"|"$/g, '');
const PROJECT_ID = (import.meta.env.VITE_APPWRITE_PROJECT_ID || '').replace(/^"|"$/g, ''); // <-- ADDED .replace()
const DATABASE_ID = (import.meta.env.VITE_APPWRITE_DATABASE_ID || '').replace(/^"|"$/g, ''); // <-- ADDED .replace()
const TABLE_ID = (import.meta.env.VITE_APPWRITE_TABLE_ID || '').replace(/^"|"$/g, ''); // <-- ADDED .replace()

const client = new Client();
if (APPWRITE_ENDPOINT) client.setEndpoint(APPWRITE_ENDPOINT);
if (PROJECT_ID) client.setProject(PROJECT_ID);

const database = new Databases(client);


export const updateSearchCount = async (searchTerm, movie) => {
  // --- THIS IS THE NEW LOGIC ---

  // 1. We must have a movie object with an ID to track it.
  //    If the search yielded no results (movie is null), we stop.
  if (!movie || !movie.id) {
    console.log('No movie associated with search, skipping count.');
    return;
  }
  
  // 'searchTerm' is still needed for the *first* time we create an entry.

  try {
    // console.log(`DatabaseId = ${DATABASE_ID}, TableId = ${TABLE_ID}`);

    // 2. Look for a document that *already* has this movie_id.
    const result = await database.listDocuments(DATABASE_ID, TABLE_ID, [
      Query.equal('movie_id', movie.id) // <-- THE KEY CHANGE IS HERE
    ]);

    const docs = result.documents || [];

    if (docs.length > 0) {
      // 3. FOUND: Increment the count for this movie.
      const doc = docs[0];
      await database.updateDocument(DATABASE_ID, TABLE_ID, doc.$id, {
        count: (doc.count || 0) + 1
      });
      console.log(`Updated count for movie_id: ${movie.id}`);
    } else {
      // 4. NOT FOUND: Create a new document for this movie.
      await database.createDocument(
        DATABASE_ID,
        TABLE_ID,
        ID.unique(),
        {
          // We store the *first* search term that found this movie.
          searchTerm: searchTerm,
          count: 1,
          movie_id: movie.id, // The movie_id is the key
          poster_url: movie.poster_path // Make sure it's null-safe
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : null
        }
      );
      console.log(`Created new entry for movie_id: ${movie.id}`);
    }
  } catch (error) {
    console.error('Appwrite updateSearchCount error:', error);
  } finally {
    // console.log('Appwrite config', APPWRITE_ENDPOINT, PROJECT_ID, DATABASE_ID, TABLE_ID);
  }
};

export const getTrendingMovies = async () => {
    try {
        const result = await database.listDocuments(    DATABASE_ID, TABLE_ID,[ 
            Query.limit(5),
            Query.orderDesc("count")
        ]) 

        return result.documents;
    } catch (error) {
        console.log(error);
    }
}