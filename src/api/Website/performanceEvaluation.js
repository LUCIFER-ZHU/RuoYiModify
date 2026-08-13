import request from '@/utils/request'

// ==================== 绩效考核基本信息接口 ====================

/**
 * 查询绩效考核用户列表
 * @param {Object} query - 查询参数
 * @param {string} [query.nickName] - 被考核人姓名（用于过滤）
 * @returns {Promise} 请求Promise
 */
export function listPerformanceUser(query) {
  return request({
    url: '/business/performanceEvaluation/base/userList',
    method: 'get',
    params: query
  })
}

/**
 * 查询未考核用户信息
 * @param {Object} query - 查询参数
 * @param {string} [query.cycleId] - 周期ID
 * @returns {Promise} 请求Promise
 */
export function getUnCheckedUserInfo(query) {
  return request({
    url: '/business/performanceEvaluation/base/unCheckedUserInfo',
    method: 'get',
    params: query
  })
}

/**
 * 查询绩效考核基本信息列表
 * @param {Object} query - 查询参数
 * @param {string} [query.baseId] - 基本信息ID
 * @param {number} [query.userId] - 被考核人ID
 * @param {string} [query.position] - 岗位
 * @param {string} [query.cycleId] - 周期ID
 * @param {string} [query.evaluationYears] - 考核周期(年月)
 * @param {number} [query.evaluationWeeks] - 考核周期(周)
 * @param {string} [query.evaluationDays] - 考核周期(日期时间段)
 * @param {number} [query.scoreLevel] - 分数范围(0:<80, 1:80-89, 2:>=90)
 * @param {number} [query.pageNum] - 当前页码
 * @param {number} [query.pageSize] - 每页条数
 * @returns {Promise} 请求Promise
 */
export function listPerformanceEvaluation(query) {
  return request({
    url: '/business/performanceEvaluation/base/list',
    method: 'get',
    params: query
  })
}

/**
 * 查询我的考核列表
 * @param {Object} query - 查询参数
 * @param {string} [query.baseId] - 基本信息ID
 * @param {number} [query.checkerId] - 考核人ID
 * @param {string} [query.checkerUrl] - 考核人签字
 * @param {string} [query.checkerUrlDate] - 考核人签字日期
 * @param {string} [query.comment] - 直接上级考核评语及期望
 * @param {number} [query.crossDept] - 跨部门
 * @param {number} [query.cycleId] - 周期ID
 * @param {string} [query.evaluationDays] - 考核周期(日期时间段)
 * @param {number} [query.evaluationWeeks] - 考核周期(周)
 * @param {string} [query.evaluationYears] - 考核周期(年月)
 * @param {string} [query.fullName] - 被考核人全名
 * @param {number} [query.humanResourcesId] - 人力资源部复核人ID
 * @param {string} [query.humanResourcesUrl] - 人力资源部复核签字
 * @param {string} [query.humanResourcesUrlDate] - 人力资源部复核签字日期
 * @param {number} [query.id] - ID，主键
 * @param {number} [query.innovationCapability] - 创新能力
 * @param {number} [query.learningAbility] - 学习能力
 * @param {string} [query.nickName] - 被考核人姓名
 * @param {number} [query.ownDept] - 本部门
 * @param {number} [query.pageNum] - 当前页码
 * @param {number} [query.pageSize] - 每页条数
 * @param {string} [query.position] - 岗位
 * @param {string} [query.reviewerUrl] - 审核人签字
 * @param {string} [query.reviewerUrlDate] - 审核人签字日期
 * @param {number} [query.subtotal] - 小计
 * @param {string} [query.suggest] - 下一次考核期绩效改进建议
 * @param {number} [query.surprisingResults] - 超预期结果
 * @param {number} [query.totalScore] - 最终得分
 * @param {number} [query.userId] - 被考核人ID
 * @param {string} [query.userUrl] - 被考核人签字
 * @param {string} [query.userUrlDate] - 被考核人签字日期
 * @param {number} [query.workDiary] - 工作日志
 * @param {number} [query.workDiscipline] - 工作纪律遵守情况
 * @param {number} [query.workEfficiency] - 工作效率
 * @param {number} [query.workError] - 工作失误
 * @param {number} [query.workload] - 工作量
 * @param {number} [query.workQuality] - 工作质量
 * @param {number} [query.workResults] - 工作结果
 * @returns {Promise} 请求Promise
 */
export function listMyPerformanceEvaluation(query) {
  return request({
    url: '/business/performanceEvaluation/base/myList',
    method: 'get',
    params: query
  })
}

/**
 * 查询绩效考核基本信息详情
 * @param {number|string} id - 绩效考核ID
 * @returns {Promise} 请求Promise
 */
export function getPerformanceEvaluation(id) {
  return request({
    url: '/business/performanceEvaluation/base/detail/' + id,
    method: 'get'
  })
}

