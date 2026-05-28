import { useCart } from '../hooks/useCart'
import { useToast } from '../hooks/useToast'

function RatingDots({ value = 0, max = 5 }) {
  return (
    <div className="rating" aria-label={`Fear ${value} de ${max}`}>
      <span className="rating__label">Fear</span>
      <span className="rating__dots">
        {Array.from({ length: max }, (_, i) => (
          <span
            key={i}
            className={`rating__dot${i < value ? ' rating__dot--on' : ''}`}
          />
        ))}
      </span>
      <span className="rating__value">{value}/{max}</span>
    </div>
  )
}

function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { showToast } = useToast()

  function handleAdd() {
    const ok = addToCart(product)
    if (ok) {
      showToast(`"${product.name}" agregado al carrito.`, 'success')
    } else {
      showToast('No hay mas stock disponible.', 'error')
    }
  }

  return (
    <article className="card card--product" role="listitem">
      <div className="card__media">
        <img
          className="card__img"
          src={product.image || '/assets/img/logo.png'}
          alt={product.name}
          onError={e => { e.target.src = '/assets/img/logo.png' }}
        />
      </div>

      <div className="card__body">
        <div className="card__meta">
          {product.genre && <span className="badge">{product.genre}</span>}
          {product.platform && <span className="badge">{product.platform}</span>}
        </div>

        <h3 className="card__title">{product.name}</h3>

        <p className="card__text">{product.description}</p>

        <RatingDots value={Number(product.fear) || 0} />

        <div className="card__footer">
          <span className="price">S/ {Number(product.price).toFixed(2)}</span>
          <span className="stock">
            {product.stock > 0 ? `Stock: ${product.stock}` : 'Sin stock'}
          </span>
          <button
            className="btn btn--primary btn--small"
            onClick={handleAdd}
            disabled={product.stock === 0}
            title={`Agregar ${product.name} al carrito`}
          >
            Agregar
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
