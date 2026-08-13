import request from '@/utils/request'

// ==================== 客服打分管理接口 ====================

/**
 * 查询客户打分列表
 * @param {string} customerId - 客户ID
 * @returns {Promise} 请求Promise
 */
export function listCustomerScore(customerId) {
  return request({
    url: '/customer/score/list',
    method: 'get',
    params: { customerId }
  })
}

/**
 * 添加客服打分
 * @param {Object} data - 打分数据
 * @param {string} data.customerId - 客户ID
 * @param {number} data.deductionScore - 扣分分数（0.00~100.00）
 * @param {string} data.deductionReason - 扣分原因
 * @param {string} data.currentFollower - 当前跟进人
 * @returns {Promise} 请求Promise
 */
export function addCustomerScore(data) {
  return request({
    url: '/customer/score/add',
    method: 'post',
    data: data
  })
}

/**
 * 修改客服打分
 * @param {Object} data - 打分数据
 * @param {string} data.scoreId - 打分记录UUID
 * @param {number} [data.deductionScore] - 扣分分数
 * @param {string} [data.deductionReason] - 扣分原因
 * @param {string} [data.currentFollower] - 当前跟进人
 * @returns {Promise} 请求Promise
 */
export function updateCustomerScore(data) {
  return request({
    url: '/customer/score/edit',
    method: 'put',
    data: data
  })
}

/**
 * 删除客服打分
 * @param {string} scoreId - 打分记录UUID
 * @returns {Promise} 请求Promise
 */
export function delCustomerScore(scoreId) {
  return request({
    url: '/customer/score/delete',
    method: 'delete',
    data: { scoreId }
  })
}

// ==================== 客服记录管理接口 ====================

/**
 * 分页查询客服记录
 * @param {Object} query - 查询参数
 * @param {number} query.pageNum - 分页页码
 * @param {number} query.pageSize - 每页大小
 * @param {string} [query.customerId] - 客户ID（可选）
 * @param {number} [query.recordType] - 记录类型：0-销售回访，1-客户回访
 * @returns {Promise} 请求Promise
 */
export function listCustomerServiceRecord(query) {
  return request({
    url: '/customer/service-record/list',
    method: 'get',
    params: query
  })
}

/**
 * 查询客服记录详情
 * @param {string} recordId - 记录UUID
 * @returns {Promise} 请求Promise
 */
export function getCustomerServiceRecord(recordId) {
  return request({
    url: '/customer/service-record/detail',
    method: 'post',
    data: { recordId }
  })
}

/**
 * 添加客服记录
 * @param {Object} data - 记录数据
 * @param {string} data.customerId - 客户ID
 * @param {number} data.recordType - 记录类型：0-销售回访，1-客户回访
 * @param {string} data.mainContent - 主要内容
 * @returns {Promise} 请求Promise
 */
export function addCustomerServiceRecord(data) {
  return request({
    url: '/customer/service-record/add',
    method: 'post',
    data: data
  })
}

/**
 * 修改客服记录
 * @param {Object} data - 记录数据
 * @param {string} data.recordId - 记录UUID
 * @param {string} [data.customerId] - 客户ID
 * @param {number} [data.recordType] - 记录类型
 * @param {string} [data.mainContent] - 主要内容
 * @returns {Promise} 请求Promise
 */
export function updateCustomerServiceRecord(data) {
  return request({
    url: '/customer/service-record/edit',
    method: 'put',
    data: data
  })
}

/**
 * 删除客服记录
 * @param {string} recordId - 记录UUID
 * @returns {Promise} 请求Promise
 */
export function delCustomerServiceRecord(recordId) {
  return request({
    url: '/customer/service-record/delete',
    method: 'delete',
    data: { recordId }
  })
}

// ==================== 业务跟进考核接口 ====================

/**
 * 获取业务跟进考核销售人员列表
 * @returns {Promise} 请求Promise
 */
export function getBusinessFollowUpUsers() {
  return request({
    url: '/business/business-follow-up/users',
    method: 'get'
  })
}

/**
 * 分页查询业务跟进考核列表
 * @param {Object} query - 查询参数
 * @param {number} query.pageNum - 分页页码
 * @param {number} query.pageSize - 每页大小
 * @param {string} query.startDate - 查询开始日期，格式 yyyy-MM-dd
 * @param {string} query.endDate - 查询结束日期，格式 yyyy-MM-dd
 * @param {number} [query.userId] - 销售人员用户ID（可选）
 * @returns {Promise} 请求Promise
 */
export function listBusinessFollowUp(query) {
  return request({
    url: '/business/business-follow-up/list',
    method: 'get',
    params: query
  })
}

/**
 * 查询跟进记录详情
 * @param {Object} query - 查询参数
 * @param {number} query.pageNum - 分页页码
 * @param {number} query.pageSize - 每页大小
 * @param {string} query.startDate - 查询开始日期，格式 yyyy-MM-dd
 * @param {string} query.endDate - 查询结束日期，格式 yyyy-MM-dd
 * @param {number} query.userId - 销售人员用户ID
 * @returns {Promise} 请求Promise
 */
export function getBusinessFollowUpDetail(query) {
  return request({
    url: '/business/business-follow-up/detail',
    method: 'get',
    params: query
  })
}
