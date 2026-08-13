import request from '@/utils/request'

/**
 * 查询日常采购合同列表
 * @param {Object} query - 查询参数
 * @returns {Promise} - 请求Promise
 */
export function listDailyProcurementContract(query) {
  return request({
    url: '/business/dailyProcurementContract/list',
    method: 'get',
    params: query
  })
}

/**
 * 查询日常采购合同详细
 * @param {number} id - 日常采购合同ID
 * @returns {Promise} - 请求Promise
 */
export function getDailyProcurementContract(id) {
  return request({
    url: '/business/dailyProcurementContract/detail/' + id,
    method: 'get'
  })
}

/**
 * 根据dpcId查询日常采购合同详细
 * @param {string} dpcId - 日常采购合同ID
 * @returns {Promise} - 请求Promise
 */
export function getDailyProcurementContractByDpcId(dpcId) {
  return request({
    url: '/business/dailyProcurementContract/getDetailByDpcId',
    method: 'get',
    params: { dpcId }
  })
}

/**
 * 新增日常采购合同
 * @param {Object} data - 日常采购合同数据
 * @returns {Promise} - 请求Promise
 */
export function addDailyProcurementContract(data) {
  return request({
    url: '/business/dailyProcurementContract',
    method: 'post',
    data: data
  })
}

/**
 * 修改日常采购合同
 * @param {Object} data - 日常采购合同数据
 * @returns {Promise} - 请求Promise
 */
export function updateDailyProcurementContract(data) {
  return request({
    url: '/business/dailyProcurementContract',
    method: 'put',
    data: data
  })
}

/**
 * 删除日常采购合同
 * @param {number} id - 日常采购合同ID
 * @returns {Promise} - 请求Promise
 */
export function delDailyProcurementContract(id) {
  return request({
    url: '/business/dailyProcurementContract/' + id,
    method: 'delete'
  })
}

/**
 * 提交审核
 * @param {number} id - 日常采购合同ID
 * @returns {Promise} - 请求Promise
 */
export function submitDailyProcurementContractReview(id) {
  return request({
    url: '/business/dailyProcurementContract/submit/' + id,
    method: 'get',
  })
}

/**
 * 查询日常采购合同审核列表
 * @param {Object} query - 查询参数
 * @returns {Promise} - 请求 Promise
 */
export function getDailyProcurementContractReviewList(query) {
  return request({
    url: '/business/dailyProcurementContract/reviewList',
    method: 'get',
    params: query
  })
}

/**
 * 获取日常采购合同审核历史列表
 * @param {Object} query - 查询参数
 * @param {number} query.dpcId - 日常采购合同 ID
 * @returns {Promise} - 请求 Promise
 */
export function getDailyProcurementContractCheckHistoryList(query) {
  return request({
    url: '/business/dailyProcurementContract/checkHistoryList',
    method: 'get',
    params: query
  })
}

/**
 * 审核日常采购合同
 * @param {Object} data - 审核数据
 * @returns {Promise} - 请求Promise
 */
export function reviewDailyProcurementContract(data) {
  return request({
    url: '/business/dailyProcurementContract/check',
    method: 'post',
    data: data
  })
}

/**
 * 用印申请
 * @param {number} id - 日常采购合同ID
 * @returns {Promise} - 请求Promise
 */
export function useStampDailyProcurementContract(id) {
  return request({
    url: '/business/dailyProcurementContract/useStamp/' + id,
    method: 'get',
  })
}

/**
 * 查询日常采购合同用印申请列表
 * @param {Object} query - 查询参数
 * @returns {Promise} - 请求 Promise
 */
export function getDailyProcurementContractRecordList(query) {
  return request({
    url: '/business/dailyProcurementContract/recordList',
    method: 'get',
    params: query
  })
}

/**
 * 获取付款公司列表
 * @returns {Promise} - 请求 Promise
 */
export function getPaymentCompanyList() {
  return request({
    url: '/business/dailyProcurementContract/paymentCompanyList',
    method: 'get'
  })
}

/**
 * 用印审核
 * @param {Object} data - 审核数据
 * @returns {Promise} - 请求Promise
 */
export function passStampDailyProcurementContract(data) {
  return request({
    url: '/business/dailyProcurementContract/passStamp',
    method: 'post',
    data: data
  })
}

/**
 * 获取完结合同列表
 * @returns {Promise} - 请求Promise
 */
export function getFinishedContractList() {
  return request({
    url: '/business/dailyProcurementContract/finishedList',
    method: 'get'
  })
}
