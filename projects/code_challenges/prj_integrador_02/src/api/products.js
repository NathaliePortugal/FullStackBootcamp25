import axios from 'axios'

const API_URL = 'https://69f922d1c509a40d3aa23ab1.mockapi.io/products'

export async function getProducts() {
  const response = await axios.get(API_URL)
  return response.data
}

export async function createProduct(data) {
  const response = await axios.post(API_URL, data)
  return response.data
}
