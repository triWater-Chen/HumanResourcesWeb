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

    // 获取菜单
    getMenu() {
        return get('/system/menu')
    },

    // ----- 职位管理 -----
    positionGet() {
        return get('/system//basic/position/list')
    },
    positionAdd(params) {
        return post('/system//basic/position/add', params)
    },
    positionUpdate(params) {
        return post('/system//basic/position/update', params)
    },
    positionRemove(params) {
        return post('/system//basic/position/remove/' + params)
    },
}