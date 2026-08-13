import request from '@/utils/request'

/**
 * 查询产品型号属性模板列表
 * @returns {Promise} - 请求Promise
 */
export function listModelTemplateAttribute() {
  return request({
    url: '/business/modelTemplateAttribute/list',
    method: 'get'
  })
}

/**
 * 查询产品型号属性模板详细
 * @param {number} id - 属性模板ID
 * @returns {Promise} - 请求Promise
 */
export function getModelTemplateAttribute(id) {
  return request({
    url: '/business/modelTemplateAttribute/detail/' + id,
    method: 'get'
  })
}

/**
 * 新增产品型号属性模板
 * @param {Object} data - 属性模板数据
 * @param {string} data.templateName - 模板名称
 * @param {string} data.attributeIds - 属性字典ID（逗号分隔）
 * @returns {Promise} - 请求Promise
 */
export function addModelTemplateAttribute(data) {
  return request({
    url: '/business/modelTemplateAttribute',
    method: 'post',
    data: data
  })
}

/**
 * 删除产品型号属性模板
 * @param {number} id - 属性模板ID
 * @returns {Promise} - 请求Promise
 */
export function delModelTemplateAttribute(id) {
  return request({
    url: '/business/modelTemplateAttribute/' + id,
    method: 'delete'
  })
}
