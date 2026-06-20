import { useEffect, useRef, useState } from 'react'
import { useCart } from '../hooks/useCart'
import { useToast } from '../hooks/useToast'
import { useProducts } from '../hooks/useProducts'
import { submitCart } from '../api/cart'

function CartModal() {
  const { items, isOpen, setIsOpen, updateQty, removeFromCart, totalPrice, clearCart } = useCart()
  const { showToast } = useToast()
  const { refreshProducts } = useProducts()
  const overlayRef = useRef(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') {
        if (showConfirm) {
          setShowConfirm(false)
        } else {
          setIsOpen(false)
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [setIsOpen, showConfirm])

  function handleOverlayClick(e) {
    if (e.target === overlayRef.current) setIsOpen(false)
  }

  async function handleCheckout() {
    setSubmitting(true)
    try {
      await submitCart(items, totalPrice)
      clearCart()
      setIsOpen(false)
      setShowConfirm(false)
      showToast('¡Pedido enviado correctamente!', 'success')
      refreshProducts()
    } catch {
      showToast('Error al enviar el pedido. Intenta de nuevo.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div
        className="modal-overlay"
        ref={overlayRef}
        onClick={handleOverlayClick}
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
      >
        <div className="modal">
          <div className="modal__header">
            <h2 className="modal__title">Tu carrito</h2>
            <button
              className="modal__close"
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar carrito"
            >
              ✕
            </button>
          </div>

          <div className="modal__body">
            {items.length === 0 ? (
              <p className="modal__empty">Tu carrito esta vacio.</p>
            ) : (
              items.map(item => (
                <div key={item.itemKey} className="cart-item">
                  <img
                    className="cart-item__img"
                    src={item.image || '/assets/img/logo.png'}
                    alt={item.name}
                    onError={e => { e.target.src = '/assets/img/logo.png' }}
                  />
                  <div className="cart-item__info">
                    <span className="cart-item__name" title={item.name}>{item.name}</span>
                    <span className="badge" style={{ marginBottom: '0.25rem' }}>{item.selectedPlatform}</span>
                    <span className="cart-item__price">S/ {Number(item.price).toFixed(2)} c/u</span>
                    <div className="cart-item__controls">
                      <button
                        className="btn btn--icon"
                        onClick={() => updateQty(item.itemKey, item.qty - 1)}
                        aria-label="Restar uno"
                        title="Restar"
                        disabled={item.qty <= 1}
                      >
                        −
                      </button>
                      <input
                        className="cart-item__qty-input"
                        type="number"
                        min="1"
                        value={item.qty}
                        onChange={e => updateQty(item.itemKey, e.target.value)}
                        aria-label="Cantidad"
                      />
                      <button
                        className="btn btn--icon"
                        onClick={() => updateQty(item.itemKey, item.qty + 1)}
                        aria-label="Sumar uno"
                        title="Sumar"
                        disabled={item.qty >= item.stock}
                      >
                        +
                      </button>
                      <span className="cart-item__subtotal">
                        S/ {(Number(item.price) * item.qty).toFixed(2)}
                      </span>
                      <button
                        className="cart-item__remove"
                        onClick={() => removeFromCart(item.itemKey)}
                        aria-label={`Eliminar ${item.name}`}
                        title="Eliminar del carrito"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="modal__footer">
              <div>
                <p className="modal__total-label">Total</p>
                <p className="modal__total-value">S/ {totalPrice.toFixed(2)}</p>
              </div>
              <button
                className="btn btn--primary btn--small"
                onClick={() => setShowConfirm(true)}
              >
                Finalizar compra
              </button>
            </div>
          )}
        </div>
      </div>

      {showConfirm && (
        <div className="confirm-overlay" role="dialog" aria-modal="true" aria-label="Confirmar compra">
          <div className="confirm">
            <p className="confirm__icon">🛒</p>
            <h3 className="confirm__title">Finalizar compra</h3>
            <p className="confirm__subtitle">¿Deseas confirmar tu pedido?</p>
            <div className="confirm__disclaimer">
              <p>Esta es una simulacion de compra. Los productos seran removidos del carrito al confirmar.</p>
            </div>
            <div className="confirm__actions">
              <button className="btn btn--ghost" onClick={() => setShowConfirm(false)}>
                Cancelar
              </button>
              <button
                className="btn btn--primary"
                onClick={handleCheckout}
                disabled={submitting}
              >
                {submitting ? 'Enviando...' : 'Aceptar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default CartModal
