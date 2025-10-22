
## MovieWeb

**MovieWeb** is a full-stack web application that allows users to explore and search for movies, view trending titles based on popularity, and access detailed movie information — all powered by **Appwrite** for backend data management.

---

### Features

* 🔍 **Movie Search:**
  Search for any movie from a vast collection.
  (Almost every released movie is available for reference.)

* 📈 **Trending System:**
  Tracks user search frequency and dynamically lists trending movies.
  Uses Appwrite’s database — updates are handled via `movie_id` to avoid duplicate entries.

* 🧩 **Appwrite Integration:**

  * Manages user data and movie metadata.
  * Handles CRUD operations for tracking search trends.
  * Real-time database updates.

* 🖼️ **Dynamic UI:**
  Displays movie posters, titles, and release info with a clean, responsive design.

---

### 🛠️ Tech Stack

| Layer          | Technology                              |
| -------------- | --------------------------------------- |
| **Frontend**   | React (Vite)                            |
| **Backend**    | Appwrite Cloud (BaaS)                   |
| **Database**   | Appwrite Database                       |
| **Styling**    | Tailwind CSS                            |
| **API Source** | TMDb (The Movie Database)|

---

### 🧱 Database Schema (Appwrite)

**Collection Name:** `Movies`

| Field        | Type                         | Description                            |
| ------------ | ---------------------------- | -------------------------------------- |
| `searchTerm` | `string` (max 100, required) | Movie title searched by user           |
| `movie_id`   | `integer`                    | Unique identifier for the movie        |
| `count`      | `integer`                    | Number of times the movie was searched |
| `poster_url` | `url` (required)             | Movie poster image URL                 |
| `$id`        | `string`                     | Appwrite document ID                   |
| `$createdAt` | `datetime`                   | Creation timestamp                     |
| `$updatedAt` | `datetime`                   | Last updated timestamp                 |

> **Note:** The `count` is updated based on `movie_id` instead of `searchTerm` to prevent duplicates for the same movie.

---

### ⚙️ How It Works

1. When a user searches a movie:

   * If the `movie_id` exists → increment `count`.
   * Else → create a new entry in Appwrite.

2. Trending movies are fetched by sorting movies with the highest `count`.

3. The frontend displays results using React with a clean UI powered by Tailwind.

---

### 💻 Setup Instructions

1. **Clone the repo:**

   ```bash
   git clone https://github.com/Anudeep007-hub/MovieWeb.git
   cd MovieWeb
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create an `.env` file** in the root and add:

   ```bash
   VITE_APPWRITE_ENDPOINT=your_appwrite_endpoint
   VITE_APPWRITE_PROJECT_ID=your_project_id
   VITE_APPWRITE_DATABASE_ID=your_database_id
   VITE_APPWRITE_COLLECTION_ID=your_collection_id
   ```

4. **Run the app:**

   ```bash
   npm run dev
   ```

---

### Example Query Logic

```js
// Fetch trending movies
const trending = databases.listDocuments(
  DATABASE_ID,
  COLLECTION_ID,
  [Query.orderDesc('count'), Query.limit(10)]
);

// Update search count
const updateCount = async (movie_id) => {
  const existing = await databases.listDocuments(
    DATABASE_ID,
    COLLECTION_ID,
    [Query.equal('movie_id', movie_id)]
  );

  if (existing.total > 0) {
    const doc = existing.documents[0];
    await databases.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
      count: doc.count + 1,
    });
  } else {
    await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
      movie_id,
      count: 1,
      searchTerm,
      poster_url,
    });
  }
};
```

---

### Future Improvements

* 🔐 User authentication for personalized movie lists.
* 💾 Bookmark & watchlist feature.

---

### 👨‍💻 Author

**Anudeep**
🎓 B.Tech CSE, IIIT Sri City
🚀 Passionate about Full Stack & ML Development
🔗 [GitHub Profile](https://github.com/Anudeep007-hub)

