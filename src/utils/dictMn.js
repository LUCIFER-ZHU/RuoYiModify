import { ref, toRefs } from 'vue'
import { getDict } from '@/api/Website/dictManage'
import useDictManageStore from '@/store/modules/dictManage'

/**
 * 获取字典数据（新版字典管理）
 * 支持普通字典和特殊字典（country, cnRegions）
 */
export function useDictMn(...args) {
  const res = ref({});
  const dictStore = useDictManageStore();
  
  // 初始化所有字典类型
  args.forEach((dictType) => {
    res.value[dictType] = [];
    
    // 检查是否为特殊字典
    if (dictType === 'country' || dictType === 'cnRegions') {
      handleSpecialDict(dictType, res, dictStore);
    } else {
      handleNormalDict(dictType, res, dictStore);
    }
  });
  
  return toRefs(res.value);
}

/**
 * 处理特殊字典（country, cnRegions）
 */
function handleSpecialDict(dictType, res, dictStore) {
  const cachedDict = dictStore.getDict(dictType);
  
  if (cachedDict) {
    res.value[dictType] = cachedDict;
  } else {
    // 根据字典类型调用对应的加载方法
    let loadMethod;
    switch (dictType) {
      case 'country':
        loadMethod = dictStore.loadCountryDict;
        break;
      case 'cnRegions':
        loadMethod = dictStore.loadCNRegionsDict;
        break;
    }
    
    if (loadMethod) {
      loadMethod().then(data => {
        if (data) {
          res.value[dictType] = data;
        }
      }).catch(error => {
        console.error(`加载特殊字典 ${dictType} 失败:`, error);
      });
    }
  }
}

/**
 * 处理普通字典
 */
function handleNormalDict(dictType, res, dictStore) {
  const cachedDict = dictStore.getDict(dictType);
  
  if (cachedDict) {
    res.value[dictType] = cachedDict;
  } else {
    // 发起请求获取字典数据
    getDict(dictType).then(resp => {
      if (resp.code === 200 && resp.data) {
        // 转换数据格式，使其与原有useDict保持一致
        const formattedData = formatDictData(resp.data);
        res.value[dictType] = formattedData;
        dictStore.setDict(dictType, formattedData);
      }
    }).catch(error => {
      console.error(`获取字典 ${dictType} 失败:`, error);
    });
  }
}

/**
 * 格式化字典数据
 * 将API返回的数据转换为统一格式
 */
function formatDictData(data) {
  if (!Array.isArray(data)) {
    return [];
  }
  
  return data.map(item => {
    // 将name字段映射到label，value字段保持不变
    return {
      label: item?.name,
      value: item?.code,
      elTagType: item.listClass || '',
      elTagClass: item.cssClass || ''
    };
  });
}

/**
 * 清除字典缓存
 * @param {string} dictType 字典类型，不传则清除所有
 */
export function clearDictMnCache(dictType) {
  const dictStore = useDictManageStore();
  
  if (dictType) {
    dictStore.removeDict(dictType);
  } else {
    dictStore.cleanDict();
  }
}

/**
 * 重新加载字典
 * @param {string} dictType 字典类型
 */
export function reloadDictMn(dictType) {
  const dictStore = useDictManageStore();
  
  // 先清除缓存
  dictStore.removeDict(dictType);
  
  // 重新获取
  return useDictMn(dictType);
}

// 默认导出
export default {
  useDictMn,
  clearDictMnCache,
  reloadDictMn
}