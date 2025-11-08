import axios from 'axios'
import { auth } from './firebase'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
})

api.interceptors.request.use(async (config) => {
  try {
    // Always try to use the freshest Firebase ID token
    const currentUser = auth.currentUser
    if (currentUser) {
      const freshToken = await currentUser.getIdToken()
      config.headers.Authorization = `Bearer ${freshToken}`
      return config
    }
  } catch (_) {}
  // Fallback to stored token if user not loaded yet
  const token = localStorage.getItem('authToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
