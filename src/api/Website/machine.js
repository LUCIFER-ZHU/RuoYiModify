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
 * @param {string} [data.contract_id] - 所属合同 UUID
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
 * @param {string} commendId - 命令 ID
 * @returns {Promise} - 请求Promise
 */
export function commendDown(deviceId, commendId) {
  return request({
    url: `/device/command/down/${deviceId}/${commendId}`,
    method: 'post'
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
