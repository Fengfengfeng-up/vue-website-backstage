import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getProfile() {
  return request({
    url: '/user/profile',
    method: 'get'
  })
}

export function updateProfile(data) {
  return request({
    url: '/user/profile',
    method: 'patch',
    data
  })
}

export function updatePassword(data) {
  return request({
    url: '/user/password',
    method: 'patch',
    data
  })
}

