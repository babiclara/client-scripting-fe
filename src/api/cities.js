import api from './index'

export function fetchCities() {
  return api.get('/City')
}
