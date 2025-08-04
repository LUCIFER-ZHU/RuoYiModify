<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <el-card class="box-card">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="100px"
        @submit.prevent>
        <el-form-item label="跟进人部门" prop="deptId">
          <el-select v-model="queryParams.deptId" clearable style="width: 180px" placeholder="请选择部门" @change="handleDeptChange">
            <el-option v-for="item in deptList" :key="item.deptId" :label="item.deptName" :value="item.deptId" />
          </el-select>
        </el-form-item>
        <el-form-item label="跟进人" prop="userId">
          <el-select v-model="queryParams.userId" clearable style="width: 180px" placeholder="请选择人员" :disabled="userSelectDisabled">
            <el-option v-for="item in userList" :key="item.userId" :label="item.nickName" :value="item.userId" />
          </el-select>
        </el-form-item>           
        <el-form-item label="收款账户" prop="accountCode">
          <el-input v-model="queryParams.accountCode" placeholder="请输入收款账户" @keyup.enter="handleQuery" style="width: 180px" />
        </el-form-item>
        <el-form-item label="收款类型" prop="benType">
          <el-select v-model="queryParams.benType" clearable style="width: 180px" placeholder="请选择收款类型">
            <el-option v-for="dict in contractDicts?.benType || []" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="合同号" prop="contractId">
          <el-input v-model="queryParams.contractId" placeholder="请输入合同号" @keyup.enter="handleQuery" style="width: 180px" />
        </el-form-item>
        <el-form-item label="合同状态" prop="contractState">
          <el-select v-model="queryParams.contractState" clearable style="width: 180px">
            <el-option v-for="dict in contractDicts?.contractState || []" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="合同标题" prop="contractTitle">
          <el-input v-model="queryParams.contractTitle" placeholder="请输入合同标题" @keyup.enter="handleQuery" style="width: 180px" />
        </el-form-item>
        <el-form-item label="客户公司" prop="customerCompany">
          <el-input v-model="queryParams.customerCompany" placeholder="请输入客户公司" @keyup.enter="handleQuery" style="width: 180px" />
        </el-form-item>
        <el-form-item label="客户姓名" prop="customerName">
          <el-input v-model="queryParams.customerName" placeholder="请输入客户姓名" @keyup.enter="handleQuery" style="width: 180px" />
        </el-form-item>     
        <el-form-item label="收款状态" prop="paymentState">
          <el-select v-model="queryParams.paymentState" clearable style="width: 180px" placeholder="请选择收款状态">
            <el-option v-for="dict in contractDicts?.paymentState || []" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="贸易方式" prop="tradingWay">
          <el-select v-model="queryParams.tradingWay" clearable style="width: 180px" placeholder="请选择贸易方式">
            <el-option v-for="dict in contractDicts?.tradingWay || []" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      
      <el-row :gutter="10">
        <el-col :span="1.5">
          <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="warning" plain icon="Download" :disabled="multiple" @click="handleExport">导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>
    </el-card>

    <!-- 表格数据 -->
    <el-card class="box-card">
      <el-table v-loading="loading" :data="contractList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="合同号" align="center" prop="contractId" width="150" fixed="left" />
        <el-table-column label="合同标题" align="center" prop="contractTitle" width="150" fixed="left"  />
        <el-table-column label="合同状态" align="center" prop="contractState" width="150">
          <template #default="scope">
            <DictTagMn :options="contractDicts.contractState" :value="scope.row.contractState" />
          </template>
        </el-table-column>
        <el-table-column label="询盘来源" align="center" prop="customerSource" width="150">
          <template #default="scope">
            <DictTagMn :options="contractDicts.customerSource" :value="scope.row.customerSource" />
          </template>
        </el-table-column>
        <el-table-column label="组别" align="center" prop="deptName" width="100" />
        <el-table-column label="跟进人" align="center" prop="userName" width="100" />    
        <el-table-column label="客户公司" align="center" prop="customerCompany" width="150" />
        <el-table-column label="客户姓名" align="center" prop="customerName" width="120" />
        <el-table-column label="客户国家" align="center" prop="country" width="120">
          <template #default="scope">
            {{ getCountryName(scope.row.country) }}
          </template>
        </el-table-column>                  
        <el-table-column label="商品" align="center" prop="productInfo" width="150" >
          <template #default="scope">
            <div v-html="scope.row.productInfo"></div>
          </template>          
        </el-table-column>
        <el-table-column label="商品价格" align="center" prop="priceInfo" width="120" >
          <template #default="scope">
            <div v-html="scope.row.priceInfo"></div>
          </template>          
        </el-table-column>
        <el-table-column label="商品数量" align="center" prop="quantityInfo" width="120" >
          <template #default="scope">
            <div v-html="scope.row.quantityInfo"></div>
          </template>          
        </el-table-column>
        <el-table-column label="运输方式" align="center" prop="shipWay">
          <template #default="scope">
            <DictTagMn :options="contractDicts.shipWay" :value="scope.row.shipWay" />
          </template>
        </el-table-column>
        <el-table-column label="贸易方式" align="center" prop="tradingWay">
          <template #default="scope">
            <DictTagMn :options="contractDicts.tradingWay" :value="scope.row.tradingWay" />
          </template>
        </el-table-column>
        <el-table-column label="收款状态" align="center" prop="paymentState" width="150">
          <template #default="scope">
            <DictTagMn :options="contractDicts.paymentState" :value="scope.row.paymentState" />
          </template>
        </el-table-column>          
        <el-table-column label="币种" align="center" prop="currencyType">
          <template #default="scope">
            <DictTagMn :options="contractDicts.currencyType" :value="scope.row.currencyType" />
          </template>
        </el-table-column>        
        <el-table-column label="合同总金额" align="center" prop="totalInfo" width="120" />
        <el-table-column label="收款类型" align="center" prop="benType">
          <template #default="scope">
            <DictTagMn :options="contractDicts.benType" :value="scope.row.benType" />
          </template>
        </el-table-column>
        <el-table-column label="暂估毛利" align="center" prop="estimatedGrossProfit" width="120" />
        <el-table-column label="实际毛利" align="center" prop="actualGrossProfit" width="120" />
        <el-table-column label="收款账户" align="center" prop="accountCode" width="120" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="280">
          <template #default="scope">
            <el-button link type="primary" icon="View" @click="handlePreview(scope.row)">预览</el-button>            
            <el-button v-if="(scope.row.contractState === 0 || scope.row.contractState === 3) && scope.row.checkButton" link type="primary" icon="DocumentChecked" @click="handleCheck(scope.row)">提交审核</el-button>
            <el-button link type="primary" icon="Notebook" @click="handleCheckDetail(scope.row)">审核详情</el-button>
            <el-button v-if="scope.row.contractState === 2 && scope.row.payButton" link type="primary" icon="Money" @click="handleCollect(scope.row)">收款</el-button>
            <el-button link type="primary" icon="Reading" @click="handleCollectDetail(scope.row)">收款详情</el-button>
            <el-button link type="primary" icon="Tickets" @click="handleDetail(scope.row)">详情</el-button>
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)">修改</el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>

    <!-- 详情弹窗 -->
    <DetailDialog v-model="detailOpen" :data="detailData" :contract-dicts="contractDicts"
      :getCountryName="getCountryName" />

    <!-- 新增编辑弹窗 -->
    <FormDialog v-model:visible="formOpen" :edit-data="formData" :contract-dicts="contractDicts"
      @submit-success="handleSubmit" />

    <!-- 收款弹窗 -->
    <collectDialog v-model:visible="collectDialogVisible" :row="collectRow" :contract-dicts="contractDicts" @submit-success="handleCollectSuccess" />

    <!-- 收款详情弹窗 -->
    <CollectDetailDialog
      v-model:visible="collectDetailDialogVisible"
      :contract-id="currentContractId"
      :contract-dicts="contractDicts"
    />

    <!-- 审核详情弹窗 -->
    <CheckListDialog
      v-model:visible="checkListDialogVisible"
      :contract-id="currentCheckContractId"
    />
  </div>
