/**
 * 空校验 null 或 "" 都返回 true
 */
export function isEmpty (obj) {
    if ((typeof obj === 'string')) {
        return !obj || obj.replace(/\s+/g, "") === ""
    } else {
        return (!obj || JSON.stringify(obj) === "{}" || obj.length === 0);
    }
}

/**
 * 对象复制
 * @param obj
 */
export function copy (obj) {
    if (!isEmpty(obj)) {
        return JSON.parse(JSON.stringify(obj));
    }
}

/**
 * 添加日期范围
 * @param params 被添加的参数
 * @param dateRange 要添加的日期
 * @returns 添加日期后的参数
 */
export function addDateRange(params, dateRange) {
    const search = params
    if (null !== dateRange && '' !== dateRange) {
        search.beginTime = dateRange[0]
        search.endTime = dateRange[1]
    }
    return search;
}