import request from '@/utils/request'

/**
 * 查询企业微信人员配置列表
 * @param {Object} query - 查询参数
 * @returns {Promise} - 请求Promise
 */
export function listQywxSettings(query) {
  return request({
    url: '/business/qywxSettings/list',
    method: 'get',
    params: query
  })
}

/**
 * 查询企业微信人员配置详细
 * @param {string|number} id - 配置ID
 * @returns {Promise} - 请求Promise
 */
export function getQywxSettings(id) {
  return request({
    url: '/business/qywxSettings/' + id,
    method: 'get'
  })
}

/**
 * 新增企业微信人员配置
 * @param {Object} data - 配置数据
 * @returns {Promise} - 请求Promise
 */
export function addQywxSettings(data) {
  return request({
    url: '/business/qywxSettings',
    method: 'post',
    data: data
  })
}

/**
 * 修改企业微信人员配置
 * @param {Object} data - 配置数据
 * @returns {Promise} - 请求Promise
 */
export function updateQywxSettings(data) {
  return request({
    url: '/business/qywxSettings',
    method: 'put',
    data: data
  })
}

/**
 * 删除企业微信人员配置
 * @param {string|number} id - 配置ID
 * @returns {Promise} - 请求Promise
 */
export function delQywxSettings(id) {
  return request({
    url: '/business/qywxSettings/' + id,
    method: 'delete'
  })
}
