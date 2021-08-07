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