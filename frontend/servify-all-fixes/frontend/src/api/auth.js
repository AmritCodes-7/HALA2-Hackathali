import axios from 'axios'

const BASE = 'http://localhost:8080/api/v1/auth'

export const loginUser = (data) =>
  axios.post(`${BASE}/login`, data)

export const registerUser = (data) =>
  axios.post(`${BASE}/register/user`, data)

export const registerStaff = (formData) =>
  axios.post(`${BASE}/register/staff`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
