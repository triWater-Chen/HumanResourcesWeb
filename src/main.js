import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import api from "./api";
import {SessionStorage} from "./utils/sessionStorage";

// 将 api 全局导入，之后就不需要 import，直接 this.api 即可
// 同理，使用 this.$router 相当于 import router
Vue.prototype.API = api
Vue.prototype.SessionStorage = SessionStorage

Vue.config.productionTip = false

Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
