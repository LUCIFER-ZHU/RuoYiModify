import request from '@/utils/request'

// 查询生成表数据
export function listTable(query) {
  return request({
    url: '/business/advertise/list',
    method: 'get',
    params: query
  })
}

//新增轮播图
export function addCarousel(data) {
  return request({
    url: '/business/advertise',
    method: 'post',
    data: data
  })
}


//编辑轮播图
export function editCarousel(data) {
  return request({
    url: '/business/advertise',
    method: 'put',
    data: data
  })
}

//更新状态
export function updateStatus(id) {
  return request({
    url: '/business/advertise/updateStatus/'+ id,
    method: 'put'
  })
}

//删除轮播图
export function delCarousel(id) {
  return request({
    url: '/business/advertise/' + id,
    method: 'delete'
  })
}
