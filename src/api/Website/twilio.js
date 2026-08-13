/**
 * Twilio语音通话API接口
 * 用于与后端Twilio服务进行通信
 */

// 引入axios请求封装工具
import request from '@/utils/request'

/**
 * 获取Twilio Access Token
 * 用于初始化Twilio Device
 * @param {Object} params - 请求参数
 * @param {string} params.identity - 用户身份标识（可选）
 * @returns {Promise<Object>} 返回包含token的响应对象
 */
export function getTwilioToken(params) {
  return request({
    url: '/api/twilio/token',
    method: 'get',
    params
  })
}

/**
 * 获取通话记录列表
 * @param {Object} query - 查询参数
 * @param {number} query.pageNum - 页码
 * @param {number} query.pageSize - 每页数量
 * @param {string} query.startTime - 开始时间
 * @param {string} query.endTime - 结束时间
 * @returns {Promise<Object>} 返回通话记录列表
 */
export function getCallHistory(query) {
  return request({
    url: '/api/twilio/call/history',
    method: 'get',
    params: query
  })
}

/**
 * 保存通话记录
 * @param {Object} data - 通话记录数据
 * @param {string} data.callSid - Twilio通话唯一标识
 * @param {string} data.from - 主叫号码
 * @param {string} data.to - 被叫号码
 * @param {string} data.direction - 通话方向(inbound/outbound)
 * @param {number} data.duration - 通话时长(秒)
 * @param {string} data.status - 通话状态
 * @returns {Promise<Object>} 返回保存结果
 */
export function saveCallRecord(data) {
  return request({
    url: '/api/twilio/call/record',
    method: 'post',
    data
  })
}

/**
 * 获取通话详情
 * @param {string} callSid - Twilio通话唯一标识
 * @returns {Promise<Object>} 返回通话详情
 */
export function getCallDetail(callSid) {
  return request({
    url: `/api/twilio/call/${callSid}`,
    method: 'get'
  })
}

/**
 * 获取可用的通话号码列表
 * @returns {Promise<Object>} 返回号码列表
 */
export function getAvailableNumbers() {
  return request({
    url: '/api/twilio/numbers',
    method: 'get'
  })
}

/**
 * 更新用户通话设置
 * @param {Object} data - 设置数据
 * @param {boolean} data.autoAnswer - 是否自动接听
 * @param {string} data.ringtone - 铃声类型
 * @param {number} data.volume - 音量大小
 * @returns {Promise<Object>} 返回更新结果
 */
export function updateCallSettings(data) {
  return request({
    url: '/api/twilio/settings',
    method: 'put',
    data
  })
}

/**
 * 获取用户通话设置
 * @returns {Promise<Object>} 返回用户设置
 */
export function getCallSettings() {
  return request({
    url: '/api/twilio/settings',
    method: 'get'
  })
}

/**
 * 获取通话统计数据
 * @param {Object} query - 查询参数
 * @param {string} query.startDate - 开始日期
 * @param {string} query.endDate - 结束日期
 * @returns {Promise<Object>} 返回统计数据
 */
export function getCallStatistics(query) {
  return request({
    url: '/api/twilio/statistics',
    method: 'get',
    params: query
  })
}

/**
 * 发送短信（Twilio也支持SMS功能）
 * @param {Object} data - 短信数据
 * @param {string} data.to - 接收号码
 * @param {string} data.message - 短信内容
 * @returns {Promise<Object>} 返回发送结果
 */
export function sendSMS(data) {
  return request({
    url: '/api/twilio/sms/send',
    method: 'post',
    data
  })
}

/**
 * 获取短信记录
 * @param {Object} query - 查询参数
 * @returns {Promise<Object>} 返回短信记录列表
 */
export function getSMSHistory(query) {
  return request({
    url: '/api/twilio/sms/history',
    method: 'get',
    params: query
  })
}

