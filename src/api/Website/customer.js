import request from '@/utils/request'
import { mockCustomerApi, USE_MOCK } from './mock/customer-mock'

// 查询客户列表
export function listCustomer(query) {
  if (USE_MOCK) {
    return mockCustomerApi.getList(query)
  }
  return request({
    url: '/business/customer/list',
    method: 'get',
    params: query
  })
}

// 查询客户详细
export function getCustomer(id) {
  if (USE_MOCK) {
    return mockCustomerApi.getCustomer(id)
  }
  return request({
    url: '/business/customer/detail/' + id,
    method: 'get'
  })
}

// 新增客户
export function addCustomer(data) {
  if (USE_MOCK) {
    return mockCustomerApi.addCustomer(data)
  }
  return request({
    url: '/business/customer',
    method: 'post',
    data: data
  })
}

// 修改客户
export function updateCustomer(data) {
  if (USE_MOCK) {
    return mockCustomerApi.updateCustomer(data)
  }
  return request({
    url: '/business/customer',
    method: 'put',
    data: data
  })
}

// 删除客户
export function delCustomer(id) {
  if (USE_MOCK) {
    return mockCustomerApi.delCustomer(id)
  }
  return request({
    url: '/business/customer/' + id,
    method: 'delete'
  })
}

// 移入私海
export function moveToPrivate(query) {
  return request({
    url: '/business/customer/salvage',
    method: 'get',
    params: query
  })
}

// 移入公海
export function moveToPublic(query) {
  return request({
    url: '/business/customer/toTheSea',
    method: 'get',
    params: query
  })
}

// 分配
export function handleAllocation(data) {
  return request({
    url: '/business/customer/allocation',
    method: 'post',
    data: data  
  })  
}

// 获取分配人列表
export function getAssignerList(){
  return request({
    url: '/business/customer/getAssignerList',
    method: 'get'
  })
}

// 获取未联系客户
export function getNoContacted(){
  return request({
    url: '/business/customer/getNoContacted',
    method: 'get'
  })
}


// --------------------------------------客户追踪start--------------------------------------
// 保存
export function saveCustomerTrack(data) {
  return request({
    url: '/business/customerTrack/saving',
    method: 'post',
    data: data
  })
}

// 获取客户追踪列表
export function getCustomerTrackList(query){
  return request({
    url: '/business/customerTrack/list',
    method: 'get',
    params: query
  })
}

// 获取客户追踪其中一条详情
export function getCustomerTrackDetail(id){
  return request({
    url: '/business/customerTrack/detail/' + id,
    method: 'get'
  })
}

// 新增客户追踪
export function addCustomerTrack(data) {
  return request({
    url: '/business/customerTrack',
    method: 'post',
    data: data
  })
}

// 编辑客户追踪
export function editCustomerTrack(data) {
  return request({
    url: '/business/customerTrack',
    method: 'put',
    data: data
  })
}
// --------------------------------------客户追踪end--------------------------------------