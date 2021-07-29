import {get, post} from "../utils/request";

export default {

    // 登录
    login(params) {
        return post('/doLogin', params)
    },

    // 登出
    logout() {
        return get('/logout')
    },

    getMenu() {
        return get('/system/config/menu')
    }
}