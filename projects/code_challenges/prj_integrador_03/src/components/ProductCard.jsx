import { useState } from 'react'
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
  const [selectedPlatform, setSelectedPlatform] = useState(
    product.platforms?.length === 1 ? product.platforms[0].name : ''
  )

  const platformData = product.platforms?.find(p => p.name === selectedPlatform)
  const hasStock = platformData ? platformData.stock > 0 : false
  const hasAnyStock = product.platforms?.some(p => p.stock > 0)

  function handleAdd() {
    if (!selectedPlatform) return
    const ok = addToCart(product, selectedPlatform)
    if (ok) {
      showToast(`"${product.name}" (${selectedPlatform}) agregado al carrito.`, 'success')
    } else {
      showToast('No hay mas stock disponible para esta plataforma.', 'error')
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
        </div>

        <h3 className="card__title">{product.name}</h3>

        <p className="card__text">{product.description}</p>

        <RatingDots value={Number(product.fear) || 0} />

        <div className="card__meta" style={{ marginTop: '0.5rem' }}>
          {product.platforms?.map(p => (
            <span key={p.name} className="badge">
              {p.name}: {p.stock} uds
            </span>
          ))}
        </div>

        <div className="card__footer">
          <span className="price">S/ {Number(product.price).toFixed(2)}</span>

          {product.platforms?.length > 1 && (
            <select
              className="form__select"
              value={selectedPlatform}
              onChange={e => setSelectedPlatform(e.target.value)}
              aria-label="Seleccionar plataforma"
              style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
            >
              <option value="">Plataforma…</option>
              {product.platforms.map(p => (
                <option key={p.name} value={p.name} disabled={p.stock === 0}>
                  {p.name} ({p.stock} uds)
                </option>
              ))}
            </select>
          )}

          <button
            className="btn btn--primary btn--small"
            onClick={handleAdd}
            disabled={!hasAnyStock || !selectedPlatform || !hasStock}
            title={`Agregar ${product.name} al carrito`}
          >
            {!hasAnyStock ? 'Sin stock' : 'Agregar'}
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
