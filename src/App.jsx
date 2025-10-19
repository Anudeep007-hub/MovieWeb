import React, { useState, useEffect } from 'react'
import { useDebounce } from 'react-use';

import Spinner from './components/Spinner.jsx';
import MovieCard from './components/MovieCard.jsx';
import Search from './components/search.jsx'
import './index.css'
import { getTrendingMovies, updateSearchCount } from '../appwrite.js';

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const OPTIONS = {
  method: 'GET',
  hostname: 'api.themoviedb.org', 
  port: null,
  path: '/3/authentication',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
};

const App = () => {

  const [searchTerm, setSearchTerm] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const [movieList, setMovieList] = useState([]);

  const [trendingMovies, setTrendingMovies] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [debouncedSearchTerm, setdebouncedSearchTerm] = useState('');

  useDebounce(() => setdebouncedSearchTerm(searchTerm),350, [searchTerm]);



  const fetchMovies = async (query ='') => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      console.log(`Base URL: ${API_KEY}`)
      const endpoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURI(query)}` : `${API_BASE_URL}/discover/movie?&sort_by=popularity.desc`;
      const response = await fetch(endpoint, OPTIONS)

      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();
      console.log(data);

      if (data.response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch movies');
        setMovieList([]);
        return;
      }
      setMovieList(data.results || []);

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.log(`Error fetching movies: ${error}`);
      setErrorMessage(errorMessage);

    } finally {
      setIsLoading(false);
    }
  }

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);

    } catch (error) {
      console.log(error); 
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm); 
  }, [debouncedSearchTerm])

  useEffect(() => {
    loadTrendingMovies();
  }, [])


  return (
    <div className='pattern'>
      <div className='wrapper'>

        <header>
          <h1> Pick your <span className='text-gradient'> favourite movie </span> </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className='trending'> 
            <h2> Trending Movies</h2>

            <ul>
              {trendingMovies.map((movie,index) => (
                <li key={movie.movie_id}>
                    <p>{index+1}</p>
                    <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className='all-movies'>
          <h2> All Movies</h2>
          {isLoading ? (
            <Spinner/>
          ) : errorMessage ? (
            <p className='text-red-500'>{errorMessage}</p>
          ): (
            <ul> {movieList.map((movie) => 
              <MovieCard key={movie.id} movie= {movie}/>
             )}</ul>
          )}

        </section>


      </div>
    </div>
  )
}

export default App