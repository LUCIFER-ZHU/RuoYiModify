import request from '@/utils/request'

/**
 * 查询当前操作员已分配的工序列表（状态为未开工或进行中）
 * @param {number} operatorId - 操作员ID（用户userId）
 * @returns {Promise<Array>} - MnProcessExecution 列表
 */
export function personalExecutionList(operatorId) {
  return request({
    url: '/business/processExecution/personalExecutionList',
    method: 'get',
    params: { operatorId }
  })
}

/**
 * 获取工序明细及累计操作时间（按版本配对累加毫秒数）
 * @param {number} executionId - 报工单ID
 * @returns {Promise<Object>} - MnProcessExecutionDetail（含 countTime 累计毫秒数、version、remark）
 */
export function getCountTime(executionId) {
  return request({
    url: '/business/processExecution/getCountTime',
    method: 'get',
    params: { executionId }
  })
}

/**
 * 开始工序（首次开始或暂停后恢复）
 * @param {number} executionId - 报工单ID
 * @param {number} operatorId - 操作员ID
 * @returns {Promise<void>}
 */
export function startProcess(executionId, operatorId) {
  return request({
    url: '/business/processExecution/start',
    method: 'post',
    params: { executionId, operatorId }
  })
}

/**
 * 暂停工序
 * @param {number} executionId - 报工单ID
 * @param {number} operatorId - 操作员ID
 * @returns {Promise<void>}
 */
export function pauseProcess(executionId, operatorId) {
  return request({
    url: '/business/processExecution/pause',
    method: 'post',
    params: { executionId, operatorId }
  })
}

/**
 * 结束工序
 * @param {number} executionId - 报工单ID
 * @param {number} operatorId - 操作员ID
 * @returns {Promise<void>}
 */
export function finishProcess(executionId, operatorId) {
  return request({
    url: '/business/processExecution/finish',
    method: 'post',
    params: { executionId, operatorId }
  })
}
