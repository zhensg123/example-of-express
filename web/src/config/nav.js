const files = require.context('../router/modules', false, /\.js$/)

let configRoutes = []
/**
 * inject routers
 */
files
  .keys()
  .forEach(key => {
    configRoutes = configRoutes
      .concat(files(key).default)
      // .sort((a, b) => (a.sort ? a.sort - b.sort : -1)) // 读取出文件中的default模块
  })

const menus = {
  mywork: {
    name: '我的工作',
    icon: 'icon-wodegongzuo',
    key: 'mywork'
  }
}
const menuArr = Object.keys(menus).map((menu) => {
  const { name, icon, key} = menus[menu]
  const children = configRoutes.find((route) => route.name === menu).children
  const temp = {
    menu: name,
    icon,
    key,
    children: children.map((item)=>{
      return {
        ...item,
        path: `/${key}/${item.path}`
      }
    })
  }

  return temp
})

export default menuArr

  