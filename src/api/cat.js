import request from '@/utils/request'

// 猫猫列表
export function getCatList(query) {
  return request({
    url: '/cats/list',
    method: 'get',
    params: query
  })
}

// 猫猫详情
export function getCat(id) {
  return request({
    url: `/cats/${id}`,
    method: 'get'
  })
}

// 新增猫猫
export function createCat(data) {
  return request({
    url: '/cats/create',
    method: 'post',
    data
  })
}

// 修改猫猫
export function updateCat(id, data) {
  return request({
    url: `/cats/${id}`,
    method: 'patch',
    data
  })
}

// 删除猫猫
export function deleteCat(id) {
  return request({
    url: `/cats/${id}`,
    method: 'delete'
  })
}

// // 删除所有猫猫
// export function deleteAllCats() {
//   return request({
//     url: `/cats/clear`,
//     method: 'delete'
//   })
// }

