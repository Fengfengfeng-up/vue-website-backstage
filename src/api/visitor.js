import request from '@/utils/request'

// 访客列表
export function getVisitorList() {
  return request({
    url: '/visitor/list',
    method: 'get'
  })
}

