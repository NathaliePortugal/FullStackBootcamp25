import { useProducts } from '../hooks/useProducts'
import ProductCard from '../components/ProductCard'

function Home() {
  const { products, loading, error } = useProducts()

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="container">
          <p className="hero__eyebrow">Curaduria de horror moderno</p>
          <h1 className="hero__title" id="hero-title">
            Jugueteria Cosmica – Terror Edition
          </h1>
          <p className="hero__subtitle">
            Seleccion breve, oscura y elegante de experiencias que no piden permiso para inquietarte.
          </p>
          <div className="hero__actions">
            <a className="btn btn--primary" href="#productos">Ver productos</a>
            <a className="btn btn--ghost" href="/contacto">Contacto</a>
          </div>
        </div>
      </section>

      <section className="section" id="productos" aria-labelledby="products-title">
        <div className="container">
          <header className="section__header">
            <h2 className="section__title" id="products-title">Destacados</h2>
            <p className="section__subtitle">
              Horror curado: cada titulo esta aca porque vale la pena el susto.
            </p>
          </header>

          {loading && (
            <p className="page-status">Cargando productos…</p>
          )}

          {error && (
            <p className="page-status" style={{ color: 'var(--form-invalid-border)' }}>
              {error}
            </p>
          )}

          {!loading && !error && products.length === 0 && (
            <p className="page-status">No hay productos disponibles aun.</p>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="products-grid" role="list">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="section__cta">
            <a className="btn btn--ghost" href="/alta">Dar de alta un producto</a>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
