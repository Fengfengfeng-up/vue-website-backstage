import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import importAll from '@/utils/import-all'

const modules = importAll(require.context('./modules', false, /\.js$/))

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: { ...modules },
  getters
})

export default store
