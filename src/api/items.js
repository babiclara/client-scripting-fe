import api from './index'

export function fetchItemsByBill(billId) {
  return api.get(`/Item?billId=${billId}`)
}

export function fetchItem(id) {
  return api.get(`/Item/${id}`)
}

export function createItem(item) {
  return api.post('/Item', item)
}

export function updateItem(id, item) {
  return api.put(`/Item/${id}`, item)
}

export function deleteItem(id) {
  return api.remove(`/Item/${id}`)
}
