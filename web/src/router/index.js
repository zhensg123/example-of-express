import Vue from 'vue'
import VueRouter from 'vue-router'
import configRoutes from './modules'
import E403 from '@/views/E403'
import E404 from '@/views/E404'
import Cookies from 'js-cookie'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'mywork',
    redirect: '/mywork/people'
  },
  {
    path: '/error',
    name: 'Error',
    component: E403
  },
  {
    path: '*',
    component: E404,
    name: 'error',
    meta: {
      title: '页面没找到'
    }
  },
  ...configRoutes
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((from, to, next) => {
  // 如果是开发环境不做校验 否则对cookie做校验
  if (from.name === 'login' || from.name === 'register') {
    next()
  } else {
    if (Cookies.get('token')) {
      next()
    } else {
      next('/login')
    }
  }
})
const originalPush = VueRouter.prototype.push
// 修改原型对象中的push方法
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
export default router
