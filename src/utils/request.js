import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

const service = axios.create({
  baseURL: process.env.VUE_APP_API || 'https://www.striveforus.com/admin/api',
  timeout: 5000
})

service.interceptors.request.use(
  config => {
    if (getToken()) {
      config.headers.Authorization = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const res = response.data
    return res
  },
  error => {
    const { statusCode, message } = error.response.data
    Message({
      message,
      // type: '网络异常',
      type: 'warning',
      duration: 5 * 1000
    })

    if (statusCode === 401) {
      store.dispatch('user/logout')
    }

    return Promise.reject(error)
  }
)

export default service
