import request from '@/utils/request';

// 部门接口，用于合同等需要关联的
export function getSysDeptList() {
  return request({
    url: '/business/customer/getSysDeptList',
    method: 'get',
  })
}

// 根据部门ID获取用户信息（部门个人），用于合同等需要关联的，私海
export function getSysUserList(query) {
  return request({
    url: '/business/customer/getSysUserList',
    method: 'get',
    params: query
  })
}

// 根据部门ID获取用户信息（部门全部），子公海
export function getAllocationSysUserList(query) {
  return request({
    url: '/business/customer/allocationSysUserList',
    method: 'get',
    params: query
  })
}

// 获取所有用户信息，公司公海
export function getAllSysUserList() {
  return request({
    url: '/business/commissionRecord/sysUserList',
    method: 'get',
  })
}

// 部门接口2，用于采购等不需要关联的
export function getSysDeptList2() {
  return request({
    url: `/business/purchase/sysDeptList`,
    method: 'get',
  })
}

// 根据部门ID获取用户信息2，用于采购等不需要关联的
export function getSysUserList2(query) {
  return request({
    url: '/business/purchase/sysUserList',
    method: 'get',
    params: query
  })
}

// 部门接口，只客户模块用
export function getSysDeptList3() {
  return request({
    url: '/business/customer/getSysDeptLists',
    method: 'get',
  })
}


// 获取所有用户信息
export function getAllUserList() {
  return request({
    url: '/human/attendanceRecords/allUserList',
    method: 'get'
  })
}