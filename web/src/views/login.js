import { ajaxGetData, ajaxPostData, ajaxPutData, ajaxDeleteData, ajaxPutJson, ajaxDeleteJson, ajaxPostJson } from '@/config/ajaxService'
const VUE_APP_client_domain = process.env.VUE_APP_client_domain
const loginApi = {
  postUserLogin (params) { // 登录成功
    return ajaxPostJson({ url: `http://localhost:3000/user/login`, params: params })
  },
  postUserRegister (params) { // 登录成功
    return ajaxPostJson({ url: `http://localhost:3000/user/register`, params: params })
  }
}
export default loginApi