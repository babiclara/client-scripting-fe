import axios from 'axios'

class ApiClient {
  constructor(baseURL) {
    this.token = null

    this.http = axios.create({ baseURL })

    this.http.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`
      }
      return config
    })
  }

  setToken(token) {
    this.token = token
  }

  async get(path) {
    const { data } = await this.http.get(path)
    return data
  }

  async post(path, body) {
    const { data } = await this.http.post(path, body)
    return data
  }

  async put(path, body) {
    const { data } = await this.http.put(path, body)
    return data
  }

  async remove(path) {
    const { data } = await this.http.delete(path)
    return data
  }
}

export default ApiClient
