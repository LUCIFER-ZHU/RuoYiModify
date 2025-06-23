<template>
  <div class="app-container">
    <!-- 表格数据 -->
    <el-table height="100%" v-loading="loading" :data="supplierList" @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="供应商名称" prop="supplierName" width="120" />
      <el-table-column label="来源" :show-overflow-tooltip="true" width="150">
        <template #default="scope">
          {{ supplierDicts.sourceList[scope.row.source] }}
        </template>
      </el-table-column>
      <el-table-column label="交易币种" width="100">
        <template #default="scope">
          {{ supplierDicts.currencyTypeList[scope.row.currencyType] }}
        </template>
      </el-table-column>
      <el-table-column label="级别" prop="level" width="100" />
      <el-table-column label="合作状态" align="center" width="100">
        <template #default="scope">
          {{ supplierDicts.statusList[scope.row.status] }}
        </template>
      </el-table-column>
      <el-table-column label="对接人" prop="approver" align="center" width="200"></el-table-column>
      <el-table-column label="国家" prop="country" width="200" />
      <el-table-column label="地区" prop="region" width="200" />
      <el-table-column label="详细地址" prop="address" width="200" />
      <el-table-column label="操作" fixed="right" width="200" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-tooltip content="审核" placement="top">
            <el-button link type="primary" icon="DocumentChecked" @click="handleRemark(scope.row)" v-hasPermi="['supplier:user:remark']"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.current"
      v-model:limit="queryParams.size" @pagination="getList" /> 

    <!-- 审核弹窗 -->
    <RemarkDialog v-model:visible="remarkFormVisible" :edit-data="currentEditData"
      :supplier-dicts="supplierDicts" @submit-success="handleSubmitSuccess" />      
  </div>
</template>

<script setup name="SupplierRemarkTable">
import RemarkDialog from '../components/supplier/remarkDialog.vue';
import { listSupplier } from "@/api/Website/supplier";
import { supplierDicts } from './supplierDicts';

const { proxy } = getCurrentInstance();
const supplierList = ref([]);
const loading = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const currentEditData = ref(null);
const remarkFormVisible = ref(false);
const data = reactive({
  queryParams: {
    current: 1,
    size: 10,
    supplierName: undefined,
    status: undefined,
  },
});

const { queryParams } = toRefs(data);

/** 查询供应商列表 */
function getList() {
  loading.value = true;
  listSupplier(queryParams.value).then(response => {
    const data = response.data;
    supplierList.value = data.records.filter(item => !item.isDeleted && item.status===1);
    total.value = data.total;
    loading.value = false;
  });
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.roleId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

// 处理审核
const handleRemark = (row)=>{
    currentEditData.value = {
      id: row.id,
      businessId: row.supplierId,
    }
    remarkFormVisible.value = true;
}

// 提交
const handleSubmitSuccess = (formData) => {
  getList();
};

getList();
</script>
