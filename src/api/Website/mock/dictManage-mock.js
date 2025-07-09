// 模拟后端数据，用于前端开发测试

// 模拟延迟
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟字典数据 - 使用let声明以便修改
let dictList = [
  {
    id: 1,
    name: '用户性别',
    parentId: 0,
    level: 0,
    isLeaf: 0,
    status: 1,
    description: '用户性别列表',
    value: 'sys_user_sex',
    createBy: 'admin',
    createTime: '2023-01-01 10:00:00',
    updateBy: 'admin',
    updateTime: '2023-01-01 10:00:00',
    children: [
      {
        id: 101,
        name: '男',
        parentId: 1,
        level: 1,
        isLeaf: 1,
        status: 1,
        description: '性别男',
        value: '1',
        createBy: 'admin',
        createTime: '2023-01-01 10:01:00',
        updateBy: 'admin',
        updateTime: '2023-01-01 10:01:00'
      },
      {
        id: 102,
        name: '女',
        parentId: 1,
        level: 1,
        isLeaf: 1,
        status: 1,
        description: '性别女',
        value: '0',
        createBy: 'admin',
        createTime: '2023-01-01 10:02:00',
        updateBy: 'admin',
        updateTime: '2023-01-01 10:02:00'
      }
    ]
  },
  {
    id: 2,
    name: '菜单状态',
    parentId: 0,
    level: 0,
    isLeaf: 0,
    status: 1,
    description: '菜单状态列表',
    value: 'sys_show_hide',
    createBy: 'admin',
    createTime: '2023-01-01 11:00:00',
    updateBy: 'admin',
    updateTime: '2023-01-01 11:00:00',
    children: [
      {
        id: 201,
        name: '显示',
        parentId: 2,
        level: 1,
        isLeaf: 1,
        status: 1,
        description: '显示菜单',
        value: '1',
        createBy: 'admin',
        createTime: '2023-01-01 11:01:00',
        updateBy: 'admin',
        updateTime: '2023-01-01 11:01:00'
      },
      {
        id: 202,
        name: '隐藏',
        parentId: 2,
        level: 1,
        isLeaf: 1,
        status: 0,
        description: '隐藏菜单',
        value: '0',
        createBy: 'admin',
        createTime: '2023-01-01 11:02:00',
        updateBy: 'admin',
        updateTime: '2023-01-01 11:02:00'
      }
    ]
  }
];

// 导出默认的 mock 开关
export const USE_MOCK = false; // 设置为 true 时使用 Mock 数据，false 时使用真实接口

// 获取响应数据格式
function getResponseData(data, message = '操作成功') {
  return {
    success: true,
    code: 0,
    message: message,
    traceId: '',
    data: data
  };
}

// 根据ID查找字典
function findDictById(id) {
  return dictList.find(dict => dict.id == id);
}



export const dictMockApi = {
  // 获取字典树形数据
  async getDictTree() {
    await delay();
    return getResponseData(dictList);
  },

  // 获取字典详情
  async getDict(id) {
    await delay();
    const dict = findDictById(parseInt(id));
    if (dict) {
      return getResponseData(dict);
    } else {
      return {
        code: 404,
        msg: '字典不存在',
        data: null
      };
    }
  },

  // 新增字典或字典项
  async addDict(data) {
    await delay();
    const newId = Math.max(...dictList.map(d => Math.max(d.id, ...d.children.map(c => c.id)))) + 1;
    const currentTime = new Date().toLocaleString('zh-CN');
    
    if (data.parentId && data.parentId > 0) {
      // 新增字典项
      const parentDict = dictList.find(d => d.id === data.parentId);
      if (parentDict) {
        const newItem = {
          id: newId,
          ...data,
          level: 1,
          isLeaf: 1,
          createBy: 'admin',
          createTime: currentTime,
          updateBy: 'admin',
          updateTime: currentTime
        };
        parentDict.children.push(newItem);
        return getResponseData(newId, '新增字典项成功');
      }
    } else {
      // 新增字典
      const newDict = {
        id: newId,
        ...data,
        parentId: 0,
        level: 0,
        isLeaf: 0,
        createBy: 'admin',
        createTime: currentTime,
        updateBy: 'admin',
        updateTime: currentTime,
        children: []
      };
      dictList.push(newDict);
      return getResponseData(newId, '新增字典成功');
    }
    return getResponseData(null, '新增失败');
  },

  // 修改字典或字典项
  async updateDict(data) {
    await delay();
    const dict = findDictById(data.id);
    if (dict) {
      Object.assign(dict, {
        ...data,
        updateBy: 'admin',
        updateTime: new Date().toLocaleString('zh-CN')
      });
      return getResponseData(data.id, '修改成功');
    }
    return getResponseData(null, '记录不存在');
  },

  // 删除字典或字典项
  async delDict(dictId) {
    await delay();
    // 先查找是否为字典
    const dictIndex = dictList.findIndex(d => d.id === dictId);
    if (dictIndex > -1) {
      dictList.splice(dictIndex, 1);
      return getResponseData(dictId, '删除字典成功');
    }
    
    // 查找是否为字典项
    for (let dict of dictList) {
      const itemIndex = dict.children.findIndex(item => item.id === dictId);
      if (itemIndex > -1) {
        dict.children.splice(itemIndex, 1);
        return getResponseData(dictId, '删除字典项成功');
      }
    }
    
    return getResponseData(null, '记录不存在');
  },


};