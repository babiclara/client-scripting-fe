import api from './index'

export function fetchBillsByCustomer(customerId) {
  return api.get(`/Bill?customerId=${customerId}`)
}

export function fetchBill(id) {
  return api.get(`/Bill/${id}`)
}
