import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 存放变量
    myRoutes: [],
  },
  mutations: {
    // 对变量的操作（同步）

    /**
     * 存入从后端得到的菜单
     */
    saveRoutes(state, data) {
      state.myRoutes = data
    }
  },
  actions: {
    // 对变量的操作（异步）
  },
  modules: {
  }
})