</template>

<script setup name="Contract">
import { listContract, getContract, delContract, submitContract, createContractPdf, exportContracts } from "@/api/Website/contract";
import DetailDialog from "@/views/Website/components/contract/detailDialog.vue";
import FormDialog from "@/views/Website/components/contract/formDialog.vue";
import collectDialog from '@/views/Website/components/contract/collectDialog.vue';
import CollectDetailDialog from '@/views/Website/components/finance/collectDetailDialog.vue';
import CheckListDialog from '@/views/Website/components/contract/checkListDialog.vue';
import { useDictMn } from "@/utils/dictMn";
import { reactive, onMounted, watchEffect } from "vue";
const { proxy } = getCurrentInstance();
import { getCountryNameUtil } from '@/utils/displayHelpers';
import { getSysDeptList, getSysUserList } from '@/api/Website/system';
import { handlePreviewPdf } from '@/utils/previewPdf';

// 合同列表数据
const contractList = ref([]);
// 详情弹窗开关
const detailOpen = ref(false);
// 新增/编辑弹窗开关
const formOpen = ref(false);
// 加载状态
const loading = ref(true);
// 是否显示搜索表单
const showSearch = ref(true);
// 选中行id集合
const ids = ref([]);
// 是否只选中一行
const single = ref(true);
// 是否未选中任何行
const multiple = ref(true);
// 总条数
const total = ref(0);
// 详情弹窗数据
const detailData = ref({});
// 新增/编辑弹窗数据
const formData = ref({});

