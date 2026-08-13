import request from '@/utils/request'
import { mockCustomerApi, USE_MOCK } from './mock/customer-mock'

// 查询客户列表
export function listCustomer(query) {
  if (USE_MOCK) {
    return mockCustomerApi.getList(query)
  }
  return request({
    url: '/business/customer/list',
    method: 'get',
    params: query
  })
}

// 查询客户详细
export function getCustomer(id) {
  if (USE_MOCK) {
    return mockCustomerApi.getCustomer(id)
  }
  return request({
    url: '/business/customer/detail/' + id,
    method: 'get'
  })
}

// 新增客户
export function addCustomer(data) {
  if (USE_MOCK) {
    return mockCustomerApi.addCustomer(data)
  }
  return request({
    url: '/business/customer',
    method: 'post',
    data: data
  })
}

// 修改客户
export function updateCustomer(data) {
  if (USE_MOCK) {
    return mockCustomerApi.updateCustomer(data)
  }
  return request({
    url: '/business/customer',
    method: 'put',
    data: data
  })
}

// 删除客户
export function delCustomer(id) {
  if (USE_MOCK) {
    return mockCustomerApi.delCustomer(id)
  }
  return request({
    url: '/business/customer/' + id,
    method: 'delete'
  })
}

// 移入私海
export function moveToPrivate(query) {
  return request({
    url: '/business/customer/salvage',
    method: 'get',
    params: query
  })
}

// 移入公海
export function moveToPublic(query) {
  return request({
    url: '/business/customer/toTheSea',
    method: 'get',
    params: query
  })
}

// 分配
export function handleAllocation(data) {
  return request({
    url: '/business/synthetical/allocation',
    method: 'post',
    data: data
  })
}

// 获取分配人列表
export function getAssignerList() {
  return request({
    url: '/business/customer/getAssignerList',
    method: 'get'
  })
}

// 获取分配记录列表
export function getAssignList(query) {
  return request({
    url: '/business/customer/assignList',
    method: 'get',
    params: query
  })
}

// 获取分配人列表（下拉选择）
export function getReceiverList() {
  return request({
    url: '/business/customer/receiverList',
    method: 'get'
  })
}

// 获取未联系客户
export function getNoContacted(query) {
  return request({
    url: '/business/customer/getNoContacted',
    method: 'get',
    params: query
  })
}

// 获取客户分配记录
export function getAssignRecordList(query) {
  return request({
    url: '/business/customer/assignRecordList',
    method: 'get',
    params: query
  })
}

// 一键刷新客户数据
export function refreshCustomerData() {
  return request({
    url: '/business/customer/clickToRefresh',
    method: 'get',
  })
}

/**
 * 导出客户数据
 * @param {string|number} userId - 用户ID
 * @returns {Promise} API响应Promise对象，返回Excel文件blob
 */
export function exportCustomer(userId) {
  return request({
    url: '/business/customer/export',
    method: 'get',
    params: { userId },
    responseType: 'blob'
  })
}

/**
 * 获取客户修改记录
 * @param {Object} query - 查询参数，包含customerId
 * @returns {Promise} API响应Promise对象
 */
export function getCustomerUpdateRecords(query) {
  return request({
    url: '/business/customer/updateRecords',
    method: 'get',
    params: query
  })
}

/**
 * 客户查重接口
 * @param {Object} data - 表单数据对象
 * @returns {Promise} API响应Promise对象，包含查重结果信息
 */
export function plagiarismCheck(data) {
  return request({
    url: '/business/customer/plagiarismCheck',
    method: 'post',
    data: data
  })
}

/**
 * 获取分配部门列表
 * @returns {Promise} API响应Promise对象，包含部门列表数据
 */
export function getAssignSysDeptList() {
  return request({
    url: '/business/customer/getAssignSysDeptList',
    method: 'get',
  })
}

// 项目经理标记客户状态
export function updatePmFollowsUp(data) {
  return request({
    url: '/business/customer/updatePmFollowsUp',
    method: 'post',
    data: data
  })
}



// ---客户追踪start--------------------------------------
// 保存
export function saveCustomerTrack(data) {
  return request({
    url: '/business/customerTrack/saving',
    method: 'post',
    data: data
  })
}

// 获取客户追踪列表
export function getCustomerTrackList(query){
  return request({
    url: '/business/customerTrack/list',
    method: 'get',
    params: query
  })
}

/**
 * 获取客户追踪对象信息
 * @param {Object} query - 查询参数，包含customerId
 * @returns {Promise} API响应Promise对象
 */
export function getCustomerTrackInfo(query) {
  return request({
    url: '/business/customerTrack/customerTrackInfo',
    method: 'get',
    params: query
  })
}

/**
 * 获取客户追踪列表数据
 * @param {Object} query - 查询参数，包含customerId
 * @returns {Promise} API响应Promise对象
 */
export function getCustomerTrackListData(query) {
  return request({
    url: '/business/customerTrack/customerTrackList',
    method: 'get',
    params: query
  })
}

/**
 * 获取供应商报价对象信息
 * @param {Object} query - 查询参数，包含customerId
 * @returns {Promise} API响应Promise对象
 */
export function getSupplierTrackInfo(query) {
  return request({
    url: '/business/customerTrack/supplierTrackInfo',
    method: 'get',
    params: query
  })
}

/**
 * 获取供应商报价列表数据
 * @param {Object} query - 查询参数，包含customerId
 * @returns {Promise} API响应Promise对象
 */
export function getSupplierTrackListData(query) {
  return request({
    url: '/business/customerTrack/supplierTrackList',
    method: 'get',
    params: query
  })
}

// 获取客户追踪其中一条详情
export function getCustomerTrackDetail(id){
  return request({
    url: '/business/customerTrack/detail/' + id,
    method: 'get'
  })
}

// 新增客户追踪
export function addCustomerTrack(data) {
  return request({
    url: '/business/customerTrack',
    method: 'post',
    data: data
  })
}

// 编辑客户追踪
export function editCustomerTrack(data) {
  return request({
    url: '/business/customerTrack',
    method: 'post',
    data: data
  })
}
// ---客户追踪end--------------------------------------