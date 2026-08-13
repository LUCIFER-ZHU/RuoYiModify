import request from "@/utils/request";

/**
 * 采购付款申请列表
 * @param {*} query 
 * @returns 
 */
export function getPurchasePaymentList(query) {
    return request({
        url: `/business/purchaseFinance/payment/paymentList`,
        method: "get",
        params: query,
    });
}

/**
 * 采购付款申请付款或者拒绝
 * @param {*} data 
 * @returns 
 */
export function purchasePayOrRefuse(data) {
    return request({
        url: `/business/purchaseFinance/payment/payOrRefuse`,
        method: "post",
        data,
    });
}

/**
 * 下载付款申请单
 * @param {Object} data - 请求参数
 * @param {string} data.id - 付款申请单ID
 * @returns {Promise} 返回请求Promise对象
 */
export function downloadPurchasePayment(data) {
    return request({
        url: `/business/purchasePayment/download`,
        method: "put",
        data,
    });
}

