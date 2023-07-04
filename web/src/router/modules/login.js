export default [{
    path: '/login',
    name: 'login',
    title: '登录',
    icon: '',
    components: {
       login: () => import(/* webpackChunkName: "login" */ '@/views/login.vue')
    }
  },{
    path: '/register',
    name: 'register',
    title: '注册',
    icon: '',
    components: {
       login: () => import(/* webpackChunkName: "login" */ '@/views/register.vue')
    }
  }]
  
  // self-jsonstringify self-new  create-js  closure  instanceof  promise-chunk  for-in-break  mywork-currying  self-setinterval
  
  