import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About'
import Login from "../views/Login"
import Test1 from "../views/Test1"
import Test2 from "../views/Test2"
import {saveMenu} from "../utils/getMenus"
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '/test1',
        name: '测试1',
        component: Test1
      },
      {
        path: '/test2',
        name: '测试2',
        component: Test2
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    hidden: true
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    hidden: true
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '*',
    redirect: '/home'
  }
]

const router = new VueRouter({
  routes
})

// 全局路由守卫
router.beforeEach(((to, from, next) => {
  if (to.path === '/login') {
    next()
  } else {
    // 因为若是刷新，保存的菜单就消失了，所以需要全局，在每次页面改变时进行获取菜单，
    saveMenu(router, store)
    next()
  }
}))

export default router
