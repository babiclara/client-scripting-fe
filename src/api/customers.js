import api from './index'

export function fetchCustomers() {
  return api.get('/Customer')
}
