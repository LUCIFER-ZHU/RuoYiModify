import request from '@/utils/request'

/**
 * 编辑工序执行记录
 * @param {Object} data - 工序执行数据
 * @returns {Promise} - 返回编辑结果
 */
export function updateProcessExecution(data) {
  return request({
    url: '/business/processExecution',
    method: 'put',
    data
  })
}

/**
 * 批量新增工序执行记录
 * @param {Array} executions - 工序执行数据数组
 * @returns {Promise} - 返回新增结果
 */
export function batchAddProcessExecution(executions) {
  return request({
    url: '/business/processExecution',
    method: 'post',
    data: executions 
  })
}

/**
 * 批量删除工序执行记录
 * @param {Array} executions - 工序执行数据数组
 * @returns {Promise} - 返回删除结果
 */
export function batchDeleteProcessExecution(executions) {
  return request({
    url: '/business/processExecution/del',
    method: 'post',
    data: executions
  })
}

/**
 * 更新工序执行状态
 * @param {Object} data - 包含id和status
 * @returns {Promise} - 返回更新结果
 */
export function updateProcessExecutionStatus(data) {
  return request({
    url: '/business/processExecution/updateStatus',
    method: 'post',
    data
  })
}
