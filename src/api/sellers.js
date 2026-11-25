import api from './index'

export function fetchSellers() {
  return api.get('/Seller')
}
