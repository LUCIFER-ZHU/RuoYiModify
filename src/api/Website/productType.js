import request from '@/utils/request'

// 查询生成表数据
export function getTreeList(query) {
  return request({
    url: '/business/productType/tree',
    method: 'get',
    params: query
  })
}

// 新增节点
export function addNode(data) {
  return request({
    url: '/business/productType/add',
    method: 'post',
    data
  })
}

// 编辑节点
export function editNode(data) {
  return request({
    url: '/business/productType/edit',
    method: 'put',
    data
  })
}

//删除节点
export function deleteNode(id) {
  return request({
    url: '/business/productType/' + id,
    method: 'delete'
  })
}

//更新状态
export function updateStatus(id) {
  return request({
    url: '/business/productType/updateStatus/'+ id,
    method: 'put'
  })
}

// 获取分类字典树
export function getDictTree() {
  return request({
    url: '/business/productType/dictTree',
    method: 'get'
  })
}