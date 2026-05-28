import { useState } from 'react'
import { Link } from 'react-router-dom'
import { movies } from '../data/movies'
import './Catalog.css'

const GENRES = ['Todos', 'Terror', 'Acción']

function Catalog() {
  const [activeGenre, setActiveGenre] = useState('Todos')

  const filteredMovies =
    activeGenre === 'Todos'
      ? movies
      : movies.filter((movie) => movie.genre === activeGenre)

  return (
    <main className="catalog">
      <h1 className="catalog-titulo">Catálogo</h1>

      <div className="catalog-filtros">
        {GENRES.map((genre) => (
          <button
            key={genre}
            onClick={() => setActiveGenre(genre)}
            className={`filtro-btn ${activeGenre === genre ? 'activo' : ''}`}
          >
            {genre}
          </button>
        ))}
      </div>

      <div className="catalog-grid">
        {filteredMovies.map((movie) => (
          <Link to={`/pelicula/${movie.id}`} key={movie.id} className="movie-card">
            <img src={movie.image} alt={movie.title} className="movie-card-img" />
            <div className="movie-card-info">
              <h3 className="movie-card-titulo">{movie.title}</h3>
              <span className="movie-card-genero">{movie.genre}</span>
              <span className="movie-card-year">{movie.year}</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}

export default Catalog
