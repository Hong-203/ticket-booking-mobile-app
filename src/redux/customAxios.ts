import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

const instance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BACKEND_URL // tương đương VITE
})

instance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

instance.interceptors.response.use(
  (response) => {
    if (response.data && response.data.data) return response.data
    return response
  },
  (error) => {
    if (error.response && error.response.data) return error.response.data
    return Promise.reject(error)
  }
)

export default instance
