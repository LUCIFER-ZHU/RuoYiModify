import request from '@/utils/request';

/**
 * 保存电子签名
 * @param {Object} data - 请求数据
 * @param {string} data.url - 签名的base64数据
 * @returns {Promise} 返回保存结果
 */
export function saveSignature(data) {
  return request({
    url: '/business/signature/add',
    method: 'post',
    data: data
  });
}

/**
 * 获取电子签名详情
 * @returns {Promise} 返回签名详情数据
 */
export function getSignatureDetail() {
  return request({
    url: '/business/signature/detail',
    method: 'get'
  });
}
