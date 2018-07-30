import axios from 'axios'
import qs from 'qs'
import config from './config'

const service = axios.create(config)

// POST 传参序列化
service.interceptors.request.use(

  config => {
    if (config.method === 'post') config.data = qs.stringify(config.data)
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
// 返回状态判断
service.interceptors.response.use(
  res => {
    const {status} = res.data

    if (status === -2) {
      localStorage.clear()
      window.location = '/#/loginByCode'
    }
    return res.data
  },
  error => {
    return Promise.reject(error)
  }
)

export default {
  post (url, data) {
    return service({
      method: 'post',
      url,
      data: data
    })
  },
  get (url, data) {
    return service({
      method: 'get',
      url,
      params: data
    })
  },
  delete (url, data) {
    return service({
      methods: 'delete',
      url,
      params: data
    })
  }
}
