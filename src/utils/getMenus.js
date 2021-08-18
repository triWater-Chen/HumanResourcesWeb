/**
 * 将后端传入的菜单转换后，添加到 router、存入 store
 */
import api from "../api"
import {resetRouter} from "../router";
import {SessionStorage} from "./sessionStorage";

export const saveMenu = (router, store) => {
    SessionStorage.set("menuLoading", true)

    // 若 store 中已存入，则返回
    if (store.state.myRoutes.length > 0) {
        SessionStorage.set("menuLoading", false)
        return
    }

    api.getMenu().then(data => {
        if (data.success) {
            // 先重置，再添加
            resetRouter()

            // 将 component 从 String 类型改为对象
            let finalRoutes = formatComponent(data.data.menus)

            // 将转换后的数据添加到 router 中，并存入 store
            for (let i = 0; i < finalRoutes.length; i++) {
                router.addRoute(finalRoutes[i])
            }
            store.commit('saveRoutes', finalRoutes)
            SessionStorage.set("menuLoading", false)
        }
    }).catch(() => {
        SessionStorage.set("menuLoading", false)
    })
}

/**
 * 因为传入的菜单中，component 字段是 String 类型，需要转换为对象，去掉""
 */
export const formatComponent = (data) => {

    let finalData = []
    // 遍历 data，item 为 data 中的每一项
    data.forEach(item => {
        // 批量定义，相当于 path = router.path
        let {
            path,
            component,
            name,
            meta,
            iconcls,
            children
        } = item

        if (children && children instanceof Array) {
            // 如果存在子菜单，则将子菜单中的 component 进行转换
            children = formatComponent(children)
        }

        let finalItem = {
            path: path,
            name: name,
            meta: meta,
            iconCls: iconcls,
            children: children,
            component(resolve) {
                if (component.startsWith("Home")) {
                    require(['../views/' + component + '.vue'], resolve)
                } else if (component.startsWith("Employee")) {
                    require(['../views/employee/' + component + '.vue'], resolve)
                } else if (component.startsWith("Personnel")) {
                    require(['../views/personnel/' + component + '.vue'], resolve)
                } else if (component.startsWith("Salary")) {
                    require(['../views/salary/' + component + '.vue'], resolve)
                } else if (component.startsWith("Statistics")) {
                    require(['../views/statistics/' + component + '.vue'], resolve)
                } else if (component.startsWith("System")) {
                    require(['../views/system/' + component + '.vue'], resolve)
                }
            }
        }
        finalData.push(finalItem)
    })
    return finalData
}