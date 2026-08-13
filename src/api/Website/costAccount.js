import request from '@/utils/request'

/**
 * 查询成本核算列表
 * @param {Object} query - 查询参数
 * @returns {Promise} - 请求Promise
 */
export function listCostAccounting(query) {
  return request({
    url: '/business/costAccounting/list',
    method: 'get',
    params: query
  })
}

/**
 * 查询成本核算详细
 * @param {number} id - 成本核算ID
 * @returns {Promise} - 请求Promise
 */
export function getCostAccounting(id) {
  return request({
    url: '/business/costAccounting/detail/' + id,
    method: 'get'
  })
}

/**
 * 新增成本核算
 * @param {Object} data - 成本核算数据
 * @returns {Promise} - 请求Promise
 */
export function addCostAccounting(data) {
  return request({
    url: '/business/costAccounting',
    method: 'post',
    data: data
  })
}

/**
 * 修改成本核算
 * @param {Object} data - 成本核算数据
 * @returns {Promise} - 请求Promise
 */
export function updateCostAccounting(data) {
  return request({
    url: '/business/costAccounting',
    method: 'put',
    data: data
  })
}

/**
 * 删除成本核算
 * @param {number} id - 成本核算ID
 * @returns {Promise} - 请求Promise
 */
export function delCostAccounting(id) {
  return request({
    url: '/business/costAccounting/' + id,
    method: 'delete'
  })
} 