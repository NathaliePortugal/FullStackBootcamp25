import { useState, useEffect } from 'react'
import { NavLink } from 'react-router'
import { useCart } from '../hooks/useCart'
import CartModal from '../components/CartModal'

function Header() {
  const { totalItems, isOpen, setIsOpen } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') {
        setIsOpen(false)
        setMenuOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [setIsOpen])

  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 768) setMenuOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const navLinks = [
    { to: '/', label: 'Inicio', end: true },
    { to: '/alta', label: 'Alta' },
    { to: '/contacto', label: 'Contacto' },
  ]

  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <NavLink className="site-header__brand" to="/" aria-label="Ir al inicio">
            <img src="/assets/img/logo.png" alt="Jugueteria Cosmica" />
            <span>
              <span className="site-header__brand-name">Jugueteria Cosmica</span>
              <span className="site-header__brand-tagline">Terror Edition</span>
            </span>
          </NavLink>

          <nav className="site-nav" aria-label="Navegacion principal">
            {navLinks.map(l => (
              <NavLink
                key={l.to}
                className={({ isActive }) =>
                  `site-nav__link${isActive ? ' active' : ''}`
                }
                to={l.to}
                end={l.end}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="site-header__actions">
            <button
              className="site-header__cart-btn"
              onClick={() => setIsOpen(o => !o)}
              aria-label={`Carrito, ${totalItems} producto${totalItems !== 1 ? 's' : ''}`}
              title="Ver carrito"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
              Carrito
              {totalItems > 0 && (
                <span className="site-header__cart-count">{totalItems}</span>
              )}
            </button>

            <button
              className="site-header__menu-btn"
              onClick={() => setMenuOpen(o => !o)}
              aria-label={menuOpen ? 'Cerrar menu' : 'Abrir menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="site-nav--mobile" aria-label="Menu movil">
            {navLinks.map(l => (
              <NavLink
                key={l.to}
                className={({ isActive }) =>
                  `site-nav__link${isActive ? ' active' : ''}`
                }
                to={l.to}
                end={l.end}
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>

      {isOpen && <CartModal />}
    </>
  )
}

export default Header
