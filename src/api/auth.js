import api from './index'

export async function login(email, password) {
  const { access_token } = await api.post('/auth/login', { email, password })
  api.setToken(access_token)
  return access_token
}
