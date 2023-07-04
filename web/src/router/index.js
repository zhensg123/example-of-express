import Vue from 'vue'
import VueRouter from 'vue-router'
import configRoutes from './modules'
import E403 from '@/views/E403'
import E404 from '@/views/E404'

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

  // console.log(from, 'from', to)
  // 如果是开发环境不做校验 否则对cookie做校验
  if (Cookies.get('xone')) {

  } else {
   
  }
})

export default router
