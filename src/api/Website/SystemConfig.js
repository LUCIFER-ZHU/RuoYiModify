import request from '@/utils/request'

/** 查询配置列表 */
export function listTable(query) {
  return request({
    url: '/business/systemConfig/list',
    method: 'get',
    params: query
  })
}

/** 查询配置详情 */
export function getConfigDetail(id) {
    return request({
      url: `/business/systemConfig/${id}`,
      method: "get",
    });
  }
  
  /** 新增配置 */
  export function addConfig(data) {
    return request({
      url: "/business/systemConfig",
      method: "post",
      data,
    });
  }
  
  /** 更新配置 */
  export function updateConfig(data) {
    return request({
      url: "/business/systemConfig",
      method: "put",
      data,
    });
  }

  /** 删除配置 */
  export function delSystemConfig(id) {
    return request({
      url: '/business/systemConfig/' + id,
      method: 'delete'
    })
  }