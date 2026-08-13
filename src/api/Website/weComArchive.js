import request from '@/utils/request'

/**
 * 获取企业微信消息列表
 * @param {Object} query - 查询参数
 * @param {string} query.action - 消息动作
 * @param {number} query.endMsgTime - 搜索结束时间（时间戳）
 * @param {string} query.from - 消息发送方id
 * @param {number} query.id - 自增主键
 * @param {string} query.msgType - 消息类型
 * @param {string} query.roomId - 群聊消息的id
 * @param {number} query.startMsgTime - 搜索起始时间（时间戳）
 * @param {number} query.pageNum - 页码
 * @param {number} query.pageSize - 每页数量
 * @returns {Promise<Object>} 消息列表响应
 */
export function getWeComMessageList(query) {
  return request({
    url: '/business/qywxMessage/list',
    method: 'get',
    params: query
  })
}

/**
 * 获取企业微信消息详情（分页聊天记录）
 * @param {Object} query - 查询参数
 * @param {number} query.id - 参考消息ID（必填）
 * @param {number} [query.pageNum=1] - 页码
 * @param {number} [query.pageSize=20] - 每页条数
 * @returns {Promise<Object>} 分页后的消息列表响应
 */
export function getWeComMessageDetail(query) {
  return request({
    url: '/business/qywxMessage/detail',
    method: 'get',
    params: query
  })
}

/**
 * 同步企业微信消息数据
 * @returns {Promise<Object>} 同步操作响应
 */
export function importFullWeComMessage() {
  return request({
    url: '/business/qywxMessage/importFull',
    method: 'post'
  })
}

/**
 * 同步企业微信客户数据
 * @returns {Promise<Object>} 同步操作响应
 */
export function syncWeComCustomer() {
  return request({
    url: '/business/qywxCustomer/sync',
    method: 'post'
  })
}
