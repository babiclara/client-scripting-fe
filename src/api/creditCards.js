import api from './index'

export function fetchCreditCards() {
  return api.get('/CreditCard')
}
