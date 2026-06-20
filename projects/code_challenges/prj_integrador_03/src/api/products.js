import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
const API_URL = `${BASE_URL}/api/products`

export async function getProducts() {
  const response = await axios.get(API_URL)
  return response.data
}

export async function createProduct(formData) {
  const response = await axios.post(API_URL, formData)
  return response.data
}
