import { useParams, Link } from 'react-router-dom'
import { movies } from '../data/movies'
import './MovieDetail.css'

function MovieDetail() {
  const { id } = useParams()
  const movie = movies.find((m) => m.id === Number(id))

  if (!movie) {
    return (
      <main className="detail-not-found">
        <p>Película no encontrada.</p>
        <Link to="/catalogo" className="detail-volver">← Volver al catálogo</Link>
      </main>
    )
  }

  return (
    <main className="detail">
      <Link to="/catalogo" className="detail-volver">← Volver al catálogo</Link>

      <div className="detail-container">
        <img src={movie.image} alt={movie.title} className="detail-img" />
        <div className="detail-info">
          <h1 className="detail-titulo">{movie.title}</h1>
          <p className="detail-descripcion">{movie.description}</p>
          <ul className="detail-meta">
            <li><span>Género</span>{movie.genre}</li>
            <li><span>Año</span>{movie.year}</li>
            <li><span>Duración</span>{movie.duration}</li>
          </ul>
        </div>
      </div>
    </main>
  )
}

export default MovieDetail
