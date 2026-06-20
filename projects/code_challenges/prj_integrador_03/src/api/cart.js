import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export async function submitCart(items, total) {
  const response = await axios.post(`${BASE_URL}/api/cart`, { items, total })
  return response.data
}
