// 模拟后端数据，用于前端开发测试

// 模拟客户数据
const mockCustomers = [
  {
    id: 1,
    companyName: '北京科技有限公司',
    contactPerson: '张三',
    gender: '1', // 1-男 2-女
    customerSource: '1', // 1-网络推广 2-朋友介绍 3-展会 4-其他
    email: 'zhangsan@example.com',
    phone: '13800138001',
    customerType: '1', // 1-企业客户 2-个人客户
    customerGroup: '1', // 1-VIP客户 2-普通客户 3-潜在客户
    purchaseCycle: '1', // 1-月度 2-季度 3-半年 4-年度
    tradeType: '1', // 1-内贸 2-外贸
    customerStatus: '1', // 1-正常 2-暂停 3-黑名单
    address: '北京市朝阳区建国路88号',
    remark: '重要客户',
    isDeleted: '0', // 0-未删除 1-已删除
    createBy: 'admin',
    createTime: '2024-01-15 10:30:00',
    updateBy: 'admin',
    updateTime: '2024-01-15 10:30:00'
  },
  {
    id: 2,
    companyName: '上海贸易公司',
    contactPerson: '李四',
    gender: '2',
    customerSource: '2',
    email: 'lisi@example.com',
    phone: '13800138002',
    customerType: '1',
    customerGroup: '2',
    purchaseCycle: '2',
    tradeType: '2',
    customerStatus: '1',
    address: '上海市浦东新区张江高科技园区',
    remark: '',
    isDeleted: '0',
    createBy: 'admin',
    createTime: '2024-01-16 14:20:00',
    updateBy: 'admin',
    updateTime: '2024-01-16 14:20:00'
  },
  {
    id: 3,
    companyName: '广州制造企业',
    contactPerson: '王五',
    gender: '1',
    customerSource: '3',
    email: 'wangwu@example.com',
    phone: '13800138003',
    customerType: '1',
    customerGroup: '1',
    purchaseCycle: '3',
    tradeType: '1',
    customerStatus: '2',
    address: '广州市天河区珠江新城',
    remark: '暂停合作',
    isDeleted: '0',
    createBy: 'admin',
    createTime: '2024-01-17 09:15:00',
    updateBy: 'admin',
    updateTime: '2024-01-17 09:15:00'
  },
  {
    id: 4,
    companyName: '深圳电子科技',
    contactPerson: '赵六',
    gender: '1',
    customerSource: '4',
    email: 'zhaoliu@example.com',
    phone: '13800138004',
    customerType: '2',
    customerGroup: '3',
    purchaseCycle: '4',
    tradeType: '1',
    customerStatus: '1',
    address: '深圳市南山区科技园',
    remark: '潜在大客户',
    isDeleted: '0',
    createBy: 'admin',
    createTime: '2024-01-18 16:45:00',
    updateBy: 'admin',
    updateTime: '2024-01-18 16:45:00'
  },
  {
    id: 5,
    companyName: '成都软件开发',
    contactPerson: '孙七',
    gender: '2',
    customerSource: '1',
    email: 'sunqi@example.com',
    phone: '13800138005',
    customerType: '1',
    customerGroup: '2',
    purchaseCycle: '2',
    tradeType: '1',
    customerStatus: '3',
    address: '成都市高新区天府大道',
    remark: '已列入黑名单',
    isDeleted: '0',
    createBy: 'admin',
    createTime: '2024-01-19 11:30:00',
    updateBy: 'admin',
    updateTime: '2024-01-19 11:30:00'
  }
]

// 生成响应数据的通用函数
function getResponseData(data, message = '操作成功') {
  return {
    success: true,
    code: 200,
    message: message,
    traceId: Mock.Random.guid(),
    data: data
  }
}

// 模拟延迟函数
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// 生成随机ID
let nextId = 6;
const generateId = () => nextId++;

