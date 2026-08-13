import request from '@/utils/request'

/**
 * 查询日常采购列表
 * @param {Object} query - 查询参数
 * @returns {Promise} - 请求Promise
 */
export function listDailyProcurement(query) {
  return request({
    url: '/business/dailyProcurement/list',
    method: 'get',
    params: query
  })
}

/**
 * 查询日常采购详细
 * @param {number} id - 日常采购ID
 * @returns {Promise} - 请求Promise
 */
export function getDailyProcurement(id) {
  return request({
    url: '/business/dailyProcurement/detail/' + id,
    method: 'get'
  })
}

/**
 * 新增日常采购
 * @param {Object} data - 日常采购数据
 * @returns {Promise} - 请求Promise
 */
export function addDailyProcurement(data) {
  return request({
    url: '/business/dailyProcurement',
    method: 'post',
    data: data
  })
}

/**
 * 修改日常采购
 * @param {Object} data - 日常采购数据
 * @returns {Promise} - 请求Promise
 */
export function updateDailyProcurement(data) {
  return request({
    url: '/business/dailyProcurement',
    method: 'put',
    data: data
  })
}

/**
 * 删除日常采购
 * @param {number} id - 日常采购ID
 * @returns {Promise} - 请求Promise
 */
export function delDailyProcurement(id) {
  return request({
    url: '/business/dailyProcurement/' + id,
    method: 'delete'
  })
}

/**
 * 提交审核
 * @param {Object} query - 审核数据
 * @returns {Promise} - 请求Promise
 */
export function submitDailyProcurementReview(id) {
  return request({
    url: '/business/dailyProcurement/submit/' + id,
    method: 'get',
  })
}

/**
 * 审核日常采购
 * @param {Object} data - 审核数据
 * @returns {Promise} - 请求Promise
 */
export function reviewDailyProcurement(data) {
  return request({
    url: '/business/dailyProcurement/check',
    method: 'post',
    data: data
  })
}

/**
 * 查询日常采购审核列表
 * @param {Object} query - 查询参数
 * @returns {Promise} - 请求 Promise
 */
export function getDailyProcurementReviewList(query) {
  return request({
    url: '/business/dailyProcurement/reviewList',
    method: 'get',
    params: query
  })
}

/**
 * 获取日常采购审核历史列表
 * @param {Object} query - 查询参数
 * @param {number} query.dpId - 日常采购 ID
 * @returns {Promise} - 请求 Promise
 */
export function getDailyProcurementCheckHistoryList(query) {
  return request({
    url: '/business/dailyProcurement/checkHistoryList',
    method: 'get',
    params: query
  })
}

/**
 * 生成日常单HTML预览
 * @param {Object} query - 查询参数
 * @returns {Promise} - 请求Promise
 */
export function createDailyProcurementHtml(query) {
  return request({
    url: '/business/dailyProcurement/createHtml',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

/**
 * 获取收款单位列表
 * @returns {Promise} - 请求Promise
 */
export function getCollectionCompanyList() {
  return request({
    url: '/business/dailyProcurement/getCollectionCompanyList',
    method: 'get'
  })
}

/**
 * 补充确认
 * @param {Object} query - 查询参数
 * @param {number} query.dpId - 日常采购ID
 * @returns {Promise} - 请求Promise
 */
export function circulationDailyProcurement(query) {
  return request({
    url: '/business/dailyProcurement/circulation',
    method: 'get',
    params: query
  })
}

/**
 * 补充信息
 * @param {Object} data - 补充信息数据
 * @param {string} data.dpId - 日常采购ID
 * @param {number} data.id - ID，主键
 * @param {string} data.totalPath - 最终凭证信息
 * @returns {Promise} - 请求Promise
 */
export function replenishDailyProcurement(data) {
  return request({
    url: '/business/dailyProcurement/replenish',
    method: 'post',
    data: data
  })
}

/**
 * 查询未付款列表
 * @param {Object} query - 查询参数
 * @returns {Promise} - 请求Promise
 */
export function getUnPaymentList(query) {
  return request({
    url: '/business/dailyProcurement/unPaymentList',
    method: 'get',
    params: query
  })
}

/**
 * 添加付款
 * @param {Object} data - 付款数据
 * @param {string} data.paymentTime - 出纳时间
 * @param {string} data.paymentUrl - 出纳凭证
 * @returns {Promise} - 请求Promise
 */
export function addPayment(data) {
  return request({
    url: '/business/dailyProcurement/addPayment',
    method: 'post',
    data: data
  })
}

/**
 * 下载日常单
 * @param {Object} data - 下载参数
 * @param {number} data.id - ID
 * @returns {Promise} - 请求Promise
 */
export function downloadDailyProcurement(data) {
  return request({
    url: '/business/dailyProcurement/download',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}

/**
 * 查询付款明细列表
 * @param {Object} query - 查询参数
 * @param {string} query.dpId - 日常采购ID
 * @returns {Promise} - 请求Promise
 */
export function getPaymentList(query) {
  return request({
    url: '/business/dailyProcurement/payList',
    method: 'get',
    params: query
  })
}

/**
 * 作废日常采购
 * @param {number} id - 日常采购ID
 * @returns {Promise} - 请求Promise
 */
export function voidedDailyProcurement(id) {
  return request({
    url: '/business/dailyProcurement/voided/' + id,
    method: 'get'
  })
}
