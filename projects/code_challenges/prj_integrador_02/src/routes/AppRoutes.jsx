import { BrowserRouter, Routes, Route } from 'react-router'
import Layout from '../layout/Layout'
import Home from '../pages/Home'
import Alta from '../pages/Alta'
import Contacto from '../pages/Contacto'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="alta" element={<Alta />} />
          <Route path="contacto" element={<Contacto />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
