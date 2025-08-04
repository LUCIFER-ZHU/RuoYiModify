// 获取国家名称
export function getCountryNameUtil(countryId, countryList) {
  if (!countryId || !countryList) {
    return '';
  }
  const country = countryList.find(item => item.id === countryId);
  return country ? country.chineseName : '';
}

// 获取地区名称
export function getRegionNameUtil(regionCode, cnRegions) {
  if (!regionCode || !cnRegions) {
    return '';
  }
  // 遍历第一层（省/直辖市）
  for (const province of cnRegions) {
    // 检查是否有子级（第二层）
    if (province.children && Array.isArray(province.children)) {
      // 遍历第二层（市/区）
      for (const city of province.children) {
        if (city.regionCode === regionCode) {
          // 找到匹配的regionCode，返回"省-市"格式
          return `${province.label}-${city.label}`;
        }
      }
    }
  }
  return '';
} 

/**
 * 获取币种符号
 * @param {string|number} currencyType - 币种类型
 * @returns {string} 币种符号
 */
export function getCurrencySymbol(currencyType) {
  // 使用更严格的判断，允许 currencyType 为 0
  if (currencyType === null || currencyType === undefined || currencyType === '') return '';
  
  const currencyMap = {
    0: '¥', // 人民币
    1: '$', // 美元
    2: '£', // 英镑
    3: '€', // 欧元
  };

  return currencyMap[currencyType] || '';
}