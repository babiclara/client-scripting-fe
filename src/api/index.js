import ApiClient from './ApiClient'
import { readSession } from '../utils/session'

const api = new ApiClient('http://localhost:3000')

const restored = readSession()

if (restored) {
  api.setToken(restored.token)
}

export default api
