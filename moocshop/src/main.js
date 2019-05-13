// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// 区域滚动插件，懒加载
import infiniteScroll from 'vue-infinite-scroll'
import axios from 'axios'
import Vuex from 'vuex'
// 价格格式化过滤器
import { currency } from './util/currency'
import '@/assets/css/base.css'
import '@/assets/css/product.css'
// 全局组件
import NavHeader from '@/components/Header'
import NavFooter from '@/components/Footer'
import NavBread from '@/components/Bread'
import Modal from '@/components/Modal'
Vue.component('NavHeader', NavHeader)
Vue.component('NavFooter', NavFooter)
Vue.component('NavBread', NavBread)
Vue.component('Modal', Modal)

Vue.use(Vuex)
Vue.prototype.Axios = axios
// 配置全局过滤器
Vue.filter('currency', currency)
Vue.config.productionTip = false
// 图片懒加载插件
Vue.use(infiniteScroll)
// 全局状态管理
const store = new Vuex.Store({
  state: {
    nickName: '',
    cartCount: 0
  },
  mutations: {
    updateUserInfo (state, nickName) {
      state.nickName = nickName
    },
    updateCartCount (state, cartCount) {
      state.cartCount += cartCount
    },
    initCartCount (state, cartCount) {
      state.cartCount = cartCount
    }
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
