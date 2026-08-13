import request from '@/utils/request'

/**
 * 查询采购单列表
 * @param {Object} query - 查询参数
 * @returns {Promise} - 请求Promise
 */
export function listPurchase(query) {
  return request({
    url: '/business/purchaseFinance/purchase/list',
    method: 'get',
    params: query
  })
}

/**
 * 查询采购单详细
 * @param {number} id - 采购单ID
 * @returns {Promise} - 请求Promise
 */
export function getPurchase(id) {
  return request({
    url: '/business/purchase/detail/' + id,
    method: 'get'
  })
}

/**
 * 新增采购单
 * @param {Object} data - 采购单数据
 * @returns {Promise} - 请求Promise
 */
export function addPurchase(data) {
  return request({
    url: '/business/purchase',
    method: 'post',
    data: data
  })
}

/**
 * 修改采购单
 * @param {Object} data - 采购单数据
 * @returns {Promise} - 请求Promise
 */
export function updatePurchase(data) {
  return request({
    url: '/business/purchase',
    method: 'put',
    data: data
  })
}

/**
 * 删除采购单
 * @param {number} id - 采购单ID
 * @returns {Promise} - 请求Promise
 */
export function delPurchase(id) {
  return request({
    url: '/business/purchase/' + id,
    method: 'delete'
  })
} 

/**
 * 获取合同列表
 * @param {number} id - 用户ID
 * @returns {Promise} - 请求Promise
 */
export function getContractList(id) {
  return request({
    url: '/business/purchase/contractList',
    method: 'get',
    params: {userId: id}
  })
}

/**
 * 删除采购单商品
 * @param {number} id - 商品ID
 * @returns {Promise} - 请求Promise
 */
export function delPurchaseProduct(id) {
  return request({
    url: '/business/purchase/product/' + id,
    method: 'delete'
  })
}

/**
 * 申请付款
 * @param {Object} data - 付款数据
 * @returns {Promise} - 请求Promise
 */
export function requestPayment(data) {
  return request({
    url: '/business/purchaseFinance/purchase/requestPayment',
    method: 'post',
    data: data
  })
}

/**
 * 审核采购单
 * @param {Object} data - 审核数据
 * @returns {Promise} - 请求Promise
 */
export function remarkPurchase(data) {
  return request({
    url: '/business/purchaseFinance/purchase/check',
    method: 'post',
    data: data
  })
}


/**
 * 获取采购单审核列表
 * @param {Object} query - 查询参数
 * @returns {Promise} - 请求Promise
 */
export function getPurchaseAuditList(query) {
  return request({
    url: '/business/purchaseFinance/purchase/reviewList',
    method: 'get',
    params: query
  })
}

/**
 * 申请付款明细
 * @param {Object} data - 付款数据
 * @returns {Promise} - 请求Promise
 */
export function getPurchasePaymentDetail(query) {
  return request({
    url: '/business/purchaseFinance/payment/paymentDetail',
    method: 'get',
    params: query
  })
}

/**
 * 付款详情
 * @param {*} id 
 * @returns 
 */
export function getPurchasePaymentDetails(purchaseId) {
  return request({
      url: `/business/purchasePayment/paymentDetails`,
      method: "get",
      params: { purchaseId },
  });
}

/**
* 采购付款申请审核记录
* @param {*} query 
* @returns 
*/
export function getPurchasePaymentHistoryList(query) {
  return request({
      url: `/business/purchaseFinance/purchase/historyList`,
      method: "get",
      params: query,
  });
}

/**
* 采购单导出
* @param {Array} ids - 采购单ID数组
* @returns {Promise} - 请求Promise
*/
export function exportPurchases(ids) {
  return request({
      url: `/business/purchaseFinance/purchase/export`,
      method: "get",
      params: { ids },
      responseType: 'blob'
  });
}

/**
* 采购付款申请PDF生成
* @param {*} query 
* @returns 
*/
export function createPurchasePaymentPdf(query) {
  return request({
      url: `/business/purchaseFinance/purchase/createPdf`,
      method: "get",
      params: query,
      responseType: 'blob'      
  });
}

/**
* 采购付款申请HTML生成
* @param {*} query 
* @returns 
*/
export function createPurchasePaymentHtml(query) {
  return request({
      url: `/business/purchaseFinance/purchase/createHtml`,
      method: "get",
      params: query,
      responseType: 'blob'      
  });
}




