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
        return get('/system/basic/position/list')
    },
    positionAdd(params) {
        return post('/system/basic/position/add', params)
    },
    positionUpdate(params) {
        return post('/system/basic/position/update', params)
    },
    positionRemove(params) {
        // 删除单个，未使用
        return post('/system/basic/position/remove/' + params)
    },
    positionRemoveBatch(params) {
        return post('/system/basic/position/removeBatch', params)
    },

    // ----- 职称管理 -----
    jobLevelGet() {
        return get('/system/basic/jobLevel/list')
    },
    jobLevelAdd(params) {
        return post('/system/basic/jobLevel/add', params)
    },
    jobLevelUpdate(params) {
        return post('/system/basic/jobLevel/update', params)
    },
    jobLevelRemoveBatch(params) {
        return post('/system//basic/jobLevel/removeBatch', params)
    },

    // ----- 权限管理 -----
    roleGet(params) {
        return get('/system/basic/role/list', params)
    },
    roleStatus(params) {
        return post('/system/basic/role/changeStatus', params)
    },
    roleAddOrUpdate(params) {
        return post('/system/basic/role/saveOrUpdate', params)
    },
    roleRemoveBatch(params) {
        return post('/system/basic/role/removeBatch', params)
    },
    // ----- 查询所有菜单 -----
    menuTree() {
        return get('/system/basic/role/menuTree')
    },
    // ----- 查询某个角色的所有菜单 -----
    menuIdByRole(params) {
        return get('/system/basic/role/menuByRole/' + params)
    },

    // ----- 部门管理 -----
    departmentGet(params) {
        return get('/system/basic/department/list', params)
    },
    departmentAdd(params) {
        return post('/system/basic/department/add', params)
    },
    departmentUpdate(params) {
        return post('/system/basic/department/update', params)
    },
    departmentRemove(params) {
        return post('/system/basic/department/remove/' + params)
    },
    // ----- 查询部门树 -----
    departmentTree() {
        return get('/system/basic/department/departmentTree')
    },

    // ----- 用户管理 -----
    hrGet(params) {
        return get('/system/hr/list', params)
    },
    hrAdd(params) {
        return post('/system/hr/add', params)
    },
    hrUpdate(params) {
        return post('/system/hr/update', params)
    },
    hrRemove(params) {
        return post('/system/hr/remove/' + params)
    },
    hrResetPassword(params) {
        return post('/system/hr/resetPassword', params)
    },
    // ----- 根据 id 查询所属所有角色 -----
    hrWithRole(params) {
        return get('/system/hr/hrWithRole/' + params)
    },
    // ----- 根据 id 更新所属所有角色 -----
    hrUpdateByRole(params) {
        return post('/system/hr/hrUpdateByRole', params)
    },

    // ----- 员工管理 -----
    employeeGet(params) {
        return get('/personnel/emp/list', params)
    },
    employeeAdd(params) {
        return post('/personnel/emp/add', params)
    },
    employeeUpdate(params) {
        return post('/personnel/emp/update', params)
    },
    employeeRemove(params) {
        return post('/personnel/emp/remove/' + params)
    },
}