import request from '@/utils/request'

/**
 * 查询生产工单列表
 * @param {Object} query - 查询参数
 * @returns {Promise} - 返回工单列表数据
 */
export function listProductionOrder(query) {
  return request({
    url: '/business/productionOrder/list',
    method: 'get',
    params: query
  })
}

/**
 * 新增生产工单
 * @param {Object} data - 工单数据
 * @returns {Promise} - 返回新增结果
 */
export function addProductionOrder(data) {
  return request({
    url: '/business/productionOrder',
    method: 'post',
    data
  })
}

/**
 * 编辑生产工单
 * @param {Object} data - 工单数据
 * @returns {Promise} - 返回编辑结果
 */
export function updateProductionOrder(data) {
  return request({
    url: '/business/productionOrder/edit',
    method: 'post',
    data
  })
}

/**
 * 删除生产工单
 * @param {number} id - 工单ID
 * @returns {Promise} - 返回删除结果
 */
export function delProductionOrder(id) {
  return request({
    url: '/business/productionOrder/' + id,
    method: 'delete'
  })
}

/**
 * 获取生产工单详情
 * @param {number} id - 工单ID
 * @returns {Promise} - 返回工单详情数据
 */
export function getProductionOrderDetail(id) {
  return request({
    url: '/business/productionOrder/' + id,
    method: 'get'
  })
}

/**
 * 获取已分配的操作员列表
 * @returns {Promise} - 返回操作员列表数据
 */
export function selectAllocatedList() {
  return request({
    url: '/business/productionOrder/selectAllocatedList',
    method: 'get'
  })
}
