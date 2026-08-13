import request from '@/utils/request'

// 查询岗位列表
export function postOptions() {
  return request({
    url: '/system/post/optionselect',
    method: 'get'
  })
}

// 分页查询用户储备列表
export function pageHumanReserve(param) {
  return request({
    url: '/human/reserve/page',
    method: 'get',
    params: param
  })
}

// 添加用户储备
export function addHumanReserve(data) {
  return request({
    url: '/human/reserve/add',
    method: 'post',
    data: data
  })
}

// 切换关注状态
export function changeAttentions(humanInfoId) {
  return request({
    url: '/human/reserve/changeAttention',
    method: 'put',
    params: {humanInfoId : humanInfoId}
  })
}

// 删除操作
export function deleteData(humanInfoId) {
  return request({
    url: '/human/reserve/delete',
    method: 'delete',
    params: { humanInfoId : humanInfoId }
  })
}

// 根据humanInfoId查询用户信息
export function getDataByHumanInfoId(humanInfoId) {
  return request({
    url: '/human/reserve/getDataByHumanInfoId',
    method: 'get',
    params: { humanInfoId : humanInfoId }
  })
}

// 修改用户信息
export function updateData(data) {
  return request({
    url: '/human/reserve/edit',
    method: 'put',
    data: data
  })
}

// 查询员工列表
export function getAllEmployee() {
  return request({
    url: '/human/employee/getAllEmployee',
    method: 'get'
  })
}

// 当前状态
export function changeState(data) {
  return request({
    url: '/human/changeState',
    method: 'put',
    data: data
  })
}

export function getInterviewByHumanInfoId(humanInfoId) {
  return request({
    url: '/human/interview/getInterviewByHumanInfoId',
    method: 'get',
    params: { humanInfoId: humanInfoId }
  })
}

// 普通的预约面试信息
export function scheduleInterview(data) {
  return request({
    url: '/human/interview/schedule',
    method: 'post',
    data: data
  })
}

// 普通的预约面试信息
export function deleteInterview(interviewInfoId) {
  return request({
    url: '/human/interview/delete',
    method: 'delete',
    params: { interviewInfoId: interviewInfoId }
  })
}

// 获取面试信息
export function getInterviewInfoId(interviewInfoId) {
  return request({
    url: '/human/interview/getInterviewInfoId',
    method: 'get',
    params: { interviewInfoId: interviewInfoId }
  })
}

// 获取面试信息
export function getByHumanInfoId(humanInfoId) {
  return request({
    url: '/human/interview_score/getByHumanInfoId',
    method: 'get',
    params: { humanInfoId: humanInfoId }
  })
}

// 添加评分功能
export function addInterviewSource(data) {
  return request({
    url: '/human/interview_score/add',
    method: 'post',
    data: data
  })
}

export function editInterviewScore(data){
  return request({
    url: '/human/interview_score/edit',
    method: 'put',
    data: data
  })
}

// 取消面试功能
export function cancelInterview(data){
    return request({
      url: '/human/interview/changeStatus',
      method: 'put',
      data: data
    })
}

export function getHumanDetailsInfoByHumanInfo(humanInfoId){
  return request({
    url: '/human/getHumanDetailsInfoByHumanInfo',
    method: 'get',
    params: { humanInfoId: humanInfoId }
  })
}


// 根据人力资源id修改人力资源数据接口
export function editHumanDetails(data){
  return request({
    url: '/human/editHumanDetails',
    method: 'put',
    data: data
  })
}

// 打分功能
// export function scoreInterview(data) {
//   return request({
//     url: '/human/interview/score',
//     method: 'put',
//     data: data
//   })
// }

/**
 * 查询考勤记录列表
 * @param {Object} params - 查询参数对象
 * @param {number} [params.code] - 员工考勤编号（可选）
 * @param {string} [params.date] - 日期（可选）
 * @returns {Promise} 返回考勤记录列表数据
 */
export function listAttendance(params) {
  return request({
    url: '/human/attendanceRecords/list',
    method: 'get',
    params: params
  })
}

/**
 * 导入考勤记录数据
 * @param {FormData} formData - 包含文件的FormData对象
 * @returns {Promise} 返回导入结果
 */
