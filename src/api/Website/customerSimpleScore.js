import request from '@/utils/request'

/**
 * 分页查询所有业务员及其不及格次数
 * @param {Object} query - 查询参数
 * @param {number} query.pageNum - 分页页码
 * @param {number} query.pageSize - 每页大小
 * @param {number} [query.userId] - 销售人员用户ID（可选）
 * @param {string} [query.startDate] - 查询开始日期，格式 yyyy-MM-dd
 * @param {string} [query.endDate] - 查询结束日期，格式 yyyy-MM-dd
 * @returns {Promise} 请求Promise
 */
export function listBusinessUserFailCount(query) {
  return request({
    url: '/customer/simple-score/businessUserFailCount',
    method: 'get',
    params: query
  })
}

/**
 * 根据业务员ID查询对应被评分的客户
 * @param {number|string} followerId - 业务员用户ID
 * @param {Object} [params] - 查询参数
 * @param {string} [params.startDate] - 查询开始日期，格式 yyyy-MM-dd
 * @param {string} [params.endDate] - 查询结束日期，格式 yyyy-MM-dd
 * @returns {Promise} 请求Promise
 */
export function listScoredCustomers(followerId, params = {}) {
  return request({
    url: '/customer/simple-score/scoredCustomers',
    method: 'get',
    params: { followerId, ...params }
  })
}

/**
 * 根据客户ID查询打分列表
 * @param {string} customerId - 客户ID
 * @param {Object} [params] - 查询参数
 * @param {string} [params.startDate] - 查询开始日期，格式 yyyy-MM-dd
 * @param {string} [params.endDate] - 查询结束日期，格式 yyyy-MM-dd
 * @returns {Promise} 请求Promise
 */
export function listSimpleScore(customerId, params = {}) {
  return request({
    url: '/customer/simple-score/list',
    method: 'get',
    params: { customerId, ...params }
  })
}

/**
 * 添加客服简单打分
 * @param {Object} data - 打分数据
 * @param {string} data.customerId - 客户ID
 * @param {number} data.score - 分数（0.00~100.00）
 * @param {string} [data.reason] - 扣分原因
 * @returns {Promise} 请求Promise
 */
export function addSimpleScore(data) {
  return request({
    url: '/customer/simple-score/add',
    method: 'post',
    data
  })
}

/**
 * 修改客服简单打分
 * @param {Object} data - 打分数据
 * @param {string} data.scoreId - 打分记录UUID
 * @param {number} data.score - 分数（0.00~100.00）
 * @param {string} [data.reason] - 扣分原因
 * @returns {Promise} 请求Promise
 */
export function updateSimpleScore(data) {
  return request({
    url: '/customer/simple-score/edit',
    method: 'put',
    data
  })
}

/**
 * 删除客服简单打分
 * @param {string} scoreId - 打分记录UUID
 * @returns {Promise} 请求Promise
 */
export function delSimpleScore(scoreId) {
  return request({
    url: '/customer/simple-score/delete',
    method: 'delete',
    data: { scoreId }
  })
}