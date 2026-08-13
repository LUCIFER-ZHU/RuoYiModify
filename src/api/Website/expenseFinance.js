import request from '@/utils/request'

/**
 * 查询费用报销审核列表
 * @param {Object} query - 查询参数
 * @returns {Promise}
 */
export function listReviewList(query) {
  return request({
    url: '/business/expenseFinance/reviewList',
    method: 'get',
    params: query
  })
}

/**
 * 费用报销审核
 * @param {Object} data - 审核数据
 * @returns {Promise}
 */
export function checkExpenseFinance(data) {
  return request({
    url: '/business/expenseFinance/check',
    method: 'post',
    data: data
  })
}

/**
 * 查询费用报销发放列表
 * @param {Object} query - 查询参数
 * @returns {Promise}
 */
export function listPaymentList(query) {
  return request({
    url: '/business/expenseFinance/paymentList',
    method: 'get',
    params: query
  })
}

/**
 * 费用报销发放
 * @param {Object} data - 发放数据
 * @returns {Promise}
 */
export function payExpenseFinance(data) {
  return request({
    url: '/business/expenseFinance/pay',
    method: 'post',
    data: data
  })
}

/**
 * 查询费用报销返还确认列表
 * @param {Object} query - 查询参数
 * @returns {Promise}
 */
export function listReturnList(query) {
  return request({
    url: '/business/expenseFinance/returnList',
    method: 'get',
    params: query
  })
}

/**
 * 确认费用报销返还
 * @param {String|Number} id - 返还ID
 * @returns {Promise}
 */
export function confirmReturn(id) {
  return request({
    url: '/business/expenseFinance/confirm/' + id,
    method: 'post'
  })
}

/**
 * 打印报销单
 * @param {String|Number} merId - 报销单ID
 * @returns {Promise}
 */
export function printExpense(merId) {
  return request({
    url: '/business/expenseFinance/createHtml',
    method: 'get',
    params: { merId }
  })
}

/**
 * 作废
 * @param {number} id - 费用报销 ID
 * @returns {Promise}
 */
export function voidedExpense(id) {
  return request({
    url: '/business/expenseFinance/voided/' + id,
    method: 'post'
  })
}
