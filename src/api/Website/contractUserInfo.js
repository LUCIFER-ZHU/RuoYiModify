import request from '@/utils/request'

/**
 * 查询合同用户信息列表
 * @param {Object} query - 查询参数对象
 * @param {number} query.pageNum - 当前页码
 * @param {number} query.pageSize - 每页条数
 * @param {number} query.userId - 用户ID（可选）
 * @returns {Promise} 返回包含列表数据和总数的Promise对象
 */
export function listContractUserInfo(query) {
  return request({
    url: '/business/contractUserinfo/list',
    method: 'get',
    params: query
  })
}

/**
 * 查询合同用户信息详细
 * @param {number} id - 合同用户信息ID
 * @returns {Promise} 返回合同用户信息详细数据的Promise对象
 */
export function getContractUserInfo(id) {
  return request({
    url: '/business/contractUserinfo/' + id,
    method: 'get'
  })
}

/**
 * 新增合同用户信息
 * @param {Object} data - 合同用户信息数据对象
 * @param {string} data.email - 邮箱（可选）
 * @param {string} data.tel - 电话（可选）
 * @param {number} data.userId - 用户ID（可选）
 * @param {string} data.wechat - 微信（可选）
 * @param {string} data.whatsapp - WhatsApp（可选）
 * @returns {Promise} 返回新增结果的Promise对象
 */
export function addContractUserInfo(data) {
  return request({
    url: '/business/contractUserinfo',
    method: 'post',
    data: data
  })
}

/**
 * 修改合同用户信息
 * @param {Object} data - 合同用户信息数据对象
 * @param {number} data.id - 合同用户信息ID（必填）
 * @param {string} data.email - 邮箱（可选）
 * @param {string} data.tel - 电话（可选）
 * @param {number} data.userId - 用户ID（可选）
 * @param {string} data.wechat - 微信（可选）
 * @param {string} data.whatsapp - WhatsApp（可选）
 * @returns {Promise} 返回修改结果的Promise对象
 */
export function updateContractUserInfo(data) {
  return request({
    url: '/business/contractUserinfo',
    method: 'put',
    data: data
  })
}

/**
 * 删除合同用户信息
 * @param {number} id - 合同用户信息ID
 * @returns {Promise} 返回删除结果的Promise对象
 */
export function delContractUserInfo(id) {
  return request({
    url: '/business/contractUserinfo/' + id,
    method: 'delete'
  })
}

/**
 * 获取跟进用户列表
 * @returns {Promise} 返回用户列表的Promise对象
 */
export function getFollowUserList() {
  return request({
    url: '/business/contractUserinfo/selectUserForContract',
    method: 'get'
  })
}

