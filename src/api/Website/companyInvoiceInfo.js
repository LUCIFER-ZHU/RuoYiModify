import request from '@/utils/request'

/**
 * 分页查询开票抬头信息列表
 * @param {Object} query - 查询参数
 * @param {number} [query.pageNum] - 当前页码
 * @param {number} [query.pageSize] - 每页条数
 * @param {string} [query.companyName] - 公司抬头（全称）
 * @param {string} [query.taxpayerCode] - 统一社会信用代码/纳税人识别号
 * @param {string} [query.address] - 注册地址
 * @param {string} [query.phone] - 注册电话
 * @param {string} [query.bankName] - 开户银行
 * @param {string} [query.bankAccount] - 银行账号
 * @param {number} [query.status] - 是否禁用（0-否、1-是）
 * @returns {Promise<Object>} 分页数据
 */
export function listCompanyInvoiceInfo(query) {
  return request({
    url: '/bussiness/companyInvoiceInfo/list',
    method: 'get',
    params: query
  })
}

/**
 * 查询所有启用的开票抬头信息
 * @returns {Promise<Object>} 启用的抬头信息列表
 */
export function listEnabledCompanyInvoiceInfo() {
  return request({
    url: '/bussiness/companyInvoiceInfo/enabled',
    method: 'get'
  })
}

/**
 * 根据ID查询开票抬头信息详情
 * @param {number} id - 记录ID
 * @returns {Promise<Object>} 抬头信息详情
 */
export function getCompanyInvoiceInfo(id) {
  return request({
    url: `/bussiness/companyInvoiceInfo/${id}`,
    method: 'get'
  })
}

/**
 * 新增开票抬头信息
 * @param {Object} data - 抬头信息数据
 * @param {string} data.companyName - 公司抬头（全称）
 * @param {string} data.taxpayerCode - 统一社会信用代码/纳税人识别号
 * @param {string} [data.address] - 注册地址
 * @param {string} [data.phone] - 注册电话
 * @param {string} [data.bankName] - 开户银行
 * @param {string} [data.bankAccount] - 银行账号
 * @param {number} [data.status] - 是否禁用（0-否、1-是）
 * @returns {Promise<Object>} 响应结果
 */
export function addCompanyInvoiceInfo(data) {
  return request({
    url: '/bussiness/companyInvoiceInfo',
    method: 'post',
    data: data
  })
}

/**
 * 更新开票抬头信息
 * @param {Object} data - 抬头信息数据
 * @param {number} data.id - 主键ID
 * @param {string} data.companyName - 公司抬头（全称）
 * @param {string} data.taxpayerCode - 统一社会信用代码/纳税人识别号
 * @param {string} [data.address] - 注册地址
 * @param {string} [data.phone] - 注册电话
 * @param {string} [data.bankName] - 开户银行
 * @param {string} [data.bankAccount] - 银行账号
 * @param {number} [data.status] - 是否禁用（0-否、1-是）
 * @returns {Promise<Object>} 响应结果
 */
export function updateCompanyInvoiceInfo(data) {
  return request({
    url: '/bussiness/companyInvoiceInfo',
    method: 'put',
    data: data
  })
}

/**
 * 删除开票抬头信息（逻辑删除）
 * @param {number} id - 记录ID
 * @returns {Promise<Object>} 响应结果
 */
export function delCompanyInvoiceInfo(id) {
  return request({
    url: `/bussiness/companyInvoiceInfo/${id}`,
    method: 'delete'
  })
}

/**
 * 更新状态
 * @param {number} id - 记录ID
 * @param {number} status - 状态（0-启用，1-禁用）
 * @returns {Promise<Object>} 响应结果
 */
export function updateCompanyInvoiceInfoStatus(id, status) {
  return request({
    url: '/bussiness/companyInvoiceInfo/status',
    method: 'put',
    params: { id, status }
  })
}
