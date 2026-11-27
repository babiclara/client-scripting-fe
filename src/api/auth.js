import api from './index'
import { clearSession, saveSession } from '../utils/session'

export async function login(email, password) {
  const { access_token } = await api.post('/auth/login', { email, password })
  api.setToken(access_token)
  saveSession({ token: access_token, email })

  return access_token
}

export function logout() {
  api.setToken(null)
  clearSession()
}
