import api from './index'

export function fetchBillsByCustomer(customerId) {
  return api.get(`/Bill?customerId=${customerId}`)
}
