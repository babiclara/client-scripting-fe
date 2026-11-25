import api from './index'

export function fetchBillsByCustomer(customerId) {
  return api.get(`/Bill?customerId=${customerId}`)
}

export function fetchBill(id) {
  return api.get(`/Bill/${id}`)
}

export function createBill(bill) {
  return api.post('/Bill', bill)
}

export function updateBill(id, bill) {
  return api.put(`/Bill/${id}`, bill)
}

export function deleteBill(id) {
  return api.remove(`/Bill/${id}`)
}
