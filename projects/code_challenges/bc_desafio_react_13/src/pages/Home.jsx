import { Link } from 'react-router-dom'
import './Home.css'

function Home() {
  return (
    <main className="home">
      <h1 className="home-titulo">DarkFrame</h1>
      <p className="home-subtitulo">Tu plataforma de Terror y Acción</p>
      <p className="home-descripcion">
        Explorá nuestra colección de las mejores películas de terror y acción.
        Desde clásicos del cine de horror hasta thrillers de acción adrenalínicos,
        tenemos todo lo que necesitás para una noche de película inolvidable.
      </p>
      <Link to="/catalogo" className="home-boton">
        Ver catálogo
      </Link>
    </main>
  )
}

export default Home
