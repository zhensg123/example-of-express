import { ajaxGetData, ajaxPostData, ajaxPutData, ajaxDeleteData, ajaxPutJson, ajaxDeleteJson, ajaxPostJson } from '@/config/ajaxService'
const VUE_APP_client_domain = process.env.VUE_APP_client_domain
const myworkApi = {
  getTestApi (params) { // 获取所有树
    return ajaxGetData({ url: `${VUE_APP_client_domain}/users`, params: params })
  },
  getEmployeeAll (params) { // 获取所有树
    return ajaxGetData({ url: `http://localhost:3000/employee/findAll`, params: params })
  },
  postAddEmployee (params) { // 获取所有树
    return ajaxPostJson({ url: `http://localhost:3000/employee/add`, params: params })
  },
  postUpdateEmployee (params) { // 获取所有树
    return ajaxPostJson({ url: `http://localhost:3000/employee/update`, params: params })
  },
  delEmployeeById (params) { // 获取所有树
    return ajaxDeleteData({ url: `http://localhost:3000/employee/del`, params: params })
  }
}
export default myworkApi
