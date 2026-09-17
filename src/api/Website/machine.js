/**
 * 机器管理模块 API
 * @description 封装机器、设备、设备命令、设备日志、同步任务相关接口
 * @author ERP System
 */

import request from '@/utils/request'

// ==================== 机器管理 ====================

/**
 * 创建机器
 * @param {Object} data - 机器创建参数
 * @param {string} data.machine_name - 机器名称（必填）
 * @param {string} [data.sn] - 机器序列号
 * @param {string} [data.description] - 机器备注
 * @param {string} [data.contract_id] - 所属合同号
 * @returns {Promise} - 请求Promise
 */
export function createMachine(data) {
  return request({
    url: '/iotda/machine/create',
    method: 'post',
    data
  })
}

/**
 * 编辑机器
 * @param {Object} data - 机器更新参数
 * @param {string} data.machine_id - 机器 UUID（必填）
 * @param {string} [data.machine_name] - 新的机器名称
 * @param {string} [data.sn] - 新的机器序列号
 * @param {string} [data.description] - 新的机器备注
 * @returns {Promise} - 请求Promise
 */
export function updateMachine(data) {
  return request({
    url: '/iotda/machine/update',
    method: 'put',
    data
  })
}

/**
 * 删除机器
 * @param {string} machineId - 机器 UUID
 * @returns {Promise} - 请求Promise
 */
export function deleteMachine(machineId) {
  return request({
    url: '/iotda/machine/delete',
    method: 'delete',
    data: { machine_id: machineId }
  })
}

/**
 * 查询机器列表（分页）
 * @param {Object} query - 查询参数
 * @param {number} [query.current=1] - 页码
 * @param {number} [query.size=20] - 每页数量
 * @param {string} [query.machine_name] - 机器名称模糊筛选
 * @returns {Promise} - 请求Promise
 */
export function listMachines(query) {
  return request({
    url: '/iotda/machine/list',
    method: 'get',
    params: query
  })
}

// ==================== 设备管理 ====================

/**
 * 创建设备（含属性与命令定义）
 * @param {Object} data - 设备创建参数
 * @param {string} data.machine_id - 所属机器 UUID（必填）
 * @param {string} data.device_name - 设备名称（必填）
 * @param {string} [data.description] - 设备备注
 * @param {Object} [data.properties] - 设备属性配置，key 为 service_id
 * @param {Array} [data.commands] - 设备命令定义列表
 * @returns {Promise} - 请求Promise
 */
export function createDevice(data) {
  return request({
    url: '/iotda/device/create',
    method: 'post',
    data
  })
}

/**
 * 编辑设备、属性与命令定义
 * @param {Object} data - 设备更新参数
 * @param {string} data.device_id - 设备 UUID（必填）
 * @param {string} [data.device_name] - 新的设备名称
 * @param {string} [data.description] - 新的设备备注
 * @param {Object} [data.properties] - 新的属性配置
 * @param {Array} [data.commands] - 新的命令定义
 * @returns {Promise} - 请求Promise
 */
export function updateDevice(data) {
  return request({
    url: '/iotda/device/update',
    method: 'put',
    data
  })
}

/**
 * 根据设备 ID 查询设备详情（用于编辑回显）
 * @param {string} deviceId - 设备 UUID
 * @returns {Promise} - 请求Promise，data 结构与编辑请求一致
 */
export function getDeviceDetail(deviceId) {
  return request({
    url: '/iotda/device/detail',
    method: 'get',
    params: { device_id: deviceId }
  })
}

/**
 * 复制设备属性结构模板（按 service_id 分组）
 * @param {string} deviceId - 设备 UUID
 * @returns {Promise} - 请求Promise
 */
export function copyDeviceProperty(deviceId) {
  return request({
    url: '/iotda/device/copyProperty',
    method: 'get',
    params: { deviceId }
  })
}

/**
 * 删除设备（逻辑删除，同时删除属性与命令定义）
 * @param {string} deviceId - 设备 UUID
 * @returns {Promise} - 请求Promise
 */
export function deleteDevice(deviceId) {
  return request({
    url: '/iotda/device/delete',
    method: 'delete',
    data: { device_id: deviceId }
  })
}

