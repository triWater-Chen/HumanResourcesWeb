import axios from "axios"
import {Message, MessageBox} from "element-ui"
import router from "../router";

// 设置响应时间
axios.defaults.timeout = 5 * 1000

// 设置路径统一前缀
axios.defaults.baseURL = '/cl'

/**
 * 响应拦截
 */
axios.interceptors.response.use(response => {

    // 服务器内部发生错误
    if (response.status && response.status === 200 && !response.data.success) {
        // 给出后端返回的错误提示
        Message.error({message: response.data.message})
        return response
    }
    return response
}, error => {
    if (error.toString() === "Error: Network Error") {
        Message.error({message: '网络连接异常'})
    } else if (error.toString().includes("timeout")) {
        Message.error({message: '请求超时'})
    } else if (error.response.status === 504 || error.response.status === 404) {
        Message.error({message: '服务器罢工了ʅ( ´・∧・｀)ʃ '})
    } else if (error.response.status === 403) {
        Message.error({message: '权限不足，请联系管理员'})
    } else if (error.response.status === 401) {
        MessageBox.confirm('登录状态已过期，您可以继续留在该页面，或重新登录',
            '系统提示',
            {
                confirmButtonText: '重新登录',
                cancelButtonText: '取 消',
                type: 'warning',
                closeOnClickModal: false
            }).then(() => {
                router.replace('/login').then()
            }).catch(() => {})
    } else {
        if (error.response.data.message) {
            Message.error({message: error.response.data.message})
        } else {
            Message.error({message: '发生未知错误，请联系管理员'})
        }
    }
    return error
})

/**
 * 封装 get 请求
 */
export function get(url, params) {
    return new Promise(((resolve, reject) => {
        axios.get(url, params)
            .then(res => {
                if (res !== undefined) {
                    resolve(res.data)
                }
            })
            .catch(err => {
                reject(err)
            })
    }))
}

/**
 * 封装 post 请求
 */
export function post(url, params) {
    return new Promise(((resolve, reject) => {
        // post 提交的参数需要序列化
        axios.post(url, params)
            .then(res => {
                if (res !== undefined) {
                    resolve(res.data)
                }
            })
            .catch(err => {
                reject(err)
            })
    }))
}