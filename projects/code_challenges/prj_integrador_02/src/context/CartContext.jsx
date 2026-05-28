import { createContext, useState, useEffect } from 'react'

const STORAGE_KEY = 'jc_cart'

export const CartContext = createContext()

function loadCart() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  function addToCart(product) {
    let success = true
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) {
        if (existing.qty >= product.stock) {
          success = false
          return prev
        }
        return prev.map(i =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        )
      }
      return [...prev, { ...product, qty: 1 }]
    })
    return success
  }

  function updateQty(id, qty) {
    const n = parseInt(qty, 10)
    if (isNaN(n) || n < 1) return
    setItems(prev => prev.map(i => {
      if (i.id !== id) return i
      return { ...i, qty: Math.min(n, i.stock) }
    }))
  }

  function removeFromCart(id) {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  function clearCart() {
    setItems([])
  }

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0)

  const totalPrice = items.reduce((sum, i) => sum + Number(i.price) * i.qty, 0)

  return (
    <CartContext.Provider value={{
      items,
      isOpen,
      setIsOpen,
      addToCart,
      updateQty,
      removeFromCart,
      clearCart,
      totalItems,
      totalPrice,
    }}>
      {children}
    </CartContext.Provider>
  )
}

