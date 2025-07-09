import request from '@/utils/request'
import { USE_MOCK, dictMockApi } from './mock/dictManage-mock'

// 获取交易货币列表字典
export function getCurrencyDict(){
  return request({
    url: "/dict/dictCurrency/list",
    method: "get",
  })
}

// 获取国家列表字典
export function getCountryDict(){
  return request({
    url: "/dict/dictCountry/list",
    method: "get",
  });
}

// 获取地区列表字典
export function getCNRegionsDict(){
  return request({
    url: "/dict/dictCNRegions/getInfos",
    method: "get",
  });
}


// 查询字典详细
export function getDict(val) {
  return request({
    url: '/dict/dictGeneral/detail/' + val,
    method: 'get',
  })
}


// 获取字典树形数据
export function getDictTree(query) {
  if (USE_MOCK) {
    return dictMockApi.getDictTree();
  }
  return request({
    url: '/dict/dictGeneral/tree',
    method: 'get',
    params: query
  })
}

// 新增字典或字典项
export function addDict(data) {
  if (USE_MOCK) {
    return dictMockApi.addDict(data);
  }
  return request({
    url: '/dict/dictGeneral',
    method: 'post',
    data: data
  })
}

// 修改字典或字典项
export function updateDict(data) {
  if (USE_MOCK) {
    return dictMockApi.updateDict(data);
  }
  return request({
    url: '/dict/dictGeneral',
    method: 'put',
    data: data
  })
}

// 删除字典或字典项
export function delDict(dictId) {
  if (USE_MOCK) {
    return dictMockApi.delDict(dictId);
  }
  return request({
    url: '/dict/dictGeneral/' + dictId,
    method: 'delete'
  })
}
