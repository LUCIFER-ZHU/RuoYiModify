import request from '@/utils/request'

// 查询生成表数据
export function listTable(query) {
  return request({
    url: '/business/product/list',
    method: 'get',
    params: query
  })
}

//更新状态
export function updateStatus(id) {
  return request({
    url: '/business/product/updateStatus/'+ id,
    method: 'put'
  })
}

//删除
export function delCarousel(id) {
  return request({
    url: 'business/product/' + id,
    method: 'delete'
  })
}

// 获取分类字典树
export function getDictTree() {
  return request({
    url: '/business/articleType/dictTree',
    method: 'get'
  })
}

// 新增产品
export function addProduct(data) {
  return request({
    url: '/business/product',
    method: 'post',
    data
  })
}

// 编辑产品
export function updateProduct(data) {
  return request({
    url: '/business/product',
    method: 'put',
    data
  })
}

//详情接口
export const getProductDetail = (id) => {
  return request({
    url: `/business/product/${id}`,
    method: 'get'
  })
}