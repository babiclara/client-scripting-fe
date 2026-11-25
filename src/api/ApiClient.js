import axios from 'axios'

class ApiClient {
  constructor(baseURL) {
    this.http = axios.create({ baseURL })
  }

  async get(path) {
    const { data } = await this.http.get(path)
    return data
  }
}

export default ApiClient