/**
 * 对指定设备下发 ping 并等待 pong 回包，测试连通性
 * @param {string} deviceId - 设备 UUID
 * @returns {Promise} - 请求Promise，data 含 success、elapsed_ms、device_status、message 等
 */
export function pingDevice(deviceId) {
  return request({
    url: `/iotda/device/ping/${deviceId}`,
    method: 'post'
  })
}

/**
 * 获取一次性临时 RSA 公钥（用于 MQTT 密码协商，60 秒有效）
 * @param {string} deviceId - 设备 UUID
 * @returns {Promise} - 请求Promise，data 为 X.509 公钥 PEM 字符串
 */
export function getDeviceRsaPublicKey(deviceId) {
  return request({
    url: `/iotda/device/rsa/${deviceId}`,
    method: 'get'
  })
}

/**
 * 获取 AES-256-GCM 加密后的 MQTT 密码密文
 * @param {string} deviceId - 设备 UUID
 * @param {string} xRsaKey - 用临时公钥 RSA 加密后的 AES 密钥（Base64），写入请求头 X-RSA-KEY
 * @returns {Promise} - 请求Promise，data 为 Base64(nonce||ciphertext||tag)
 */
export function getEncryptedMqttPassword(deviceId, xRsaKey) {
  return request({
    url: `/iotda/device/mqtt/password/${deviceId}`,
    method: 'post',
    headers: {
      'X-RSA-KEY': xRsaKey,
      repeatSubmit: false
    }
  })
}

/**
 * 查询设备列表（分页）
 * @param {Object} query - 查询参数
 * @param {string} [query.machine_id] - 机器 UUID 筛选
 * @param {number} [query.current=1] - 页码
 * @param {number} [query.size=15] - 每页数量
 * @param {string} [query.device_name] - 设备名称模糊筛选
 * @param {string} [query.device_id] - 设备ID精确筛选
 * @returns {Promise} - 请求Promise
 */
export function listDevices(query) {
  return request({
    url: '/iotda/device/list',
    method: 'get',
    params: query
  })
}

// ==================== 设备命令 ====================

/**
 * 向设备下发指令
 * @param {string} deviceId - 设备 ID
 * @param {string} commandId - 命令 ID
 * @returns {Promise} - 请求Promise
 */
export function commendDown(deviceId, commandId) {
  return request({
    url: `/device/command/down/${deviceId}/${commandId}`,
    method: 'post'
  })
}

/**
 * 查询设备可下发指令列表
 * @param {string} deviceId - 设备 ID
 * @returns {Promise} - 请求Promise
 */
export function listDeviceCommands(deviceId) {
  return request({
    url: `/device/command/list/${deviceId}`,
    method: 'get'
  })
}

// ==================== 设备日志 ====================

/**
 * 查询设备日志
 * @param {Object} query - 查询参数
 * @param {string} query.device_id - 设备 UUID（必填）
 * @param {string} query.start_time - 开始时间（ISO 8601）
 * @param {string} query.end_time - 结束时间（ISO 8601）
 * @param {string} [query.log_level] - 日志等级（可多选逗号分隔）
 * @param {string} [query.log_type] - 日志类型
 * @param {number} [query.current=1] - 页码
 * @param {number} [query.size=20] - 每页数量
 * @returns {Promise} - 请求Promise
 */
export function queryDeviceLogs(query) {
  return request({
    url: '/iotda/device-log/query',
    method: 'get',
    params: query
  })
}

// ==================== 资源下载 ====================

/**
 * 下载 GlobalSign 根证书（客户端证书）
 * @returns {Promise<Blob>} - 证书文件 blob
 */
export function downloadIotdaCert() {
  return request({
    url: '/iotda/file/download/cert',
    method: 'get',
    responseType: 'blob'
  })
}

/**
 * 下载海为示例工程
 * @returns {Promise<Blob>} - 示例工程文件 blob
 */
export function downloadIotdaExample() {
  return request({
    url: '/iotda/file/download/example',
    method: 'get',
    responseType: 'blob'
  })
}

// ==================== 同步任务 ====================

/**
 * 手动重试失败的设备云同步任务
 * @param {string} syncId - 同步任务 UUID
 * @returns {Promise} - 请求Promise
 */
export function retrySyncTask(syncId) {
  return request({
    url: '/iotda/sync-task/retry',
    method: 'post',
    data: { sync_id: syncId }
  })
}
