import request from '@/utils/request'

export function upload(data) {
  return request({
    url: '/upload',
    method: 'post',
    data
  })
}

export function getToken() {
  return request({
    url: '/uploadToken',
    method: 'get'
  })
}
