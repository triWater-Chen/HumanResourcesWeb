import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About'
import Login from "../views/Login"
import {saveMenu} from "../utils/getMenus"
import store from '../store'
import {SessionStorage} from "../utils/sessionStorage";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  } else {
    if (SessionStorage.get("USER")) {
      // 因为若是刷新，保存的菜单就消失了，所以需要全局，在每次页面改变时进行获取菜单，

      // 保证每次刷新只进行添加一次（因为 beforeEach 会执行多次）
      if (SessionStorage.get("menuLoading")) {
        next()
      } else {
        saveMenu(router, store)
        next()
      }
    } else {
      next('/login')
    }
  }
})

// 用于清空 addRoute 记录
const createRouter = () => new VueRouter(({
  mode: 'history',
  routes
}))
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
