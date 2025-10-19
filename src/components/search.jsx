import React from 'react'

const Search = ({searchTerm, setSearchTerm}) => {
  return (
    <div className='text-amber-50'> 
        <div>
            <input type="text" placeholder='Know about your movie' value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            />

        </div>
    </div>
  )
}

export default Search