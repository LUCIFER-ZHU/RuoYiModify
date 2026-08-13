import request from '@/utils/request'

/**
 * 查询境外采购列表
 * @param {Object} query - 查询参数
 * @returns {Promise} - 请求Promise
 */
export function listDailyProcurementAbroad(query) {
  return request({
    url: '/business/dailyProcurementAbroad/list',
    method: 'get',
    params: query
  })
}

/**
 * 查询境外采购详细
 * @param {number} id - 境外采购ID
 * @returns {Promise} - 请求Promise
 */
export function getDailyProcurementAbroad(id) {
  return request({
    url: '/business/dailyProcurementAbroad/detail/' + id,
    method: 'get'
  })
}

/**
 * 新增境外采购
 * @param {Object} data - 境外采购数据
 * @returns {Promise} - 请求Promise
 */
export function addDailyProcurementAbroad(data) {
  return request({
    url: '/business/dailyProcurementAbroad',
    method: 'post',
    data: data
  })
}

/**
 * 修改境外采购
 * @param {Object} data - 境外采购数据
 * @returns {Promise} - 请求Promise
 */
export function updateDailyProcurementAbroad(data) {
  return request({
    url: '/business/dailyProcurementAbroad',
    method: 'put',
    data: data
  })
}

/**
 * 删除境外采购
 * @param {number} id - 境外采购ID
 * @returns {Promise} - 请求Promise
 */
export function delDailyProcurementAbroad(id) {
  return request({
    url: '/business/dailyProcurementAbroad/' + id,
    method: 'delete'
  })
}

/**
 * 提交审核
 * @param {number} id - 境外采购ID
 * @returns {Promise} - 请求Promise
 */
export function submitDailyProcurementAbroadReview(id) {
  return request({
    url: '/business/dailyProcurementAbroad/submit/' + id,
    method: 'get',
  })
}

/**
 * 审核境外采购
 * @param {Object} data - 审核数据
 * @returns {Promise} - 请求Promise
 */
export function reviewDailyProcurementAbroad(data) {
  return request({
    url: '/business/dailyProcurementAbroad/check',
    method: 'post',
    data: data
  })
}

/**
 * 查询境外采购审核列表
 * @param {Object} query - 查询参数
 * @returns {Promise} - 请求 Promise
 */
export function getDailyProcurementAbroadReviewList(query) {
  return request({
    url: '/business/dailyProcurementAbroad/reviewList',
    method: 'get',
    params: query
  })
}

/**
 * 获取境外采购审核历史列表
 * @param {Object} query - 查询参数
 * @param {string} query.dpaId - 境外采购 ID
 * @returns {Promise} - 请求 Promise
 */
export function getDailyProcurementAbroadCheckHistoryList(query) {
  return request({
    url: '/business/dailyProcurementAbroad/checkHistoryList',
    method: 'get',
    params: query
  })
}

/**
 * 生成境外采购HTML预览
 * @param {Object} query - 查询参数
 * @returns {Promise} - 请求Promise
 */
export function createDailyProcurementAbroadHtml(query) {
  return request({
    url: '/business/dailyProcurementAbroad/createHtml',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

/**
 * 查询未付款列表
 * @param {Object} query - 查询参数
 * @returns {Promise} - 请求Promise
 */
export function getUnPaymentAbroadList(query) {
  return request({
    url: '/business/dailyProcurementAbroad/unPaymentList',
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
export function addPaymentAbroad(data) {
  return request({
    url: '/business/dailyProcurementAbroad/addPayment',
    method: 'post',
    data: data
  })
}

/**
 * 下载境外采购
 * @param {Object} data - 下载参数
 * @param {number} data.id - ID
 * @returns {Promise} - 请求Promise
 */
export function downloadDailyProcurementAbroad(data) {
  return request({
    url: '/business/dailyProcurementAbroad/download',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}

/**
 * 查询付款明细列表
 * @param {Object} query - 查询参数
 * @param {string} query.dpaId - 境外采购ID
 * @returns {Promise} - 请求Promise
 */
export function getPaymentAbroadList(query) {
  return request({
    url: '/business/dailyProcurementAbroad/payList',
    method: 'get',
    params: query
  })
}

/**
 * 作废境外采购
 * @param {number} id - 境外采购ID
 * @returns {Promise} - 请求Promise
 */
export function voidedDailyProcurementAbroad(id) {
  return request({
    url: '/business/dailyProcurementAbroad/voided/' + id,
    method: 'get'
  })
}

/**
 * 获取付款公司列表
 * @returns {Promise} - 请求Promise
 */
export function getPaymentCompanyList() {
  return request({
    url: '/business/dailyProcurementAbroad/paymentCompanyList',
    method: 'get'
  })
}

/**
 * 获取境外采购收款公司列表
 * @returns {Promise} - 请求Promise
 */
export function getCollectionInfoList() {
  return request({
    url: '/business/dailyProcurementAbroad/collectionInfo',
    method: 'get'
  })
}
