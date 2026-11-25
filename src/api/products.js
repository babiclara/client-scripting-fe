import api from './index'

export function fetchProducts() {
  return api.get('/Product')
}
