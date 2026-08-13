import request from '@/utils/request'

/**
 * 查询工时记录列表
 * @param {Object} query - 查询参数
 * @returns {Promise} - 返回工时记录列表数据
 */
export function listWorkingHours(query) {
  return request({
    url: '/business/workingHours/list',
    method: 'get',
    params: query
  })
}

/**
 * 获取工时记录详情
 * @param {number} id - 工时记录ID
 * @returns {Promise} - 返回工时记录详情数据
 */
export function getWorkingHoursDetail(id) {
  return request({
    url: '/business/workingHours/' + id,
    method: 'get'
  })
}

/**
 * 新增工时记录
 * @param {Object} data - 工时记录数据
 * @returns {Promise} - 返回新增结果
 */
export function addWorkingHours(data) {
  return request({
    url: '/business/workingHours',
    method: 'post',
    data
  })
}

/**
 * 编辑工时记录
 * @param {Object} data - 工时记录数据
 * @returns {Promise} - 返回编辑结果
 */
export function updateWorkingHours(data) {
  return request({
    url: '/business/workingHours',
    method: 'put',
    data
  })
}

/**
 * 删除工时记录
 * @param {number} id - 工时记录ID
 * @returns {Promise} - 返回删除结果
 */
export function delWorkingHours(id) {
  return request({
    url: '/business/workingHours/' + id,
    method: 'delete'
  })
}

/**
 * 获取正在执行的工单列表
 * @returns {Promise} - 返回工单列表数据
 */
export function getOrderList() {
  return request({
    url: '/business/workingHours/getOrderList',
    method: 'get'
  })
}

/**
 * 获取工序列表
 * @param {string} routeId - 工艺路线ID
 * @returns {Promise} - 返回工序列表数据
 */
export function getRouteList(routeId) {
  return request({
    url: '/business/workingHours/getRouteList',
    method: 'get',
    params: { routeId }
  })
}

/**
 * 获取工序关联操作员列表
 * @param {string} orderId - 工单ID
 * @param {number} routeDetailId - 工序明细ID
 * @returns {Promise} - 返回操作员列表数据
 */
export function getOperatorList(orderId, routeDetailId) {
  return request({
    url: '/business/workingHours/getOperatorList',
    method: 'get',
    params: { orderId, routeDetailId }
  })
}
