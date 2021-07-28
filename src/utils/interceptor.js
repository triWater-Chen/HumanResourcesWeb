import axios from "axios"
import {Message} from "element-ui"

/**
 * 响应拦截
 */
axios.interceptors.response.use(config => {

    // 服务器内部发生错误
    if (config.status && config.status === 200 && config.data.status === 500) {
        Message.error({message: config.data.message})
        return
    }
    return config.data
}, error => {

    if (error.response.status === 504 || error.response.status === 404) {
        Message.error({message: '服务器罢工了ʅ( ´・∧・｀)ʃ '})
    } else if (error.response.status === 403) {
        Message.error({message: '权限不足，请联系管理员'})
    } else if (error.response.status === 401) {
        // TODO：参考 ruoYi，可选择停留还是重新登录
        Message.error({message: '登录状态已过期或尚未登录'})
    } else {
        if (error.response.data.message) {
            Message.error({message: error.response.data.message})
        } else {
            Message.error({message: '发生未知错误，请联系管理员'})
        }
    }
    return error
})

// 给请求路径留个统一前缀
let base = ''

/**
 * 对登录的请求进行封装（因为 spring security 默认不能使用 json 提交登录表单）
 */
export const POSTLogin = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params,
        // 修改格式为 x-www-form-urlencoded
        transformRequest: [function (data) {
            let ret = ''
            for (let i in data) {
                ret += encodeURIComponent(i) + '=' + encodeURIComponent(data[i]) + '&'
            }
            return ret
        }],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

/**
 * 封装 post 请求
 */
export const POST = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params
    })
}

/**
 * 封装 put 请求
 */
export const PUT = (url, params) => {
    return axios({
        method: 'put',
        url: `${base}${url}`,
        data: params
    })
}