export function importAttendanceData(formData) {
  return request({
    url: '/human/attendanceRecords/importData',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 查询考勤时段设置列表
 * @returns {Promise} 返回考勤时段设置列表
 */
export function listAttendanceSettings() {
  return request({
    url: '/human/attendanceSettings/list',
    method: 'get'
  })
}

/**
 * 新增考勤时段设置
 * @param {Object} data - 考勤时段设置数据
 * @returns {Promise} 返回操作结果
 */
export function addAttendanceSettings(data) {
  return request({
    url: '/human/attendanceSettings',
    method: 'post',
    data: data
  })
}

/**
 * 修改考勤时段设置
 * @param {Object} data - 考勤时段设置数据
 * @returns {Promise} 返回操作结果
 */
export function updateAttendanceSettings(data) {
  return request({
    url: '/human/attendanceSettings',
    method: 'put',
    data: data
  })
}

/**
 * 更新考勤时段启用状态
 * @param {number} id - 考勤时段设置ID
 * @returns {Promise} 返回操作结果
 */
export function updateAttendanceSettingsStatus(id) {
  return request({
    url: '/human/attendanceSettings/updateStatus',
    method: 'post',
    params: { id }
  })
}

/**
 * 获取当前已激活的考勤时段
 * @returns {Promise} 返回当前已激活的考勤时段
 */
export function getUsingAttendanceSettings() {
  return request({
    url: '/human/attendanceSettings/using',
    method: 'get'
  })
}

/**
 * 默认通过考勤记录
 * @param {Object} data - 请求参数对象
 * @param {string} [data.attendanceDate] - 出勤日期
 * @param {number} [data.code] - 员工考勤编号
 * @param {string} [data.employeeName] - 员工名称
 * @returns {Promise} 返回操作结果
 */
export function defaultPass(data) {
  return request({
    url: '/human/attendanceStatistics/defaultPass',
    method: 'post',
    data: data
  })
}

/**
 * 异常处理考勤记录
 * @param {Object} data - 请求参数对象
 * @param {string} [data.attendanceDate] - 出勤日期
 * @param {number} [data.code] - 员工考勤编号
 * @param {string} [data.employeeName] - 员工名称
 * @param {Array<string>} [data.images] - 记录图片数组
 * @param {number} [data.laterCounts] - 迟到次数
 * @param {number} [data.leaveDays] - 请假天数
 * @param {number} [data.leavesEarlyCounts] - 早退次数
 * @returns {Promise} 返回操作结果
 */
export function abnormalAttendance(data) {
  return request({
    url: '/human/attendanceStatistics/abnormal',
    method: 'post',
    data: data
  })
}

/**
 * 查询个人月度考勤统计列表
 * @param {Object} params - 查询参数对象
 * @param {string} [params.attendanceDate] - 出勤日期（可选）
 * @param {number} [params.code] - 员工考勤编号（可选）
 * @returns {Promise} 返回个人月度考勤统计列表数据
 */
export function listAttendanceStatistics(params) {
  return request({
    url: '/human/attendanceStatistics/list',
    method: 'get',
    params: params
  })
}

/**
 * 获取考勤对应员工列表（用于下拉框选择）
 * @returns {Promise} 返回员工列表数据，包含员工名称和考勤编号
 */
export function getAttendanceUserList() {
  return request({
    url: '/human/attendanceRecords/allUserList',
    method: 'get'
  })
}

/**
 * 新增考勤统计记录
 * @param {Object} data - 请求参数对象
 * @param {string} [data.attendanceDate] - 出勤日期
 * @param {number} [data.code] - 员工考勤编号
 * @param {Array<string>} [data.images] - 记录图片数组
 * @param {number} [data.laterCounts] - 迟到次数
 * @param {number} [data.leaveDays] - 请假天数
 * @param {number} [data.leavesEarlyCounts] - 早退次数
 * @returns {Promise} 返回操作结果
 */
export function addAttendanceStatistics(data) {
  return request({
    url: '/human/attendanceStatistics',
    method: 'post',
    data: data
  })
}

/**
 * 编辑考勤统计记录
 * @param {Object} data - 请求参数对象
 * @param {number} [data.id] - 考勤统计ID（必填）
 * @param {string} [data.attendanceDate] - 出勤日期
 * @param {number} [data.code] - 员工考勤编号
 * @param {Array<string>} [data.images] - 记录图片数组
 * @param {number} [data.laterCounts] - 迟到次数
 * @param {number} [data.leaveDays] - 请假天数
 * @param {number} [data.leavesEarlyCounts] - 早退次数
 * @returns {Promise} 返回操作结果
 */
export function updateAttendanceStatistics(data) {
  return request({
    url: '/human/attendanceStatistics',
    method: 'put',
    data: data
  })
}

/**
 * 查询考勤统计综合信息
 * @param {Object} params - 查询参数对象
 * @param {string} [params.time] - 出勤月份（YYYY-MM格式）
 * @param {number} [params.userId] - 员工ID
 * @returns {Promise} 返回考勤统计综合信息
 */
export function getAttendanceComprehensiveInfo(params) {
  return request({
    url: '/human/attendanceStatistics/comprehensiveInfo',
    method: 'get',
    params: params
  })
}

/**
 * 查询外出记录列表
 * @param {Object} params - 查询参数对象
 * @param {string} [params.leaveTime] - 外出时间（可选）
 * @param {number} [params.userId] - 员工ID（可选）
 * @param {number} [params.pageNum] - 当前页码（可选，默认1）
 * @param {number} [params.pageSize] - 每页条数（可选，默认10）
 * @returns {Promise} 返回外出记录列表数据（分页）
 */
export function listGoOutRecords(params) {
  return request({
    url: '/human/goOutRecords/list',
    method: 'get',
    params: params
  })
}

/**
 * 新增外出记录
 * @param {Object} data - 请求参数对象
 * @param {Array<number>} [data.ids] - 员工ID列表
 * @param {string} [data.leaveTime] - 外出时间
 * @param {string} [data.purpose] - 目的
 * @param {string} [data.remark] - 备注
 * @returns {Promise} 返回操作结果
 */
export function addGoOutRecord(data) {
  return request({
    url: '/human/goOutRecords',
    method: 'post',
    data: data
  })
}

/**
 * 编辑外出记录
 * @param {Object} data - 请求参数对象
 * @param {Array<number>} [data.ids] - 员工ID列表
 * @param {string} [data.leaveTime] - 外出时间
 * @param {string} [data.purpose] - 目的
 * @param {string} [data.remark] - 备注
 * @returns {Promise} 返回操作结果
 */
export function updateGoOutRecord(data) {
  return request({
    url: '/human/goOutRecords',
    method: 'put',
    data: data
  })
}

/**
 * 查询出勤设置列表
 * @param {Object} params - 查询参数对象
 * @param {string} [params.year] - 年份（YYYY格式）
 * @returns {Promise} 返回出勤设置列表数据
 */
export function listWorkingDays(params) {
  return request({
    url: '/human/workingDays/list',
    method: 'get',
    params: params
  })
}

/**
 * 新增出勤设置
 * @param {Object} data - 请求参数对象
 * @param {number} [data.attendanceDays] - 应出勤天数
 * @param {string} [data.attendanceMonth] - 出勤月份（YYYY-MM格式）
 * @returns {Promise} 返回操作结果
 */
export function addWorkingDays(data) {
  return request({
    url: '/human/workingDays',
    method: 'post',
    data: data
  })
}

/**
 * 编辑出勤设置
 * @param {Object} data - 请求参数对象
 * @param {number} [data.id] - ID（主键，必填）
 * @param {number} [data.attendanceDays] - 应出勤天数
 * @param {string} [data.attendanceMonth] - 出勤月份（YYYY-MM格式）
 * @returns {Promise} 返回操作结果
 */
export function updateWorkingDays(data) {
  return request({
    url: '/human/workingDays',
    method: 'put',
    data: data
  })
}

/**
 * 根据出勤月份查询出勤设置信息
 * @param {Object} params - 查询参数对象
 * @param {string} [params.attendanceMonth] - 出勤月份（YYYY-MM格式）
 * @returns {Promise} 返回出勤设置信息
 */
export function getWorkingDaysByMonth(params) {
  return request({
    url: '/human/workingDays/attendanceMes',
    method: 'get',
    params: params
  })
}

/**
 * 一键确认考勤统计
 * @param {Object} data - 请求参数对象
 * @param {Array<number>} [data.ids] - 考勤统计ID列表
 * @param {Object} [data.summary] - 考勤统计综合信息
 * @returns {Promise} 返回操作结果
 */
export function clickToConfirmAttendanceStatistics(data) {
  return request({
    url: '/human/attendanceStatistics/clickToConfirm',
    method: 'post',
    data: data
  })
}

/**
 * 查询我的月度考勤详情
 * @param {Object} params - 查询参数对象
 * @param {string} [params.time] - 出勤月份（YYYY-MM格式）
 * @returns {Promise} 返回月度考勤详情列表数据
 */
export function getMyAttendanceDetail(params) {
  return request({
    url: '/human/attendanceStatistics/detail',
    method: 'get',
    params: params
  })
}

/**
 * 查询考勤汇总列表
 * @param {Object} params - 查询参数对象
 * @param {number} [params.actualAttendanceDays] - 实际出勤天数
 * @param {number} [params.attendanceDays] - 应出勤天数
 * @param {string} [params.attendanceMonth] - 出勤月份（YYYY-MM格式）
 * @param {string} [params.employeeName] - 员工名称
 * @param {number} [params.userId] - 用户ID
 * @param {number} [params.totalLaterCounts] - 迟到次数
 * @param {number} [params.totalLeaveDays] - 请假天数
 * @param {number} [params.totalLeavesEarlyCounts] - 早退次数
 * @param {number} [params.pageNum] - 当前页码
 * @param {number} [params.pageSize] - 每页条数
 * @returns {Promise} 返回考勤汇总列表数据
 */
export function listAttendanceSummary(params) {
  return request({
    url: '/human/attendanceSummary/list',
    method: 'get',
    params: params
  })
}

/**
 * 新增考勤汇总
 * @param {Object} data - 请求参数对象
 * @param {number} [data.actualAttendanceDays] - 实际出勤天数
 * @param {number} [data.attendanceDays] - 应出勤天数
 * @param {string} [data.attendanceMonth] - 出勤月份（YYYY-MM格式）
 * @param {string} [data.employeeName] - 员工名称
 * @param {number} [data.userId] - 用户ID
 * @param {number} [data.totalLaterCounts] - 迟到次数
 * @param {number} [data.totalLeaveDays] - 请假天数
 * @param {number} [data.totalLeavesEarlyCounts] - 早退次数
 * @param {string} [data.remark] - 备注
 * @returns {Promise} 返回操作结果
 */
export function addAttendanceSummary(data) {
  return request({
    url: '/human/attendanceSummary',
    method: 'post',
    data: data
  })
}

/**
 * 编辑考勤汇总
 * @param {Object} data - 请求参数对象
 * @param {number} [data.id] - ID（主键，必填）
 * @param {number} [data.actualAttendanceDays] - 实际出勤天数
 * @param {number} [data.attendanceDays] - 应出勤天数
 * @param {string} [data.attendanceMonth] - 出勤月份（YYYY-MM格式）
 * @param {string} [data.employeeName] - 员工名称
 * @param {number} [data.userId] - 用户ID
 * @param {number} [data.totalLaterCounts] - 迟到次数
 * @param {number} [data.totalLeaveDays] - 请假天数
 * @param {number} [data.totalLeavesEarlyCounts] - 早退次数
 * @param {string} [data.remark] - 备注
 * @returns {Promise} 返回操作结果
 */
export function updateAttendanceSummary(data) {
  return request({
    url: '/human/attendanceSummary',
    method: 'put',
    data: data
  })
}

/**
 * 查询个人考勤综合信息
 * @param {Object} params - 查询参数对象
 * @param {string} [params.time] - 出勤月份（YYYY-MM格式）
 * @returns {Promise} 返回个人考勤综合信息
 */
export function getPersonalComprehensiveInfo(params) {
  return request({
    url: '/human/attendanceStatistics/personalComprehensiveInfo',
    method: 'get',
    params: params
  })
}

/**
 * 查询打分周期版本列表
 * @returns {Promise} 返回打分周期版本列表数据
 */
export function listScoreCycleVersion() {
  return request({
    url: '/human/scoreCycleVersion/list',
    method: 'get'
  })
}

/**
 * 新增打分周期版本
 * @param {Object} data - 请求参数对象
 * @param {number} [data.id] - 主键ID（可选）
 * @param {string} [data.week] - 周期（可选，格式：第1周）
 * @param {string} [data.yearMonth] - 年月（可选）
 * @returns {Promise} 返回操作结果
 */
export function addScoreCycleVersion(data) {
  return request({
    url: '/human/scoreCycleVersion',
    method: 'post',
    data: data
  })
}

/**
 * 编辑打分周期版本
 * @param {Object} data - 请求参数对象
 * @param {number} [data.id] - 主键ID（必填）
 * @param {string} [data.week] - 周期（可选，格式：第1周）
 * @param {string} [data.yearMonth] - 年月（可选）
 * @returns {Promise} 返回操作结果
 */
export function updateScoreCycleVersion(data) {
  return request({
    url: '/human/scoreCycleVersion',
    method: 'put',
    data: data
  })
}

/**
 * 查询日志记录列表
 * @param {Object} params - 查询参数对象
 * @param {string} [params.creatorId] - 创建人ID（可选）
 * @param {number} [params.endTime] - 结束时间（时间戳，可选）
 * @param {number} [params.pageNum] - 当前页码（可选）
 * @param {number} [params.pageSize] - 每页条数（可选）
 * @param {number} [params.startTime] - 开始时间（时间戳，可选）
 * @returns {Promise} 返回日志记录列表数据
 */
export function listReportRecords(params) {
  return request({
    url: '/human/reportRecords/list',
    method: 'get',
    params: params
  })
}

/**
 * 获取报表用户列表
 * @returns {Promise} 返回用户列表数据
 */
export function getReportUserList() {
  return request({
    url: '/human/reportRecords/userList',
    method: 'get'
  })
}

/**
 * 合并统计报表记录
 * @param {Object} data - 统计参数对象
 * @param {Array<number>} [data.ids] - 选中的记录ID数组（必填）
 * @param {number} [data.version] - 版本号（可选）
 * @returns {Promise} 返回统计结果
 */
export function statisticsReportRecords(data) {
  return request({
    url: '/human/reportRecords/statistics',
    method: 'post',
    data: data
  })
}

/**
 * 删除打分记录
 * @param {number} id - 打分记录ID
 * @returns {Promise} 返回删除结果
 */
export function delScoreRecord(id) {
  return request({
    url: `/human/reportRecords/delScoreRecord/${id}`,
    method: 'delete'
  })
}

/**
 * 获取复盘参与人列表
 * @param {Object} params - 查询参数对象
 * @returns {Promise} 返回复盘参与人列表数据
 */
export function listReviewParticipant(params) {
  return request({
    url: '/human/reviewParticipant/list',
    method: 'get',
    params: params
  })
}

/**
 * 新增复盘参与人
 * @param {Object} data - 复盘参与人数据对象
 * @returns {Promise} 返回新增结果
 */
export function addReviewParticipant(data) {
  return request({
    url: '/human/reviewParticipant',
    method: 'post',
    data: data
  })
}

/**
 * 修改复盘参与人
 * @param {Object} data - 复盘参与人数据对象
 * @returns {Promise} 返回修改结果
 */
export function updateReviewParticipant(data) {
  return request({
    url: '/human/reviewParticipant',
    method: 'put',
    data: data
  })
}

/**
 * 更新复盘参与人使用状态
 * @param {Object} data - 复盘参与人数据对象
 * @returns {Promise} 返回更新结果
 */
export function updateUsedReviewParticipant(data) {
  return request({
    url: '/human/reviewParticipant/updateUsed',
    method: 'post',
    data: data
  })
}

/**
 * 查询打分汇总列表
 * @param {Object} params - 查询参数对象
 * @param {number} [params.version] - 周期版本号（可选）
 * @returns {Promise} 返回打分汇总列表数据
 */
export function listScoreStatistics(params) {
  return request({
    url: '/human/scoreStatistics/list',
    method: 'get',
    params: params
  })
}

/**
 * 添加复盘打分记录
 * @param {Object} data - 请求参数对象
 * @param {number} [data.id] - 主键ID（可选）
 * @param {Array} [data.records] - 打分记录数组（可选）
 * @param {string} [data.userId] - 被打分人ID（可选）
 * @param {string} [data.userName] - 被打分人姓名（可选）
 * @param {number} [data.version] - 周期版本号（可选）
 * @returns {Promise} 返回操作结果
 * @throws {Error} 当请求失败时抛出错误
 */
export function addReviewScoreRecords(data) {
  return request({
    url: '/human/scoreStatistics/addReviewScoreRecords',
    method: 'post',
    data: data
  })
}

/**
 * 修改复盘打分记录
 * @param {Object} data - 请求参数对象
 * @param {number} [data.id] - 主键ID（可选）
 * @param {Array} [data.records] - 打分记录数组（可选）
 * @param {string} [data.userId] - 被打分人ID（可选）
 * @param {string} [data.userName] - 被打分人姓名（可选）
 * @param {number} [data.version] - 周期版本号（可选）
 * @returns {Promise} 返回操作结果
 * @throws {Error} 当请求失败时抛出错误
 */
export function updateReviewScoreRecords(data) {
  return request({
    url: '/human/scoreStatistics/updateReviewScoreRecords',
    method: 'put',
    data: data
  })
}

/**
 * 获取复盘打分记录列表
 * @param {Object} data - 请求参数对象
 * @param {string} [data.dingtalkId] - 被打分人钉钉ID（可选）
 * @param {string} [data.dingtalkName] - 被打分人名称（可选）
 * @param {number} [data.id] - 主键ID（可选）
 * @param {number} [data.version] - 周期版本号（可选）
 * @returns {Promise} 返回复盘打分记录列表数据
 * @throws {Error} 当请求失败时抛出错误
 */
export function reviewScoreRecordsList(data) {
  return request({
    url: '/human/scoreStatistics/reviewScoreRecordsList',
    method: 'post',
    data: data
  })
}

/**
 * 获取日志部门打分记录列表
 * @param {Object} data - 请求参数对象
 * @param {string} [data.dingtalkId] - 被打分人钉钉ID（可选）
 * @param {number} [data.scoreType] - 分数类型(0-总经理,1-部门)（可选，部门为1）
 * @param {number} [data.version] - 周期版本号（可选）
 * @returns {Promise} 返回部门日志打分记录列表数据
 * @throws {Error} 当请求失败时抛出错误
 */
export function deptReportScoreRecordsList(data) {
  return request({
    url: '/human/scoreStatistics/deptReportScoreRecordsList',
    method: 'post',
    data: data
  })
}

/**
 * 获取日志总经理打分记录列表
 * @param {Object} data - 请求参数对象
 * @param {string} [data.dingtalkId] - 被打分人钉钉ID（可选）
 * @param {number} [data.scoreType] - 分数类型(0-总经理,1-部门)（可选，总经理为0）
 * @param {number} [data.version] - 周期版本号（可选）
 * @returns {Promise} 返回总经理日志打分记录列表数据
 * @throws {Error} 当请求失败时抛出错误
 */
export function managerReportScoreRecordsList(data) {
  return request({
    url: '/human/scoreStatistics/managerReportScoreRecordsList',
    method: 'post',
    data: data
  })
}

/**
 * 根据时间同步钉钉日志
 * @param {Object} params - 查询参数对象
 * @param {number} [params.endTime] - 结束时间（时间戳，可选）
 * @param {number} [params.startTime] - 开始时间（时间戳，可选）
 * @returns {Promise} 返回操作结果
 */
export function processReports(params) {
  return request({
    url: '/human/report/processReports',
    method: 'post',
    params: params
  })
}

/**
 * 根据时间同步钉钉日志打分
 * @param {Object} params - 查询参数对象
 * @param {number} [params.endTime] - 结束时间（时间戳，可选）
 * @param {number} [params.startTime] - 开始时间（时间戳，可选）
 * @returns {Promise} 返回操作结果
 */
export function processReportComments(params) {
  return request({
    url: '/human/report/processReportComments',
    method: 'post',
    params: params
  })
}

/**
 * 获取年度均分
 * @param {Object} params - 查询参数对象
 * @param {string} [params.dingtalkId] - 钉钉用户ID（可选）
 * @param {number} [params.years] - 年份（可选）
 * @returns {Promise} 返回年度均分数据
 */
export function getScoreByYear(params) {
  return request({
    url: '/human/scoreStatistics/scoreByYear',
    method: 'get',
    params: params
  })
}

/**
 * 导出打分记录
 * @param {Object} params - 查询参数对象
 * @param {Array<number>} [params.ids] - 选中的记录ID数组（可选）
 * @returns {Promise} 返回导出结果
 */
export function exportScoreStatistics(params) {
  return request({
    url: '/human/scoreStatistics/export',
    method: 'get',
    params: params,
    responseType: 'blob'
  })
}