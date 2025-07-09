import { defineStore } from 'pinia'
import { getDict, getCountryDict, getCNRegionsDict } from '@/api/Website/dictManage'

const useDictManageStore = defineStore(
  'dictManage',
  {
    state: () => ({
      dict: new Array(),
      // 特殊字典缓存
      specialDicts: {
        country: null,
        cnRegions: null
      },
      // 加载状态
    loading: {
      country: false,
      cnRegions: false
    }
    }),
    actions: {
      // 获取字典
      getDict(_key) {
        if (_key == null && _key == "") {
          return null;
        }
        
        // 检查是否为特殊字典
        if (this.specialDicts[_key]) {
          return this.specialDicts[_key];
        }
        
        try {
          for (let i = 0; i < this.dict.length; i++) {
            if (this.dict[i].key == _key) {
              return this.dict[i].value;
            }
          }
        } catch (e) {
          return null;
        }
      },
      
      // 设置字典
      setDict(_key, value) {
        if (_key !== null && _key !== "") {
          // 检查是否为特殊字典
          if (_key === 'country' || _key === 'cnRegions') {
            this.specialDicts[_key] = value;
          } else {
            // 检查是否已存在，如果存在则更新
            const existingIndex = this.dict.findIndex(item => item.key === _key);
            if (existingIndex !== -1) {
              this.dict[existingIndex].value = value;
            } else {
              this.dict.push({
                key: _key,
                value: value
              });
            }
          }
        }
      },
      
      // 删除字典
      removeDict(_key) {
        var bln = false;
        
        // 检查是否为特殊字典
        if (_key === 'country' || _key === 'cnRegions') {
          this.specialDicts[_key] = null;
          return true;
        }
        
        try {
          for (let i = 0; i < this.dict.length; i++) {
            if (this.dict[i].key == _key) {
              this.dict.splice(i, 1);
              return true;
            }
          }
        } catch (e) {
          bln = false;
        }
        return bln;
      },
      
      // 清空字典
      cleanDict() {
        this.dict = new Array();
        this.specialDicts = {
          country: null,
          cnRegions: null
        };
      },
      
      // 加载特殊字典 - 国家
      async loadCountryDict() {
        if (this.specialDicts.country) {
          return this.specialDicts.country;
        }
        
        if (this.loading.country) {
          return null;
        }
        
        this.loading.country = true;
        try {
          const response = await getCountryDict();
          if (response.code === 200) {
            this.specialDicts.country = response.data;
            return response.data;
          }
        } catch (error) {
          console.error('加载国家字典失败:', error);
        } finally {
          this.loading.country = false;
        }
        return null;
      },
      
      // 加载特殊字典 - 中国地区
      async loadCNRegionsDict() {
        if (this.specialDicts.cnRegions) {
          return this.specialDicts.cnRegions;
        }
        
        if (this.loading.cnRegions) {
          return null;
        }
        
        this.loading.cnRegions = true;
        try {
          const response = await getCNRegionsDict();
          if (response.code === 200) {
            // 转换为级联选择器格式
            const formattedData = response.data.map(item => {
              const children = item.children.map(it => {
                return { ...it, label: it.regionName, value: it.regionName, children: [] };
              });
              return { ...item, label: item.regionName, value: item.regionName, children: children };
            });
            this.specialDicts.cnRegions = formattedData;
            return formattedData;
          }
        } catch (error) {
          console.error('加载地区字典失败:', error);
        } finally {
          this.loading.cnRegions = false;
        }
        return null;
      },
      
      // 初始字典
      initDict() {
        // 可以在这里预加载一些常用字典
      }
    }
  })

export default useDictManageStore