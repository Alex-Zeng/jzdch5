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
    // const {status} = res.data

    // if (status === -2) {
    //   window.$nuxt.$message({
    //     showClose: true,
    //     message: '用户未登录或登录已失效，请登录后继续操作',
    //     type: 'error'
    //   })
    //   window.$nuxt.$router.replace('/auth')
    // }
    return res.data
  },
  error => {
    return Promise.reject(error)
  }
)

export default {
  post (url, data) {
    console.log('post request url', url)
    return service({
      method: 'post',
      url,
      data: data
    })
  },
  get (url, data) {
    console.log('get request url', url)
    return service({
      method: 'get',
      url,
      params: data
    })
  },
  delete (url, data) {
    console.log('delete request url', url)
    return service({
      methods: 'delete',
      url,
      params: data
    })
  }
}
