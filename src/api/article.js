import request from '@/utils/request'

// 文章列表
export function getArticleList(query) {
  return request({
    url: '/articles/list',
    method: 'get',
    params: query
  })
}

// 文章详情
export function getArticle(id) {
  return request({
    url: `/articles/${id}`,
    method: 'get'
  })
}

// 新增文章
export function createArticle(data) {
  return request({
    url: '/articles/create',
    method: 'post',
    data
  })
}

// 修改文章
export function updateArticle(id, data) {
  return request({
    url: `/articles/${id}`,
    method: 'patch',
    data
  })
}

// 删除文章
export function deleteArticle(id) {
  return request({
    url: `/articles/${id}`,
    method: 'delete'
  })
}

// // 删除所有文章
// export function deleteAllArticles() {
//   return request({
//     url: `/articles/clear`,
//     method: 'delete'
//   })
// }

