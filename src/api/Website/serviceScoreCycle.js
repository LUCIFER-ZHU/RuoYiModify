import request from '@/utils/request'

// ==================== 打分周期管理接口 ====================

/**
 * 分页查询打分周期列表
 * @param {Object} query - 查询参数
 * @param {number} [query.pageNum] - 分页页码
 * @param {number} [query.pageSize] - 每页大小
 * @param {string} [query.cycleName] - 周期名称（模糊查询）
 * @returns {Promise} 请求Promise
 */
export function listServiceScoreCycle(query) {
  return request({
    url: '/customer/service-score-cycle/list',
    method: 'get',
    params: query
  })
}

/**
 * 查询所有未删除的打分周期
 * @returns {Promise} 请求Promise
 */
export function getAllCycles() {
  return request({
    url: '/customer/service-score-cycle/all',
    method: 'get'
  })
}

/**
 * 按客户ID查询关联的打分周期
 * @param {string} customerId - 客户ID
 * @returns {Promise} 请求Promise
 */
export function getCyclesByCustomer(customerId) {
  return request({
    url: '/customer/service-score-cycle/by-customer',
    method: 'get',
    params: { customerId }
  })
}

/**
 * 按周期ID查询打分周期信息
 * @param {string} cycleId - 周期ID
 * @returns {Promise} 请求Promise
 */
export function getServiceScoreCycle(cycleId) {
  return request({
    url: '/customer/service-score-cycle/info',
    method: 'get',
    params: { cycleId }
  })
}

/**
 * 创建打分周期
 * @param {Object} data - 周期数据
 * @param {string} [data.cycleName] - 周期名称
 * @param {string} [data.reviewDeadline] - 审查内容截止时间
 * @param {number} [data.cycleScore] - 周期总分，缺省为100
 * @returns {Promise} 请求Promise
 */
export function addServiceScoreCycle(data) {
  return request({
    url: '/customer/service-score-cycle/add',
    method: 'post',
    data: data
  })
}

/**
 * 修改打分周期
 * @param {Object} data - 周期数据
 * @param {string} [data.cycleId] - 周期ID（必填）
 * @param {string} [data.cycleName] - 周期名称
 * @param {string} [data.reviewDeadline] - 审查内容截止时间
 * @param {number} [data.cycleScore] - 周期总分
 * @returns {Promise} 请求Promise
 */
export function updateServiceScoreCycle(data) {
  return request({
    url: '/customer/service-score-cycle/edit',
    method: 'put',
    data: data
  })
}

/**
 * 删除打分周期
 * @param {string} cycleId - 周期ID
 * @returns {Promise} 请求Promise
 */
export function delServiceScoreCycle(cycleId) {
  return request({
    url: '/customer/service-score-cycle/delete/' + cycleId,
    method: 'delete'
  })
}

/**
 * 查询指定打分周期下所有未删除的客户信息
 * @param {string} cycleId - 打分周期ID
 * @returns {Promise} 请求Promise
 */
export function getCycleCustomers(cycleId) {
  return request({
    url: '/customer/service-score-cycle/customers',
    method: 'get',
    params: { cycleId }
  })
}

/**
 * 整体覆盖周期客户
 * @param {Object} data - 周期客户数据
 * @param {string} data.cycleId - 目标周期ID
 * @param {string[]} data.customerIds - 客户ID列表
 * @returns {Promise} 请求Promise
 */
export function replaceCycleCustomers(data) {
  return request({
    url: '/customer/service-score-cycle/replaceCustomers',
    method: 'put',
    data: data
  })
}

/**
 * 追加合并周期客户
 * @param {Object} data - 周期客户数据
 * @param {string} data.cycleId - 目标周期ID
 * @param {string[]} data.customerIds - 客户ID列表
 * @returns {Promise} 请求Promise
 */
export function addCycleCustomers(data) {
  return request({
    url: '/customer/service-score-cycle/addCustomers',
    method: 'put',
    data: data
  })
}
