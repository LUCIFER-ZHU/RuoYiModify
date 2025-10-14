import request from '@/utils/request'

// 查询收款账户列表
export function listReceivingAccount(query) {
  return request({
    url: '/business/receivingAccount/page',
    method: 'get',
    params: query
  })
}

// 查询收款账户详情
export function getReceivingAccount(id) {
  return request({
    url: '/business/receivingAccount/detail/' + id,
    method: 'get'
  })
}

// 新增收款账户
export function addReceivingAccount(data) {
  return request({
    url: '/business/receivingAccount',
    method: 'post',
    data: data
  })
}

// 修改收款账户
export function updateReceivingAccount(data) {
  return request({
    url: '/business/receivingAccount',
    method: 'put',
    data: data
  })
}

// 删除收款账户
export function deleteReceivingAccount(id) {
  return request({
    url: '/business/receivingAccount/' + id,
    method: 'delete'
  })
}

// 根据收款类型获取收款账户列表
export function getReceivingAccountList(benType) {
  return request({
    url: '/business/receivingAccount/getByAccount',
    method: 'get',
    params: {
      benType: benType
    }
  })
}