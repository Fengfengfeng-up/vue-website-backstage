import { getTagList } from '@/api/tag'
const getDefaultState = () => {
  return {
    tags: []
  }
}

const state = getDefaultState()

const mutations = {
  SET_TAGS: (state, tags) => {
    state.tags = tags
  }
}

const actions = {
  // 获取标签
  getTags({ commit }) {
    return new Promise((resolve, reject) => {
      getTagList()
        .then(response => {
          const { data } = response
          commit('SET_TAGS', data)
          resolve()
        })
        .catch(error => {
          console.log(error)
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
