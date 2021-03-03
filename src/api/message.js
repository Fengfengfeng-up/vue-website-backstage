import request from '@/utils/request'

// 留言列表
export function getMessageList() {
  return request({
    url: '/comments/list',
    method: 'get'
  })
}

// 删除留言
export function deleteMessage(id) {
  return request({
    url: `/comments/${id}`,
    method: 'delete'
  })
}
