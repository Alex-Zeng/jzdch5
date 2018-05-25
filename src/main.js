// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import {Badge, ToastPlugin} from 'vux'
import VueResource from 'vue-resource'

Vue.component('badge', Badge)
Vue.use(ToastPlugin)
Vue.use(VueResource)
require('./fit.js')
require('./assets/common/css/common.css')
Vue.config.productionTip = false

// 搜索
Vue.component('search-view', {
  template: '<div class="search"><input type="text" placeholder="搜索您想要的商品"/><a><i class="icon iconfont icon-xiaoxi"><badge text="9"></badge></i></a></div>'
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
/* beforeEach是router的钩子函数，在进入路由前执行 */
router.beforeEach((to, from, next) => {
  /* 判断是否有标题 */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  /* 执行进入路由，如果不写就不会进入目标页 */
  next()
})

export default router
