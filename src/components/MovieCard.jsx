import React from 'react'

const MovieCard = ({movie:{id, title, original_title, release_date,  vote_average, poster_path, }}) => {
  const imageUrl = poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : '/no-movie.png';

  return (
    <article className="group bg-gray-900 rounded-xl overflow-hidden shadow-lg w-full sm:w-64">
      <div className="relative h-80 w-full bg-gray-800 p-3">
        <img src={imageUrl} alt={title} className="w-full h-full object-cover rounded-md" />

        {/* subtle gradient to improve text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-60 pointer-events-none rounded-md"></div>

        {/* rating badge */}
        <div className="absolute top-3 right-3 bg-yellow-400 text-black rounded-full px-3 py-1 text-sm font-semibold flex items-center gap-2 shadow">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.84-.197-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span>{vote_average ? vote_average.toFixed(1) : 'N/A'}</span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-white font-semibold text-lg leading-tight truncate">{title}</h3>
        <p className="text-gray-400 text-sm truncate">{original_title}</p>

        <div className="mt-3 flex items-center justify-between">
          <a
            href={`https://www.themoviedb.org/movie/${id}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-500 text-white px-3 py-1 rounded-full text-sm shadow hover:opacity-95"
          >
            Go
          </a>
        </div>
      </div>
    </article>
  )
}
 
export default MovieCard