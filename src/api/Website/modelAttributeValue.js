import request from '@/utils/request'

/**
 * 查询产品型号、属性、价格列表
 * @param {Object} query - 查询参数
 * @param {number} query.id - 主键ID
 * @param {number} query.modelId - 型号ID
 * @param {string} query.attributeValue - 属性值
 * @param {number} query.version - 版本号
 * @param {string} query.createTime - 创建时间
 * @param {string} query.updateTime - 更新时间
 * @param {number} query.pageNum - 当前页码
 * @param {number} query.pageSize - 每页条数
 * @returns {Promise} - 请求Promise
 */
export function listModelAttributeValue(query) {
  return request({
    url: '/business/modelAttributeValue/list',
    method: 'get',
    params: query
  })
}

/**
 * 查询产品型号、属性、价格详细
 * @param {number} id - 属性价格ID
 * @returns {Promise} - 请求Promise
 */
export function getModelAttributeValue(id) {
  return request({
    url: '/business/modelAttributeValue/detail/' + id,
    method: 'get'
  })
}

/**
 * 新增产品型号、属性、价格
 * @param {Object} data - 属性价格数据
 * @param {number} data.modelId - 型号ID
 * @param {string} data.attributeValue - 属性值（JSON字符串）
 * @returns {Promise} - 请求Promise
 */
export function addModelAttributeValue(data) {
  return request({
    url: '/business/modelAttributeValue',
    method: 'post',
    data: data
  })
}

/**
 * 修改产品型号、属性、价格
 * @param {Object} data - 属性价格数据
 * @param {number} data.id - 属性价格ID
 * @param {number} data.modelId - 型号ID
 * @param {string} data.attributeValue - 属性值（JSON字符串）
 * @returns {Promise} - 请求Promise
 */
export function updateModelAttributeValue(data) {
  return request({
    url: '/business/modelAttributeValue',
    method: 'put',
    data: data
  })
}

/**
 * 删除产品型号、属性、价格
 * @param {number} id - 属性价格ID
 * @returns {Promise} - 请求Promise
 */
export function delModelAttributeValue(id) {
  return request({
    url: '/business/modelAttributeValue/' + id,
    method: 'delete'
  })
}

/**
 * 导入产品型号数据
 * @returns {Promise} - 请求Promise
 */
export function importMachineModel(data) {
  return request({
    url: '/business/machineModel/import',
    method: 'post',
    data: data
  })
}
