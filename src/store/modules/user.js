import { login, getProfile, updateProfile, updatePassword } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { Message } from 'element-ui'
import roter from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // 登陆
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password })
        .then(response => {
          const { token } = response
          commit('SET_TOKEN', token)
          setToken(token)
          resolve()
        })
        .catch(error => {
          console.log(error)
          reject(error)
        })
    })
  },

  // 获取用户资料
  getProfile({ commit, state }) {
    return new Promise((resolve, reject) => {
      getProfile(state.token)
        .then(response => {
          const { name, avatar } = response

          name && commit('SET_NAME', name)
          avatar && commit('SET_AVATAR', avatar)
          resolve(response)
        })
        .catch(() => {
          reject('未能成功获取用户资料，请重新登陆！')
        })
    })
  },

  // 退出登陆
  logout({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
      roter.push('/login')
      resolve()
    })
  },

  // 移除token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  },

  // 修改用户资料
  updateProfile({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      updateProfile(userInfo)
        .then(response => {
          const { name, avatar } = response
          commit('SET_NAME', name)
          commit('SET_AVATAR', avatar)
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // 修改密码
  updatePassword({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      updatePassword(userInfo)
        .then(response => {
          Message.success(response.message)
          resolve(response.message)
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
