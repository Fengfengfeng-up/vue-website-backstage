import request from '@/utils/request'

// 博客列表
export function getBlogList(query) {
  return request({
    url: '/blogs/list',
    method: 'get',
    params: query
  })
}

// 博客详情
export function getBlog(id) {
  return request({
    url: `/blogs/${id}`,
    method: 'get'
  })
}

// 新增博客
export function createBlog(data) {
  return request({
    url: '/blogs/create',
    method: 'post',
    data
  })
}

// 修改博客
export function updateBlog(id, data) {
  return request({
    url: `/blogs/${id}`,
    method: 'patch',
    data
  })
}

// 删除博客
export function deleteBlog(id) {
  return request({
    url: `/blogs/${id}`,
    method: 'delete'
  })
}

// // 删除所有博客
// export function deleteAllBlogs() {
//   return request({
//     url: `/blogs/clear`,
//     method: 'delete'
//   })
// }
