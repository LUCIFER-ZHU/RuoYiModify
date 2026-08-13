import request from '@/utils/request'

// 获取公司信息
export function getCompanyInfo() {
    return request({
      url: '/business/company/getCompanyInfo',
      method: 'get'
    })
  }
  
  // 更新公司信息
  export function updateCompanyInfo(data) {
    return request({
      url: '/business/company',
      method: 'put',
      data: data
    })
  }