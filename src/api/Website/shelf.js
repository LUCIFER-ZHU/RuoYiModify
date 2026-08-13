import request from '@/utils/request'

// 查询货架列表
export function listShelf(query) {
  return request({
    url: '/business/shelf/page',
    method: 'get',
    params: query
  })
}

// 查询货架详细
export function getShelf(id) {
  return request({
    url: '/business/shelf/detail/' + id,
    method: 'get'
  })
}

// 新增货架
export function addShelf(data) {
  return request({
    url: '/business/shelf',
    method: 'post',
    data: data
  })
}

// 修改货架
export function updateShelf(data) {
  return request({
    url: '/business/shelf',
    method: 'put',
    data: data
  })
}

// 删除货架
export function delShelf(id) {
  return request({
    url: '/business/shelf/' + id,
    method: 'delete'
  })
}