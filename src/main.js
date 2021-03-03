import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import dayjs from 'dayjs'

import '@/icons'
import '@/permission'

Vue.use(ElementUI, { locale })

Vue.prototype.$bus = new Vue()
Vue.prototype.$parseTime = (time, format = 'YYYY-MM-DD') => {
  return dayjs(time).format(format)
}
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
