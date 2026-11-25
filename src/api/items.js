import api from './index'

export function fetchItemsByBill(billId) {
  return api.get(`/Item?billId=${billId}`)
}
