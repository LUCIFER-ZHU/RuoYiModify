import request from '@/utils/request'

/**
 * 查询产品型号列表
 * @param {Object} query - 查询参数
 * @param {number} query.id - 主键ID
 * @param {string} query.model - 型号名称
 * @param {number} query.pageNum - 当前页码
 * @param {number} query.pageSize - 每页条数
 * @returns {Promise} - 请求Promise
 */
export function listMachineModel(query) {
  return request({
    url: '/business/machineModel/list',
    method: 'get',
    params: query
  })
}

/**
 * 查询产品型号详细
 * @param {number} id - 产品型号ID
 * @returns {Promise} - 请求Promise
 */
export function getMachineModel(id) {
  return request({
    url: '/business/machineModel/detail/' + id,
    method: 'get'
  })
}

/**
 * 新增产品型号
 * @param {Object} data - 产品型号数据
 * @param {string} data.model - 型号名称
 * @returns {Promise} - 请求Promise
 */
export function addMachineModel(data) {
  return request({
    url: '/business/machineModel',
    method: 'post',
    data: data
  })
}

/**
 * 修改产品型号
 * @param {Object} data - 产品型号数据
 * @param {number} data.id - 产品型号ID
 * @param {string} data.model - 型号名称
 * @returns {Promise} - 请求Promise
 */
export function updateMachineModel(data) {
  return request({
    url: '/business/machineModel',
    method: 'put',
    data: data
  })
}

/**
 * 删除产品型号
 * @param {number} id - 产品型号ID
 * @returns {Promise} - 请求Promise
 */
export function delMachineModel(id) {
  return request({
    url: '/business/machineModel/' + id,
    method: 'delete'
  })
}
