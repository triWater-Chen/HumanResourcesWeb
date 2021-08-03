import {get, post} from "../utils/request";
import * as QueryString from "querystring";

export default {

    // ----- 初始化 -----
    // 登录（因为后端需要 JSON 格式）
    login(params) {
        return post('/doLogin', QueryString.stringify(params))
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
        // 删除单个，未使用
        return post('/system//basic/position/remove/' + params)
    },
    positionRemoveBatch(params) {
        return post('/system//basic/position/removeBatch', params)
    },
}