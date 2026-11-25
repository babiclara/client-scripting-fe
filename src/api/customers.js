import api from './index'

export function fetchCustomers() {
  return api.get('/Customer')
}

export function fetchCustomer(id) {
  return api.get(`/Customer/${id}`)
}
