import axios from 'axios'
import { BASE_URL } from './config'

const API = axios.create({
  baseURL: BASE_URL
})
API.interceptors.response.use(
  function(response) {
    return response.data
  },
  function(error) {
    return Promise.reject(error)
  }
)

export { API }
