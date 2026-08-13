import request from '@/utils/request'

/**
 * 查询产品型号关联属性字典列表
 * @returns {Promise} - 请求Promise
 */
export function listModelAttributeDict() {
  return request({
    url: '/business/modelAttributeDict/list',
    method: 'get'
  })
}

/**
 * 查询产品型号关联属性字典详细
 * @param {number} id - 属性字典ID
 * @returns {Promise} - 请求Promise
 */
export function getAttributeDict(id) {
  return request({
    url: '/business/modelAttributeDict/detail/' + id,
    method: 'get'
  })
}

/**
 * 新增产品型号关联属性字典
 * @param {Object} data - 属性字典数据
 * @param {string} data.attributeKey - 属性键名
 * @param {string} data.attributeName - 属性显示名称
 * @param {string} data.unit - 单位
 * @returns {Promise} - 请求Promise
 */
export function addAttributeDict(data) {
  return request({
    url: '/business/modelAttributeDict',
    method: 'post',
    data: data
  })
}

/**
 * 修改产品型号关联属性字典
 * @param {Object} data - 属性字典数据
 * @param {number} data.id - 属性字典ID
 * @param {string} data.attributeKey - 属性键名
 * @param {string} data.attributeName - 属性显示名称
 * @param {string} data.unit - 单位
 * @returns {Promise} - 请求Promise
 */
export function updateAttributeDict(data) {
  return request({
    url: '/business/modelAttributeDict',
    method: 'put',
    data: data
  })
}

/**
 * 删除产品型号关联属性字典
 * @param {number} id - 属性字典ID
 * @returns {Promise} - 请求Promise
 */
export function delAttributeDict(id) {
  return request({
    url: '/business/modelAttributeDict/' + id,
    method: 'delete'
  })
}
