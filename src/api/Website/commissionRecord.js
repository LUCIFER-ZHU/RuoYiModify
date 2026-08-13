import request from '@/utils/request'

/**
 * 查询提成记录列表
 * @param {Object} query - 查询参数对象
 * @returns {Promise} - 请求Promise
 */
export function listCommissionRecord(query) {
  return request({
    url: '/business/commissionRecord/list',
    method: 'get',
    params: query
  })
}

/**
 * 查询提成记录详细
 * @param {number|string} id - 提成记录ID
 * @returns {Promise} - 请求Promise
 */
export function getCommissionRecord(id) {
  return request({
    url: '/business/commissionRecord/detail/' + id,
    method: 'get'
  })
}

/**
 * 新增提成记录
 * @param {Object} data - 提成记录数据
 * @returns {Promise} - 请求Promise
 */
export function addCommissionRecord(data) {
  return request({
    url: '/business/commissionRecord',
    method: 'post',
    data: data
  })
}

/**
 * 修改提成记录
 * @param {Object} data - 提成记录数据
 * @returns {Promise} - 请求Promise
 */
export function updateCommissionRecord(data) {
  return request({
    url: '/business/commissionRecord',
    method: 'put',
    data: data
  })
}

/**
 * 发放提成记录
 * @param {Object} data - 提成记录数据
 * @returns {Promise} - 请求Promise
 */
export function confirmCommissionRecord(data) {
  return request({
    url: '/business/contractFinance/commission/confirm',
    method: 'post',
    data: data
  })
}

/**
 * 删除提成记录
 * @param {number|string} id - 提成记录ID
 * @returns {Promise} - 请求Promise
 */
export function delCommissionRecord(id) {
  return request({
    url: '/business/commissionRecord/' + id,
    method: 'delete'
  })
}