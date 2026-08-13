/**
 * Whatsapp社交媒体平台API接口
 */
import request from '@/utils/request'

/**
 * 导入Whatsapp聊天记录
 * @param {Object} data - 导入数据
 * @param {string} data.customerId - 客户ID（必填）
 * @param {string} data.customerName - 客户名称（必填）
 * @param {File} data.file - 聊天记录文件（必填）
 * @returns {Promise<Object>} 导入结果
 * @throws {Error} 当请求失败时抛出
 */
export function importWhatsappRecord(data) {
  return request({
    url: '/business/customer/whatsapp/import',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 获取客户Whatsapp聊天记录列表
 * @param {string} customerId - 客户ID（必填）
 * @param {number} currentPage - 当前页码（可选，默认为1）
 * @returns {Promise<Object>} 聊天记录列表数据
 * @throws {Error} 当请求失败时抛出
 */
export function getWhatsappRecordList(customerId, currentPage = 1) {
  return request({
    url: `/business/customer/whatsapp/page`,
    method: 'get',
    params: {
      customerId: customerId,
      currentPage: currentPage
    }
  })
}

/**
 * 查询当前用户的所有社交平台
 * @returns {Promise<Object>} 社交平台列表数据
 * @throws {Error} 当请求失败时抛出
 */
export function getSocialMediaList() {
  return request({
    url: '/platform/whatsapp/list',
    method: 'get'
  })
}

/**
 * 创建Whatsapp会话
 * @param {Object} [data] - 设备指纹信息（可选）
 * @param {string} [data.userAgent] - 用户代理字符串
 * @param {string} [data.languages] - 浏览器语言设置
 * @param {number} [data.deviceMemory] - 设备内存大小（GB）
 * @param {number} [data.hardwareConcurrency] - CPU核心数
 * @param {string} [data.screen] - 屏幕分辨率
 * @param {number} [data.innerWidth] - 窗口内部宽度
 * @param {number} [data.innerHeight] - 窗口内部高度
 * @returns {Promise<Object>} 会话ID
 * @throws {Error} 当请求失败时抛出
 */
export function createWhatsappSession(data) {
  return request({
    url: '/business/smp/whatsapp/createSession',
    method: 'post',
    data: data
  })
}

/**
 * 获取WhatsApp二维码
 * @param {string} sessionId - 会话ID（必填）
 * @returns {Promise<Object>} 二维码内容
 * @throws {Error} 当请求失败时抛出
 */
export function getWhatsappQRCode(sessionId) {
  return request({
    url: '/business/smp/whatsapp/qr',
    method: 'get',
    params: {
      sessionId: sessionId
    }
  })
}

/**
 * 删除WhatsApp会话
 * @param {string} sessionId - 会话ID（必填）
 * @returns {Promise<Object>} 删除结果
 * @throws {Error} 当请求失败时抛出
 */
export function deleteWhatsappSession(sessionId) {
  return request({
    url: `/business/smp/whatsapp/deleteSession/${sessionId}`,
    method: 'delete'
  })
}

/**
 * 获取客户WhatsApp联系人列表
 * @param {Object} params - 查询参数
 * @param {string} params.customerId - 客户ID（必填）
 * @param {number} params.pageNum - 页码（可选）
 * @param {number} params.pageSize - 每页数量（可选）
 * @returns {Promise<Object>} 联系人分页数据
 * @throws {Error} 当请求失败时抛出
 */
export function getWhatsappContactList(params) {
  return request({
    url: '/whatsapp/contact/list',
    method: 'get',
    params: params
  })
}

/**
 * 绑定客户WhatsApp联系人
 * @param {Object} data - 绑定数据
 * @param {string} data.customerId - 客户ID（必填）
 * @param {string} data.cwcId - 客户联系人BID（必填）
 * @returns {Promise<Object>} 绑定结果
 * @throws {Error} 当请求失败时抛出
 */
export function bindWhatsappContact(data) {
  return request({
    url: '/whatsapp/contact/bind',
    method: 'post',
    params: data
  })
}

/**
 * 获取社交媒体监控日志分页数据
 * @param {Object} params - 查询参数
 * @param {number} params.pageNum - 页码（必填）
 * @param {number} params.pageSize - 每页数量（必填）
 * @returns {Promise<Object>} 监控日志分页数据
 * @throws {Error} 当请求失败时抛出
 */
export function getMonitoringLogList(params) {
  return request({
    url: '/whatsapp/monitoring/page',
    method: 'get',
    params: params
  })
}

/**
 * 根据用户ID查询WhatsApp联系人列表
 * @param {Object} params - 查询参数
 * @param {number} params.userId - ERP用户ID（必填）
 * @param {string} [params.cwcName] - 联系人名称（可选）
 * @param {number} params.pageNum - 页码（必填）
 * @param {number} params.pageSize - 每页数量（必填）
 * @returns {Promise<Object>} 联系人分页数据
 * @throws {Error} 当请求失败时抛出
 */
export function getWhatsappContactListByUserId(params) {
  return request({
    url: '/whatsapp/contact/listByUserId',
    method: 'get',
    params: params
  })
}

/**
 * 获取WhatsApp聊天记录列表（分页）
 * @param {Object} params - 查询参数
 * @param {string} [params.cwcId] - WhatsApp联系人ID（可选）
 * @param {number} params.pageNum - 页码（必填）
 * @param {number} params.pageSize - 每页数量（必填）
 * @returns {Promise<Object>} 聊天记录分页数据
 * @throws {Error} 当请求失败时抛出
 */
export function getWhatsappChatRecordPage(params) {
  return request({
    url: '/whatsapp/record/page',
    method: 'get',
    params: params
  })
}

/**
 * 获取监控日志详情
 * @param {string} smlId - 监控日志ID（必填）
 * @returns {Promise<Object>} 监控日志详情数据
 * @throws {Error} 当请求失败时抛出
 */
export function getMonitoringLogDetails(smlId) {
  return request({
    url: '/whatsapp/monitoring/details',
    method: 'get',
    params: {
      smlId: smlId
    }
  })
}