// 部门列表
const deptList = ref([]);
// 人员列表
const userList = ref([]);
// 禁用人员选择
const userSelectDisabled = ref(false);

// 收款弹窗开关
const collectDialogVisible = ref(false);
// 当前收款行数据
const collectRow = ref(null);

// 收款详情弹窗
const collectDetailDialogVisible = ref(false);
const currentContractId = ref('');

// 审核详情弹窗
const checkListDialogVisible = ref(false);
// 当前审核详情的合同ID
const currentCheckContractId = ref('');

// 字典数据
const dictData = useDictMn('country', 'customer_source', 'currency_type', 'contract_state', 'payment_state', 'ship_way', 'trading_way', 'ben_type');

// 合同相关字典
const contractDicts = ref({});
// 在组件挂载后初始化字典
onMounted(() => {
  console.log('contractDictData', dictData);
  // 监听字典数据变化并更新本地引用
  watchEffect(() => {
    // 字典数据
    contractDicts.value = {
      country: dictData.country.value,
      customerSource: dictData.customer_source.value,
      currencyType: dictData.currency_type.value,
      contractState: dictData.contract_state.value,
      paymentState: dictData.payment_state.value,
      shipWay: dictData.ship_way.value,
      tradingWay: dictData.trading_way.value,
      benType: dictData.ben_type.value,
    };
  });
  // 获取部门列表
  fetchDeptList();
});

// 查询参数
const data = reactive({
  queryParams: {
    pageNum: 1, // 当前页码
    pageSize: 10, // 每页条数
    // 收款账户
    accountCode: null,
    // 收款类型
    benType: null,
    // 合同号
    contractId: null,
    // 合同状态(0-草稿、1-审核中、2-成功完结、3-失败完结)
    contractState: null,
    // 合同标题
    contractTitle: null,
    // 客户公司
    customerCompany: null,
    // 客户姓名
    customerName: null,
    // 跟进人部门ID
    deptId: null,
    // 收款状态
    paymentState: null,
    // 贸易方式(0=>'EXW',1=>'FOB',2=>'CFR',3=>'CIF',4=>'DAP',5=>'DDP',6=>'FCA')
    tradingWay: null,
    // 跟进人ID
    userId: null,
  }
});

// 响应式解包
const { queryParams } = toRefs(data);

/**
 * 获取部门列表
 */
function fetchDeptList() {
  getSysDeptList().then(res => {
    if (res.code === 200 && res.data) {
      deptList.value = res.data;
      // 如果只有一个部门，自动选择并获取人员列表
      if (deptList.value.length === 1) {
        queryParams.value.deptId = deptList.value[0].deptId;
        fetchUserList(queryParams.value.deptId);
      }
      // 部门列表获取完成后，调用getList
      getList(true);
    }
  });
}

/**
 * 获取人员列表
 */
function fetchUserList(deptId) {
  if (!deptId) {
    userList.value = [];
    userSelectDisabled.value = false;
    return;
  }
  getSysUserList({ deptId }).then(res => {
    if (res.code === 200 && res.data) {
      userList.value = res.data;
      if (userList.value.length === 1) {
        queryParams.value.userId = userList.value[0].userId;
        userSelectDisabled.value = true;
      } else {
        queryParams.value.userId = null;
        userSelectDisabled.value = false;
      }
    }
  });
}

/**
 * 处理部门选择变化
 */
function handleDeptChange(deptId) {
  queryParams.value.userId = null;
  userSelectDisabled.value = false;
  if (deptId) {
    fetchUserList(deptId);
  } else {
    userList.value = [];
  }
}

/**
 * 查询合同列表
 * @param {boolean} isFirst 是否首次加载
 */