// Mock API 函数
export const mockCustomerApi = {
  // 查询客户列表
  async getList(params = {}) {
    await delay();
    
    let filteredData = [...mockCustomers];
    
    // 模拟搜索过滤
    if (params.companyName) {
      filteredData = filteredData.filter(item => 
        item.companyName.includes(params.companyName)
      );
    }
    
    if (params.contactPerson) {
      filteredData = filteredData.filter(item => 
        item.contactPerson.includes(params.contactPerson)
      );
    }
    
    if (params.customerSource) {
      filteredData = filteredData.filter(item => 
        item.customerSource === params.customerSource
      );
    }
    
    if (params.customerGroup) {
      filteredData = filteredData.filter(item => 
        item.customerGroup === params.customerGroup
      );
    }
    
    if (params.customerStatus) {
      filteredData = filteredData.filter(item => 
        item.customerStatus === params.customerStatus
      );
    }
    
    if (params.customerType) {
      filteredData = filteredData.filter(item => 
        item.customerType === params.customerType
      );
    }
    
    // 模拟分页
    const pageNum = parseInt(params.pageNum) || 1;
    const pageSize = parseInt(params.pageSize) || 10;
    const startIndex = (pageNum - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = filteredData.slice(startIndex, endIndex);
    
    return {
      code: 200,
      msg: '查询成功',
      data: {records: paginatedData, total: filteredData.length},
    };
  },
  
  // 查询客户详细
  async getCustomer(id) {
    await delay();
    
    const customer = mockCustomers.find(item => item.id == id);
    if (customer) {
      return {
        code: 200,
        msg: '查询成功',
        data: customer
      };
    } else {
      return {
        code: 500,
        msg: '客户不存在'
      };
    }
  },
  
  // 新增客户
  async addCustomer(data) {
    await delay();
    
    // 检查公司名称是否重复
    const existingCompany = mockCustomers.find(item => 
      item.companyName === data.companyName
    );
    
    if (existingCompany) {
      return {
        code: 500,
        msg: '公司名称已存在'
      };
    }
    
    const newCustomer = {
      ...data,
      id: generateId(),
      customerStatus: data.customerStatus || '1',
      isDeleted: '0',
      createBy: 'admin',
      createTime: new Date().toLocaleString('zh-CN'),
      updateBy: 'admin',
      updateTime: new Date().toLocaleString('zh-CN')
    };
    
    mockCustomers.push(newCustomer);
    
    return {
      code: 200,
      msg: '新增成功'
    };
  },
  
  // 修改客户
  async updateCustomer(data) {
    await delay();
    
    const index = mockCustomers.findIndex(item => item.id == data.id);
    if (index === -1) {
      return {
        code: 500,
        msg: '客户不存在'
      };
    }
    
    // 检查公司名称是否重复（排除自己）
    const existingCompany = mockCustomers.find(item => 
      item.companyName === data.companyName && item.id != data.id
    );
    
    if (existingCompany) {
      return {
        code: 500,
        msg: '公司名称已存在'
      };
    }
    
    mockCustomers[index] = {
      ...mockCustomers[index],
      ...data,
      updateBy: 'admin',
      updateTime: new Date().toLocaleString('zh-CN')
    };
    
    return {
      code: 200,
      msg: '修改成功'
    };
  },
  
  // 删除客户
  async delCustomer(id) {
    await delay();
    
    const index = mockCustomers.findIndex(item => item.id == id);
    if (index === -1) {
      return {
        code: 500,
        msg: '客户不存在'
      };
    }
    
    // 软删除
    mockCustomers[index].isDeleted = '1';
    mockCustomers[index].updateBy = 'admin';
    mockCustomers[index].updateTime = new Date().toLocaleString('zh-CN');
    
    return {
      code: 200,
      msg: '删除成功'
    };
  },
};

// 导出默认的 mock 开关
export const USE_MOCK = false; // 设置为 false 时使用真实接口