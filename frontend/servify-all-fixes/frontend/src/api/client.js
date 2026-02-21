import axios from 'axios'

const BASE = 'http://localhost:8080/api/v1'

const api = axios.create({ baseURL: BASE })

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('sf_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('sf_token')
      localStorage.removeItem('sf_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
