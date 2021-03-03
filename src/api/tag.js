import request from '@/utils/request'

// 获取标签列表
export function getTagList(query) {
  return request({
    url: '/tags/list',
    method: 'get',
    params: query
  })
}

// 新增标签
export function createTag(data) {
  return request({
    url: '/tags/create',
    method: 'post',
    data
  })
}

// 修改标签
export function updateTag(id, data) {
  return request({
    url: `/tags/${id}`,
    method: 'patch',
    data
  })
}

// 删除标签
export function deleteTag(id) {
  return request({
    url: `/tags/${id}`,
    method: 'delete'
  })
}

// 删除所有标签
// export function deleteAllTags() {
//   return request({
//     url: '/tags/clear',
//     method: 'delete'
//   })
// }
