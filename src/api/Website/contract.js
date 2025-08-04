import request from '@/utils/request'

// 查询合同列表
export function listContract(query) {
  return request({
    url: '/business/contract/list',
    method: 'get',
    params: query
  })
}

// 查询合同详细
export function getContract(id) {
  return request({
    url: '/business/contract/detail/' + id,
    method: 'get'
  })
}

// 新增合同
export function addContract(data) {
  return request({
    url: '/business/contract',
    method: 'post',
    data: data
  })
}

// 修改合同
export function updateContract(data) {
  return request({
    url: '/business/contract',
    method: 'put',
    data: data
  })
}

// 删除合同
export function delContract(id) {
  return request({
    url: '/business/contract/' + id,
    method: 'delete'
  })
} 

// 客户列表
export function getCustomerList(){
  return request({
    url: '/business/contract/customerList',
    method: 'get'
  })
}

// 保存为模板
export function saveAsTemplate(data) {
  return request({
    url: '/business/contract/saving',
    method: 'post',
    data: data
  })
}

// 获取模板列表
export function getTemplateList() {
  return request({
    url: '/business/contract/templateList',
    method: 'get'
  })
}

// 提交审核
export function submitContract(id){
  return request({
    url:'/business/contract/submit/'+id,
    method:'get'
  })
}

// 合同审核列表
export function getContractAuditList(query){
  return request({
    url: '/business/contract/reviewList',
    method: 'get',
    params: query
  })
}

// 审核合同
export function remarkContract(data){
  return request({
    url: '/business/contract/check',
    method: 'post',
    data: data
  })
}

// 收款合同
export function collectContract(data){
  return request({
    url: '/business/contract/collection',
    method: 'post',
    data: data
  })
}

// pdf生成
export function createContractPdf(contractId){
  return request({
    url: '/business/contract/createPdf',
    method: 'get',
    params:{
      contractId: contractId
    },
    responseType: 'arraybuffer'
  })
}

/**
 * 导出选中的合同
 * @param {Array} ids - 选中的合同ID数组
 * @returns {Promise} - 请求Promise
 */
export function exportContracts(ids) {
  return request({
    url: '/business/contract/export',
    method: 'get',
    params: {ids},
    responseType: 'blob'
  })
}

/**
 * 获取历史审核列表
 * @param {*} contractId
 * @return {*}
 */
export function getCheckHistoryList(contractId){
  return request({
    url: '/business/contract/checkHistoryList',
    method: 'get',
    params: {contractId}
  })
}

/**
 * 删除合同产品
 * @param {*} id 
 * @returns 
 */
export function delContractProduct(id) {
  return request({
    url: '/business/contract/product/' + id,
    method: 'delete',
  });
}