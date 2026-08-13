import request from '@/utils/request'

/**
 * 查询标准工序列表
 * @param {Object} query - 查询参数
 * @returns {Promise} - 返回工序列表数据
 */
export function listProductionProcess(query) {
  return request({
    url: '/business/productionProcess/list',
    method: 'get',
    params: query
  })
}

/**
 * 新增标准工序
 * @param {Object} data - 工序数据
 * @returns {Promise} - 返回新增结果
 */
export function addProductionProcess(data) {
  return request({
    url: '/business/productionProcess',
    method: 'post',
    data
  })
}

/**
 * 编辑标准工序
 * @param {Object} data - 工序数据
 * @returns {Promise} - 返回编辑结果
 */
export function updateProductionProcess(data) {
  return request({
    url: '/business/productionProcess/edit',
    method: 'post',
    data
  })
}

/**
 * 删除标准工序
 * @param {number} id - 工序ID
 * @returns {Promise} - 返回删除结果
 */
export function delProductionProcess(id) {
  return request({
    url: '/business/productionProcess/' + id,
    method: 'delete'
  })
}
