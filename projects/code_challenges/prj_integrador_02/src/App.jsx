import AppRoutes from './routes/AppRoutes'
import { ProductsProvider } from './context/ProductsContext'
import { CartProvider } from './context/CartContext'
import { ToastProvider } from './context/ToastContext'

function App() {
  return (
    <ProductsProvider>
      <CartProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </CartProvider>
    </ProductsProvider>
  )
}

export default App
