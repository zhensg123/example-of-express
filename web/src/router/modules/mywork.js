export default [{
  path: '/mywork',
  name: 'mywork',
  title: '我的工作',
  icon: '',
  redirect: '/mywork/people',
  component: () => import(/* webpackChunkName: "mywork" */ '@/views/layout.vue'),
  children: [{
    path: 'people',
    name: 'mywork',
    title: '员工管理',
    icon: '',
    component: () => import(/* webpackChunkName: "mywork" */ '@/views/mywork/people.vue')
   }]
  //  {
  //   path: 'target',
  //   name: 'mywork',
  //   title: '制定目标',
  //   icon: '',
  //   component: () => import(/* webpackChunkName: "mywork" */ '@/views/mywork/target.vue')
  // }, {
  //   path: 'do',
  //   name: 'mywork',
  //   title: '执行下去',
  //   icon: '',
  //   component: () => import(/* webpackChunkName: "mywork" */ '@/views/mywork/do.vue')
  // }, {
  //   path: 'monitor',
  //   name: 'mywork',
  //   title: '保障执行',
  //   icon: '',
  //   component: () => import(/* webpackChunkName: "mywork" */ '@/views/mywork/monitor.vue')
  // }]
}]

// self-jsonstringify self-new  create-js  closure  instanceof  promise-chunk  for-in-break  mywork-currying  self-setinterval

