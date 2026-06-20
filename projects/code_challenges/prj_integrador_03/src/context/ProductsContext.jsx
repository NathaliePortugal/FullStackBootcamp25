import { createContext, useState, useEffect } from 'react'
import { getProducts } from '../api/products'

export const ProductsContext = createContext()

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function fetchProducts() {
    try {
      const data = await getProducts()
      setProducts(data)
    } catch {
      setError('No se pudieron cargar los productos.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [])

  function addProduct(product) {
    setProducts(prev => [product, ...prev])
  }

  return (
    <ProductsContext.Provider value={{ products, loading, error, addProduct, refreshProducts: fetchProducts }}>
      {children}
    </ProductsContext.Provider>
  )
}