/**
 * 新增绩效考核基本信息
 * @param {Object} data - 绩效考核数据
 * @param {string} [data.baseId] - 基本信息ID
 * @param {number} [data.userId] - 被考核人ID
 * @param {string} [data.nickName] - 被考核人姓名
 * @param {string} [data.position] - 岗位
 * @param {string} [data.cycleId] - 周期ID
 * @param {number} [data.workQuality] - 工作质量
 * @param {number} [data.workResults] - 工作结果
 * @param {number} [data.workload] - 工作量
 * @param {number} [data.workEfficiency] - 工作效率
 * @param {number} [data.workDiary] - 工作日志
 * @param {number} [data.learningAbility] - 学习能力
 * @param {number} [data.innovationCapability] - 创新能力
 * @param {number} [data.ownDept] - 本部门
 * @param {number} [data.crossDept] - 跨部门
 * @param {number} [data.subtotal] - 小计
 * @param {number} [data.surprisingResults] - 超预期结果
 * @param {number} [data.workError] - 工作失误
 * @param {number} [data.workDiscipline] - 工作纪律遵守情况
 * @param {number} [data.totalScore] - 最终得分
 * @param {string} [data.comment] - 直接上级考核评语及期望
 * @param {string} [data.suggest] - 下一次考核期绩效改进建议
 * @param {string} [data.userUrl] - 被考核人签字
 * @param {string} [data.userUrlDate] - 被考核人签字日期
 * @param {string} [data.checkerUrl] - 考核人签字
 * @param {string} [data.checkerUrlDate] - 考核人签字日期
 * @param {string} [data.humanResourcesUrl] - 人力资源部复核签字
 * @param {string} [data.humanResourcesUrlDate] - 人力资源部复核签字日期
 * @param {string} [data.reviewerUrl] - 审核人签字
 * @param {string} [data.reviewerUrlDate] - 审核人签字日期
 * @returns {Promise} 请求Promise
 */
export function addPerformanceEvaluation(data) {
  return request({
    url: '/business/performanceEvaluation/base/add',
    method: 'post',
    data: data
  })
}

/**
 * 修改绩效考核基本信息
 * @param {Object} data - 绩效考核数据
 * @param {number} [data.id] - ID，主键
 * @returns {Promise} 请求Promise
 */
export function updatePerformanceEvaluation(data) {
  return request({
    url: '/business/performanceEvaluation/base/edit',
    method: 'put',
    data: data
  })
}

/**
 * 删除绩效考核基本信息
 * @param {number|string} id - 绩效考核ID
 * @returns {Promise} 请求Promise
 */
export function delPerformanceEvaluation(id) {
  return request({
    url: '/business/performanceEvaluation/base/' + id,
    method: 'delete'
  })
}

/**
 * 确认绩效考核
 * @param {Object} data - 数据
 * @param {number} data.id - 绩效考核ID
 * @returns {Promise} 请求Promise
 */
export function confirmPerformanceEvaluation(data) {
  return request({
    url: '/business/performanceEvaluation/base/confirm',
    method: 'put',
    data: data
  })
}

// ==================== 绩效考核周期接口 ====================

/**
 * 查询绩效考核周期列表
 * @param {Object} query - 查询参数
 * @param {string} [query.evaluationYears] - 考核周期(年月)
 * @param {number} [query.evaluationWeeks] - 考核周期(周)
 * @param {string} [query.evaluationDays] - 考核周期(日期时间段)
 * @param {number} [query.pageNum] - 当前页码
 * @param {number} [query.pageSize] - 每页条数
 * @returns {Promise} 请求Promise
 */
export function listPerformanceCycle(query) {
  return request({
    url: '/business/performanceEvaluation/cycle/list',
    method: 'get',
    params: query
  })
}

/**
 * 查询用户未打分的考核周期列表
 * @param {Object} query - 查询参数
 * @param {number} [query.userId] - 被考核人ID
 * @returns {Promise} 请求Promise
 */
export function getUnCheckList(query) {
  return request({
    url: '/business/performanceEvaluation/getUnCheckList',
    method: 'get',
    params: query
  })
}

/**
 * 查询绩效考核周期详情
 * @param {number|string} id - 周期ID
 * @returns {Promise} 请求Promise
 */
export function getPerformanceCycle(id) {
  return request({
    url: '/business/performanceEvaluation/cycle/detail/' + id,
    method: 'get'
  })
}

/**
 * 新增绩效考核周期
 * @param {Object} data - 周期数据
 * @param {string} [data.cycleId] - 周期ID
 * @param {string} [data.evaluationYears] - 考核周期(年月)
 * @param {number} [data.evaluationWeeks] - 考核周期(周)
 * @param {string} [data.evaluationDays] - 考核周期(日期时间段)
 * @returns {Promise} 请求Promise
 */
export function addPerformanceCycle(data) {
  return request({
    url: '/business/performanceEvaluation/cycle/add',
    method: 'post',
    data: data
  })
}

/**
 * 修改绩效考核周期
 * @param {Object} data - 周期数据
 * @param {number} [data.id] - ID，主键
 * @returns {Promise} 请求Promise
 */
export function updatePerformanceCycle(data) {
  return request({
    url: '/business/performanceEvaluation/cycle/edit',
    method: 'put',
    data: data
  })
}

/**
 * 删除绩效考核周期
 * @param {number|string} id - 周期ID
 * @returns {Promise} 请求Promise
 */
export function delPerformanceCycle(id) {
  return request({
    url: '/business/performanceEvaluation/cycle/' + id,
    method: 'delete'
  })
}

/**
 * 导出绩效考核数据
 * @param {Object} query - 查询参数
 * @param {string} query.evaluationYears - 考核周期(年月)
 * @returns {Promise} 请求Promise
 */
export function exportPerformanceEvaluation(query) {
  return request({
    url: '/business/performanceEvaluation/base/export',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
