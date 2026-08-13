import request from '@/utils/request'

/**
 * 查询工艺路线列表
 * @param {Object} query - 查询参数
 * @returns {Promise} - 返回工艺路线列表数据
 */
export function listProcessRoute(query) {
  return request({
    url: '/business/processRoute/list',
    method: 'get',
    params: query
  })
}

/**
 * 新增工艺路线
 * @param {Object} data - 工艺路线数据
 * @returns {Promise} - 返回新增结果
 */
export function addProcessRoute(data) {
  return request({
    url: '/business/processRoute',
    method: 'post',
    data
  })
}

/**
 * 编辑工艺路线
 * @param {Object} data - 工艺路线数据
 * @returns {Promise} - 返回编辑结果
 */
export function updateProcessRoute(data) {
  return request({
    url: '/business/processRoute/edit',
    method: 'post',
    data
  })
}

/**
 * 删除工艺路线
 * @param {number} id - 工艺路线ID
 * @returns {Promise} - 返回删除结果
 */
export function delProcessRoute(id) {
  return request({
    url: '/business/processRoute/' + id,
    method: 'delete'
  })
}