function getList(isFirst = false) {
  loading.value = true;
  // 根据部门数量决定是否传入deptId
  const params = { ...queryParams.value };
  if (deptList.value.length === 1) {
    // 只有一个部门时，传入deptId
    params.deptId = queryParams.value.deptId;
  } else {
    // 第一次传入的时候
    if (isFirst) {
      // 多个部门时，deptId传null
      params.deptId = null;
    }
  }
  listContract(params).then(response => {
    if (response.code === 200) {
      contractList.value = response.rows;
      total.value = response.total;
    }
    loading.value = false;
  });
}

/**
 * 搜索按钮操作
 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/**
 * 重置按钮操作
 */
function resetQuery() {
  proxy.resetForm("queryRef");
  // 重置部门和人员选择
  queryParams.value.deptId = null;
  queryParams.value.userId = null;
  userList.value = [];
  userSelectDisabled.value = false;
  // 如果只有一个部门，自动选择
  if (deptList.value.length === 1) {
    queryParams.value.deptId = deptList.value[0].deptId;
    fetchUserList(queryParams.value.deptId);
  }
  handleQuery();
}

/**
 * 多选框选中数据
 * @param {Array} selection - 选中的行数据
 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/**
 * 新增按钮操作
 */
function handleAdd() {
  formData.value = null;
  formOpen.value = true;
}

/**
 * 详情按钮操作
 */
function handleDetail(row) {
  const contractId = row.id;
  getContract(contractId).then(response => {
    if (response.code === 200) {
      detailData.value = response.data;
      detailOpen.value = true;
    }
  });
}

/**
 * 修改按钮操作
 */
function handleUpdate(row) {
  const id = row.id;
  getContract(id).then(response => {
    if (response.code === 200) {
      formData.value = response.data;
      formOpen.value = true;
    }
  });
}

/**
 * 提交表单成功后刷新列表
 */
function handleSubmit() {
  getList();
}

/**
 * 提交审核
 */
function handleCheck(row) {
  submitContract(row.id).then(response => {
    if (response.code === 200) {
      proxy.$modal.msgSuccess("提交成功");
      getList();
    }
  });
}

/**
 * 删除按钮操作
 */
function handleDelete(row) {
  proxy.$modal.confirm('是否确认删除合同编号为"' + row.contractId + '"的数据项？').then(function () {
    return delContract(row.id);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => { });
}

/**
 * 获取国家名称
 */
function getCountryName(countryId) {
  return getCountryNameUtil(countryId, contractDicts.value?.country);
}

/**
 * 收款按钮操作，弹出收款弹窗
 */
function handleCollect(row) {
  collectRow.value = row;
  collectDialogVisible.value = true;
}

/**
 * 收款弹窗提交成功后刷新列表
 */
function handleCollectSuccess() {
  collectDialogVisible.value = false;
  getList();
}

/**
 * 收款详情按钮操作
 */
function handleCollectDetail(row) {
  currentContractId.value = row.contractId;
  collectDetailDialogVisible.value = true;
}

/**
 * 审核详情按钮操作
 * @param {Object} row - 行数据
 */
function handleCheckDetail(row) {
  currentCheckContractId.value = row.contractId;
  checkListDialogVisible.value = true;
}


/**
 * 预览合同PDF
 * @param {Object} row - 行数据
 */
function handlePreview(row) {
  handlePreviewPdf(row, (r) => createContractPdf(r.contractId));
}

/**
 * 导出选中合同
 */
function handleExport() {
  if (ids.value.length === 0) {
    proxy.$modal.msgError("请至少选择一条记录");
    return;
  }
  
  const message = ids.value.length > 1 ? 
    '是否确认导出所选' + ids.value.length + '条合同数据？' : 
    '是否确认导出所选合同数据？';
  
  proxy.$modal.confirm(message).then(() => {
    proxy.$modal.loading("正在导出数据，请稍候...");
    return exportContracts(ids.value);
  }).then(response => {
    // 创建blob对象
    const blob = new Blob([response], { type: 'application/vnd.ms-excel' });
    // 创建下载链接
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    // 设置下载文件名
    const filename = `合同数据_${new Date().getTime()}.xlsx`;
    link.download = filename;
    // 触发下载
    link.click();
    window.URL.revokeObjectURL(link.href);
    proxy.$modal.closeLoading();
    proxy.$modal.msgSuccess("导出成功");
  }).catch(() => {
    proxy.$modal.closeLoading();
    proxy.$modal.msgError("导出失败");
  });
}
</script>

<style lang="scss" scoped>
</style> 