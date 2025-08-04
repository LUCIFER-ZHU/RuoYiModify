<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <el-card class="box-card">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="100px" @submit.prevent>
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
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>
    </el-card>

    <!-- 表格数据 -->
    <el-card class="box-card">
      <el-table v-loading="loading" :data="contractList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="合同号" align="center" prop="contractId" width="150" fixed="left" />
        <el-table-column label="合同标题" align="center" prop="contractTitle" min-width="180" fixed="left"  />
        <el-table-column label="合同状态" align="center" prop="contractState">
          <template #default="scope">
            <DictTagMn :options="contractDicts.contractState" :value="scope.row.contractState" />
          </template>
        </el-table-column>
        <el-table-column label="客户公司" align="center" prop="customerCompany" width="150" show-overflow-tooltip />
        <el-table-column label="客户姓名" align="center" prop="customerName" width="120" />
        <el-table-column label="客户国家" align="center" prop="country" width="120">
          <template #default="scope">
            {{ getCountryName(scope.row.country) }}
          </template>
        </el-table-column>
        <el-table-column label="商品" align="center" prop="productInfo" width="120" >
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
        <el-table-column label="收款类型" align="center" prop="benType">
          <template #default="scope">
            <DictTagMn :options="contractDicts.benType" :value="scope.row.benType" />
          </template>
        </el-table-column>
        <el-table-column label="合同总金额" align="center" prop="totalPrice" width="120" />
        <el-table-column label="币种" align="center" prop="currencyType">
          <template #default="scope">
            <DictTagMn :options="contractDicts.currencyType" :value="scope.row.currencyType" />
          </template>
        </el-table-column>
        <el-table-column label="跟进人" align="center" prop="userName" width="100" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="250">
          <template #default="scope">
            <el-button link type="primary" icon="View" @click="handlePreview(scope.row)">预览</el-button>            
            <el-button link type="primary" icon="Check" @click="handleApprove(scope.row)">通过</el-button>
            <el-button link type="primary" icon="Close" @click="handleReject(scope.row)">拒绝</el-button>
            <el-button link type="primary" icon="Document" @click="handleShowDetail(scope.row)">收款详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <el-dialog v-model="rejectDialogOpen" title="拒绝原因" width="400px" @close="handleRejectClose">
      <el-form :model="rejectForm" :rules="rejectRules" ref="rejectFormRef" label-width="80px">
        <el-form-item label="原因" prop="checkInfo" required>
          <el-input v-model="rejectForm.checkInfo" type="textarea" :rows="4" placeholder="请输入未通过原因" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleRejectClose">取消</el-button>
        <el-button type="primary" @click="handleRejectConfirm">确定</el-button>
      </template>
    </el-dialog>
    <CollectDetailDialog
      v-model:visible="collectDetailDialogVisible"
      :contract-id="currentContractId"
      :contract-dicts="contractDicts"
    />
  </div>
</template>

<script setup name="ContractAudit">
import { getContractAuditList, remarkContract } from "@/api/Website/contract";
import { ElMessage } from 'element-plus';
import { useDictMn } from "@/utils/dictMn";
import { reactive, onMounted, watchEffect } from "vue";
const { proxy } = getCurrentInstance();
import { getCountryNameUtil } from '@/utils/displayHelpers';
import { handlePreviewPdf } from '@/utils/previewPdf';
import { createContractPdf } from '@/api/Website/contract';
import CollectDetailDialog from '@/views/Website/components/finance/collectDetailDialog.vue';

const contractList = ref([]);
const rejectDialogOpen = ref(false);
const rejectRow = ref(null);
const rejectForm = reactive({ checkInfo: '' });
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);



// 字典数据
const dictData = useDictMn('country', 'customer_source', 'currency_type', 'contract_state', 'payment_state',  'ship_way', 'trading_way', 'ben_type', 'review_state');
const contractDicts = ref({});

// 在组件挂载后初始化字典
onMounted(() => {
  watchEffect(() => {
    contractDicts.value = {
      country: dictData.country.value,
      customerSource: dictData.customer_source.value,
      currencyType: dictData.currency_type.value,
      contractState: dictData.contract_state.value,
      paymentState: dictData.payment_state.value,
      shipWay: dictData.ship_way.value,
      tradingWay: dictData.trading_way.value,
      benType: dictData.ben_type.value,
      reviewState: dictData.review_state.value,
    };
  });
  
  getList(); // 直接查询
});

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
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
    // 收款状态
    paymentState: null,
    // 贸易方式(0=>'EXW',1=>'FOB',2=>'CFR',3=>'CIF',4=>'DAP',5=>'DDP',6=>'FCA')
    tradingWay: null,
  }
});

const { queryParams } = toRefs(data);

function getList() {
  loading.value = true;
  getContractAuditList({ ...queryParams.value }).then(response => {
    if (response.code === 200) {
      contractList.value = response.rows;
      total.value = response.total;
    }
    loading.value = false;
  });
}

function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}


async function handleApprove(row) {
  try {
    await remarkContract({
      id: row.review?.id,
      contractId: row.contractId,
      reviewState: 1
    });
    ElMessage.success('审核通过');
    getList();
  } catch (error) {
    ElMessage.error(error.response?.message || '操作失败');
  }
}

function handleReject(row) {
  rejectRow.value = row;
  rejectForm.checkInfo = '';
  rejectDialogOpen.value = true;
}

function handleRejectClose() {
  rejectDialogOpen.value = false;
  rejectForm.checkInfo = '';
  rejectRow.value = null;
}

const rejectRules = {
  checkInfo: [
    { required: true, message: '请输入未通过原因', trigger: 'blur' }
  ]
};

const rejectFormRef = ref(null);

async function handleRejectConfirm() {
  if (!rejectFormRef.value) return;
  await rejectFormRef.value.validate(async (valid) => {
    if (!valid) return;
    try {
      await remarkContract({
        id: rejectRow.value.review?.id,
        contractId: rejectRow.value.contractId,
        reviewState: 2,
        checkInfo: rejectForm.checkInfo
      });
      ElMessage.success('审核拒绝');
      handleRejectClose();
      getList();
    } catch (error) {
      ElMessage.error(error.response?.message || '操作失败');
    }
  });
}

function handlePreview(row) {
  handlePreviewPdf(row, (r) => createContractPdf(r.contractId));
}

function getCountryName(countryId) {
  return getCountryNameUtil(countryId, contractDicts.value?.country);
}

// 收款详情弹窗
const collectDetailDialogVisible = ref(false);
const currentContractId = ref('');

/**
 * 收款详情按钮操作
 */
function handleShowDetail(row) {
  currentContractId.value = row.contractId;
  collectDetailDialogVisible.value = true;
}
</script>

<style lang="scss" scoped>
</style>
