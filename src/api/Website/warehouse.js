import request from '@/utils/request'
import { mockWarehouseApi, USE_MOCK } from './mock/warehouse-mock'

// 查询仓库列表
export function listWarehouse(query) {
  if (USE_MOCK) {
    return mockWarehouseApi.getList(query)
  }
  return request({
    url: '/business/warehouse/page',
    method: 'get',
    params: query
  })
}

// 查询仓库详细
export function getWarehouse(id) {
  if (USE_MOCK) {
    return mockWarehouseApi.getWarehouse(id)
  }
  return request({
    url: '/business/warehouse/detail/' + id,
    method: 'get'
  })
}

// 新增仓库
export function addWarehouse(data) {
  if (USE_MOCK) {
    return mockWarehouseApi.addWarehouse(data)
  }
  return request({
    url: '/business/warehouse',
    method: 'post',
    data: data
  })
}

// 修改仓库
export function updateWarehouse(data) {
  if (USE_MOCK) {
    return mockWarehouseApi.updateWarehouse(data)
  }
  return request({
    url: '/business/warehouse',
    method: 'put',
    data: data
  })
}

// 删除仓库
export function delWarehouse(id) {
  if (USE_MOCK) {
    return mockWarehouseApi.delWarehouse(id)
  }
  return request({
    url: '/business/warehouse/' + id,
    method: 'delete'
  })
}
