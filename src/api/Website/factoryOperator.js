import request from '@/utils/request'

/**
 * 查询操作员列表
 * @param {Object} query - 查询参数
 * @returns {Promise} - 返回操作员列表数据
 */
export function listFactoryOperator(query) {
  return request({
    url: '/business/factoryOperator/list',
    method: 'get',
    params: query
  })
}

/**
 * 新增操作员
 * @param {Object} data - 操作员数据
 * @returns {Promise} - 返回新增结果
 */
export function addFactoryOperator(data) {
  return request({
    url: '/business/factoryOperator',
    method: 'post',
    data
  })
}

/**
 * 编辑操作员
 * @param {Object} data - 操作员数据
 * @returns {Promise} - 返回编辑结果
 */
export function updateFactoryOperator(data) {
  return request({
    url: '/business/factoryOperator/edit',
    method: 'post',
    data
  })
}

/**
 * 删除操作员
 * @param {number} id - 操作员ID
 * @returns {Promise} - 返回删除结果
 */
export function delFactoryOperator(id) {
  return request({
    url: '/business/factoryOperator/' + id,
    method: 'delete'
  })
}
