// 仓库模块 Mock 数据
// 模拟后端数据，用于前端开发测试

// 模拟仓库数据
const mockWarehouses = [
  {
    id: 1,
    warehouseName: '北京总仓',
    warehouseCode: 'BJ001',
    warehouseType: '1', // 1-总仓 2-分仓 3-门店仓
    contactPerson: '张三',
    contactPhone: '13800138001',
    contactEmail: 'zhangsan@example.com',
    address: '北京市朝阳区建国路88号',
    province: '北京市',
    city: '北京市',
    district: '朝阳区',
    area: 5000.50,
    description: '北京地区主要仓储中心，负责华北地区商品配送',
    status: '1', // 1-启用 0-禁用
    isDeleted: '0', // 0-未删除 1-已删除
    checkStatus: '2', // 0-待审核 1-审核中 2-已审核 3-审核拒绝
    createBy: 'admin',
    createTime: '2024-01-15 10:30:00',
    updateBy: 'admin',
    updateTime: '2024-01-15 10:30:00',
    remark: '重要仓库'
  },
  {
    id: 2,
    warehouseName: '上海分仓',
    warehouseCode: 'SH002',
    warehouseType: '2',
    contactPerson: '李四',
    contactPhone: '13800138002',
    contactEmail: 'lisi@example.com',
    address: '上海市浦东新区张江高科技园区',
    province: '上海市',
    city: '上海市',
    district: '浦东新区',
    area: 3000.00,
    description: '上海地区分仓，服务长三角地区',
    status: '1',
    isDeleted: '0',
    checkStatus: '2',
    createBy: 'admin',
    createTime: '2024-01-16 14:20:00',
    updateBy: 'admin',
    updateTime: '2024-01-16 14:20:00',
    remark: ''
  },
  {
    id: 3,
    warehouseName: '广州门店仓',
    warehouseCode: 'GZ003',
    warehouseType: '3',
    contactPerson: '王五',
    contactPhone: '13800138003',
    contactEmail: 'wangwu@example.com',
    address: '广州市天河区珠江新城',
    province: '广东省',
    city: '广州市',
    district: '天河区',
    area: 800.00,
    description: '广州门店配套仓库',
    status: '1',
    isDeleted: '0',
    checkStatus: '1',
    createBy: 'admin',
    createTime: '2024-01-17 09:15:00',
    updateBy: 'admin',
    updateTime: '2024-01-17 09:15:00',
    remark: '待审核'
  },
  {
    id: 4,
    warehouseName: '深圳临时仓',
    warehouseCode: 'SZ004',
    warehouseType: '2',
    contactPerson: '赵六',
    contactPhone: '13800138004',
    contactEmail: 'zhaoliu@example.com',
    address: '深圳市南山区科技园',
    province: '广东省',
    city: '深圳市',
    district: '南山区',
    area: 1200.00,
    description: '临时租赁仓库，用于季节性商品存储',
    status: '0',
    isDeleted: '0',
    checkStatus: '0',
    createBy: 'admin',
    createTime: '2024-01-18 16:45:00',
    updateBy: 'admin',
    updateTime: '2024-01-18 16:45:00',
    remark: '临时仓库'
  },
  {
    id: 5,
    warehouseName: '成都西南仓',
    warehouseCode: 'CD005',
    warehouseType: '1',
    contactPerson: '孙七',
    contactPhone: '13800138005',
    contactEmail: 'sunqi@example.com',
    address: '成都市高新区天府大道',
    province: '四川省',
    city: '成都市',
    district: '高新区',
    area: 4500.00,
    description: '西南地区总仓，覆盖四川、重庆、云南等地',
    status: '1',
    isDeleted: '0',
    checkStatus: '2',
    createBy: 'admin',
    createTime: '2024-01-19 11:30:00',
    updateBy: 'admin',
    updateTime: '2024-01-19 11:30:00',
    remark: '重点仓库'
  }
];

// 模拟延迟函数
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// 生成随机ID
let nextId = 6;
const generateId = () => nextId++;

// Mock API 函数
export const mockWarehouseApi = {
  // 查询仓库列表
  async getList(params = {}) {
    await delay();
    
    let filteredData = [...mockWarehouses];
    
    // 模拟搜索过滤
    if (params.warehouseName) {
      filteredData = filteredData.filter(item => 
        item.warehouseName.includes(params.warehouseName)
      );
    }
    
    if (params.warehouseCode) {
      filteredData = filteredData.filter(item => 
        item.warehouseCode.includes(params.warehouseCode)
      );
    }
    
    if (params.warehouseType) {
      filteredData = filteredData.filter(item => 
        item.warehouseType === params.warehouseType
      );
    }
    
    if (params.status) {
      filteredData = filteredData.filter(item => 
        item.status === params.status
      );
    }
    
    if (params.checkStatus) {
      filteredData = filteredData.filter(item => 
        item.checkStatus === params.checkStatus
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
      data: {records:paginatedData, total: filteredData.length},
    };
  },
  
  // 查询仓库详细
  async getWarehouse(id) {
    await delay();
    
    const warehouse = mockWarehouses.find(item => item.id == id);
    if (warehouse) {
      return {
        code: 200,
        msg: '查询成功',
        data: warehouse
      };
    } else {
      return {
        code: 500,
        msg: '仓库不存在'
      };
    }
  },
  
  // 新增仓库
  async addWarehouse(data) {
    await delay();
    
    // 检查仓库编码是否重复
    const existingCode = mockWarehouses.find(item => 
      item.warehouseCode === data.warehouseCode
    );
    
    if (existingCode) {
      return {
        code: 500,
        msg: '仓库编码已存在'
      };
    }
    
    const newWarehouse = {
      ...data,
      id: generateId(),
      status: data.status || '1',
      isDeleted: '0',
      checkStatus: '0', // 新增默认待审核
      createBy: 'admin',
      createTime: new Date().toLocaleString('zh-CN'),
      updateBy: 'admin',
      updateTime: new Date().toLocaleString('zh-CN')
    };
    
    mockWarehouses.push(newWarehouse);
    
    return {
      code: 200,
      msg: '新增成功'
    };
  },
  
  // 修改仓库
  async updateWarehouse(data) {
    await delay();
    
    const index = mockWarehouses.findIndex(item => item.id == data.id);
    if (index === -1) {
      return {
        code: 500,
        msg: '仓库不存在'
      };
    }
    
    // 检查仓库编码是否重复（排除自己）
    const existingCode = mockWarehouses.find(item => 
      item.warehouseCode === data.warehouseCode && item.id != data.id
    );
    
    if (existingCode) {
      return {
        code: 500,
        msg: '仓库编码已存在'
      };
    }
    
    mockWarehouses[index] = {
      ...mockWarehouses[index],
      ...data,
      updateBy: 'admin',
      updateTime: new Date().toLocaleString('zh-CN')
    };
    
    return {
      code: 200,
      msg: '修改成功'
    };
  },
  
  // 删除仓库
  async delWarehouse(id) {
    await delay();
    
    const index = mockWarehouses.findIndex(item => item.id == id);
    if (index === -1) {
      return {
        code: 500,
        msg: '仓库不存在'
      };
    }
    
    // 软删除
    mockWarehouses[index].isDeleted = '1';
    mockWarehouses[index].updateBy = 'admin';
    mockWarehouses[index].updateTime = new Date().toLocaleString('zh-CN');
    
    return {
      code: 200,
      msg: '删除成功'
    };
  },
};

// 导出默认的 mock 开关
export const USE_MOCK = false; // 设置为 false 时使用真实接口