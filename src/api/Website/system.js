import request from '@/utils/request';

// 部门接口，用于合同等需要关联的
export function getSysDeptList() {
  return request({
    url: '/business/customer/getSysDeptList',
    method: 'get',
  })
}

// 根据部门ID获取用户信息，用于合同等需要关联的
export function getSysUserList(query) {
  return request({
    url: '/business/customer/getSysUserList',
    method: 'get',
    params: query
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