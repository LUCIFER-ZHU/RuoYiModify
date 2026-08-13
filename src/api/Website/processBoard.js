import request from '@/utils/request'

/**
 * 获取看板基础三信息（项目数、人员数、总工时）
 * @param {Object} params - 查询参数 { currentYear, currentMonth, currentWeek, startTime, endTime }
 * @returns {Promise} - 返回基础统计数据
 */
export function getBaseStatistics(params) {
  return request({
    url: '/business/processBoard/baseStatistics',
    method: 'get',
    params
  })
}

/**
 * 获取工时统计（按月/日维度）
 * @param {Object} params - 查询参数 { currentYear, currentMonth, currentWeek, startTime, endTime }
 * @returns {Promise} - 返回工时数据 [{dimension, totalHours}]
 */
export function getWorkingStatistics(params) {
  return request({
    url: '/business/processBoard/workingStatistics',
    method: 'get',
    params
  })
}

/**
 * 获取工时分类统计（按月/日维度，按工序分类）
 * @param {Object} params - 查询参数 { currentYear, currentMonth, currentWeek, startTime, endTime }
 * @returns {Promise} - 返回工时分类数据 [{dimension, details: {工序名: 工时}}]
 */
export function getWorkingStatisticsByCategory(params) {
  return request({
    url: '/business/processBoard/workingStatisticsByType',
    method: 'get',
    params
  })
}

/**
 * 获取项目总工时统计
 * @param {Object} params - 查询参数 { currentYear, currentMonth, currentWeek, startTime, endTime }
 * @returns {Promise} - 返回各项目总工时数据
 */
export function getWorkingStatisticsByContract(params) {
  return request({
    url: '/business/processBoard/workingStatisticsByContract',
    method: 'get',
    params
  })
}

/**
 * 获取工序工时分布占比
 * @param {Object} params - 查询参数 { currentYear, currentMonth, currentWeek, startTime, endTime }
 * @returns {Promise} - 返回各工序总工时数据
 */
export function getWorkingStatisticsByProcess(params) {
  return request({
    url: '/business/processBoard/workingStatisticsByProcess',
    method: 'get',
    params
  })
}

/**
 * 获取工时统计详情列表
 * @param {Object} params - 查询参数 { currentYear, currentMonth, currentWeek, startTime, endTime, xLabel, pageNum, pageSize }
 * @returns {Promise} - 返回工时详情列表
 */
export function getWorkingStatisticsList(params) {
  return request({
    url: '/business/processBoard/workingStatisticsList',
    method: 'get',
    params
  })
}

/**
 * 获取工时分类统计详情列表
 * @param {Object} params - 查询参数 { currentYear, currentMonth, currentWeek, startTime, endTime, xLabel, pageNum, pageSize }
 * @returns {Promise} - 返回工时分类详情列表
 */
export function getWorkingStatisticsByTypeList(params) {
  return request({
    url: '/business/processBoard/workingStatisticsByTypeList',
    method: 'get',
    params
  })
}

/**
 * 获取项目总工时统计详情列表
 * @param {Object} params - 查询参数 { currentYear, currentMonth, currentWeek, startTime, endTime, contractId, pageNum, pageSize }
 * @returns {Promise} - 返回项目工时详情列表
 */
export function getWorkingStatisticsByContractList(params) {
  return request({
    url: '/business/processBoard/workingStatisticsByContractList',
    method: 'get',
    params
  })
}

/**
 * 获取工序工时分布占比详情列表
 * @param {Object} params - 查询参数 { currentYear, currentMonth, currentWeek, startTime, endTime, processName, pageNum, pageSize }
 * @returns {Promise} - 返回工序工时详情列表
 */
export function getWorkingStatisticsByProcessList(params) {
  return request({
    url: '/business/processBoard/workingStatisticsByProcessList',
    method: 'get',
    params
  })
}
