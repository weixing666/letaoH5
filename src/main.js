import Vue from 'vue'
import App from './App.vue'

// 导入路由对象
import router from './router/router.js'

import axios from 'axios'
import Vuex from 'vuex' // 安装后，在其他组件可以通过 this.$store.***来调用其身上相关的属性

// 注册时可以配置额外的选项
import { Lazyload, Toast } from 'vant'

// 导入使用的vant组件
import '@/vant.js';

import '@/util/filter.js'

import "@/assets/scss/common.scss";

import "@/assets/scss/icon-font.css"

// 引入 store
import store from '@/store/carStore';

Vue.prototype.$eventBus = new Vue();
Vue.prototype.$api = axios
Vue.prototype.$toast = Toast

Vue.use(Lazyload, {
  lazyComponent: true
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
