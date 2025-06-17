// lib/apiClient.js or useApiClient.ts
import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

async function request(method, url, options = {}) {
  try {
    const response = await client.request({
      method,
      url,
      ...options,
    })

    return { data: response.data, error: null }
  } catch (error) {
    return {
      data: null,
      error: {
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
        raw: error,
      },
    }
  }
}

export default {
  get: (url, options) => request('get', url, options),
  post: (url, options) => request('post', url, options),
  put: (url, options) => request('put', url, options),
  patch: (url, options) => request('patch', url, options),
  delete: (url, options) => request('delete', url, options),
}
