import request from '@/utils/request'

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