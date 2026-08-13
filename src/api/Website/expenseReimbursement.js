import request from '@/utils/request'

/**
 * 查询费用报销列表
 * @param {Object} query - 查询参数
 * @param {number} query.pageNum - 当前页码
 * @param {number} query.pageSize - 每页条数
 * @returns {Promise} - 返回包含列表数据和总数的Promise对象
 */
export function listExpenseReimbursement(query) {
  return request({
    url: '/business/expenseReimbursement/list',
    method: 'get',
    params: query
  })
}

/**
 * 查询费用报销详细
 * @param {number} id - 费用报销ID
 * @returns {Promise} - 返回费用报销详细数据的Promise对象
 */
export function getExpenseReimbursement(id) {
  return request({
    url: '/business/expenseReimbursement/detail/' + id,
    method: 'get'
  })
}

/**
 * 新增费用报销
 * @param {Object} data - 费用报销数据对象
 * @returns {Promise} - 返回新增结果的Promise对象
 */
export function addExpenseReimbursement(data) {
  return request({
    url: '/business/expenseReimbursement',
    method: 'post',
    data: data
  })
}

/**
 * 修改费用报销
 * @param {Object} data - 费用报销数据对象
 * @returns {Promise} - 返回修改结果的Promise对象
 */
export function updateExpenseReimbursement(data) {
  return request({
    url: '/business/expenseReimbursement',
    method: 'put',
    data: data
  })
}

/**
 * 删除费用报销
 * @param {number} id - 费用报销ID
 * @returns {Promise} - 返回删除结果的Promise对象
 */
export function delExpenseReimbursement(id) {
  return request({
    url: '/business/expenseReimbursement/' + id,
    method: 'delete'
  })
}

/**
 * 查询费用报销返还列表
 * @param {Object} query - 查询参数
 * @returns {Promise}
 */
export function listReturnList(query) {
  return request({
    url: '/business/expenseReimbursement/returnList',
    method: 'get',
    params: query
  })
}

/**
 * 提交费用报销返还
 * @param {Object} data - 返还数据
 * @returns {Promise}
 */
export function submitReturn(data) {
  return request({
    url: '/business/expenseReimbursement/submitReturn',
    method: 'post',
    data: data
  })
}

/**
 * 提交审核
 * @param {number} id - 费用报销ID
 * @returns {Promise}
 */
export function submitAudit(id) {
  return request({
    url: '/business/expenseFinance/submit/' + id,
    method: 'get'
  })
}

/**
 * 下载发票图片压缩包
 * @param {Array} ids - 发票ID数组
 * @returns {Promise}
 */
export function downloadInvoiceImages(ids) {
  return request({
    url: '/business/expenseReimbursement/imagesZip',
    method: 'post',
    data: ids,
    responseType: 'blob'
  })
}

/**
 * 下载收据图片压缩包
 * @param {Array} ids - 明细ID数组
 * @returns {Promise}
 */
export function downloadReceiptImages(ids) {
  return request({
    url: '/business/expenseReimbursement/receiptZip',
    method: 'post',
    data: ids,
    responseType: 'blob'
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

/**
 * 获取费用报销审核历史列表
 * @param {Object} query - 查询参数
 * @param {string} query.merId - 报销单号
 * @returns {Promise} - 返回审核历史列表的 Promise 对象
 */
export function getExpenseReimbursementCheckHistoryList(query) {
  return request({
    url: '/business/expenseReimbursement/checkHistoryList',
    method: 'get',
    params: query
  })
}


/**
 * 财务编辑费用报销
 * @param {Object} data - 费用报销数据对象
 * @returns {Promise} - 返回修改结果的Promise对象
 */
export function financialEditor(data) {
  return request({
    url: '/business/expenseFinance/financialEditor',
    method: 'post',
    data: data
  })
}

/**
 * 查询发放明细列表
 * @param {Object} query - 查询参数
 * @param {string} query.merId - 报销单ID
 * @returns {Promise} - 返回发放明细列表的Promise对象
 */
export function getPayList(query) {
  return request({
    url: '/business/expenseFinance/payList',
    method: 'get',
    params: query
  })
}

/**
 * 查询返还明细列表
 * @param {Object} query - 查询参数
 * @param {string} query.merId - 报销单ID
 * @returns {Promise} - 返回返还明细列表的Promise对象
 */
export function getReturnList(query) {
  return request({
    url: '/business/expenseFinance/returnInfo',
    method: 'get',
    params: query
  })
}

/**
 * OCR识别发票（支持公司抬头信息）
 * @param {FormData} data - 包含file、companyHeader、taxpayerCode字段的FormData对象
 * @returns {Promise} - 返回识别结果的Promise对象
 */
export function uploadWithOcrNew(data) {
  return request({
    url: '/ossUpload/uploadWithOcrNew',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 查询所有启用的公司开票抬头信息
 * @returns {Promise} - 返回启用的公司开票抬头信息列表
 */
export function getEnabledCompanyInvoiceInfo() {
  return request({
    url: '/bussiness/companyInvoiceInfo/enabled',
    method: 'get'
  })
}