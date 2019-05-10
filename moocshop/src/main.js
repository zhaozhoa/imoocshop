// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// 区域滚动插件，懒加载
import infiniteScroll from 'vue-infinite-scroll'
import axios from 'axios'
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

Vue.prototype.Axios = axios
// 配置全局过滤器
Vue.filter('currency', currency)
Vue.config.productionTip = false
// 图片懒加载插件
Vue.use(infiniteScroll)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
