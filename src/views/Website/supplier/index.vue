<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <el-row>
      <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="83px">
        <el-form-item label="供应商名称" prop="supplierName">
          <el-input v-model="queryParams.supplierName" placeholder="请输入供应商名称" clearable style="width: 240px"
            @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="合作状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="合作状态" clearable style="width: 240px">
            <el-option v-for="(item, index) in supplierDicts.statusList" :key="index" :label="item" :value="index" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['supplier:gen:add']">新增</el-button>
      </el-col>
    </el-row>

    <!-- 表格数据 -->
    <el-table height="100%" :row-style="{ height: '50px' }" v-loading="loading" :data="supplierList"
      @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="供应商名称" prop="supplierName" align="center" width="120" fixed/>
      <el-table-column label="主营业务" prop="mainBusiness" align="center" width="200" fixed></el-table-column>
      <el-table-column label="综合评级" prop="level" align="center" width="100" fixed/>
      <el-table-column label="合作状态" align="center" width="100" fixed>
        <template #default="scope">
          {{ supplierDicts.statusList[scope.row.status] }}
        </template>
      </el-table-column>
      <el-table-column label="供应商模式" align="center" width="200">
        <template #default="scope">
          {{ supplierDicts.supplierModelList[scope.row.supplierModel] }}
        </template>
      </el-table-column>
      <el-table-column label="国家" prop="country" align="center" width="200" />
      <el-table-column label="地区" prop="region" align="center" width="200" />
      <el-table-column label="业务区域" prop="businessRegion" align="center" width="200"></el-table-column>
      <el-table-column label="是否签订协议" align="center" width="200">
        <template #default="scope">
          {{ supplierDicts.agreementSignedList[scope.row.agreementSigned] }}
        </template>
      </el-table-column>
      <el-table-column label="对接人" prop="approver" align="center" width="200"
        :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="详细地址" prop="address" align="center" width="200" />
      <el-table-column label="来源" :show-overflow-tooltip="true"align="center"  width="150">
        <template #default="scope">
          {{ supplierDicts.sourceList[scope.row.source] }}
        </template>
      </el-table-column>
      <el-table-column label="交易币种" align="center" width="100">
        <template #default="scope">
          {{ supplierDicts.currencyTypeList[scope.row.currencyType] }}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="200" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-tooltip content="编辑" placement="top">
            <el-button link type="primary" icon="Edit" @click="handleEdit(scope.row)"
              v-hasPermi="['supplier:gen:edit']"></el-button>
          </el-tooltip>
          <el-tooltip content="详情" placement="top">
            <el-button link type="primary" icon="Search" @click="handleSearch(scope.row)"
              v-hasPermi="['supplier:gen:detail']"></el-button>
          </el-tooltip>
          <el-tooltip content="提交审核" placement="top">
            <el-button link type="primary" icon="Promotion" @click="handleRemark(scope.row)"
              v-hasPermi="['supplier:gen:remark']"></el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button link type="danger" icon="Delete" @click="handleDelete(scope.row)"
              v-hasPermi="['supplier:gen:delete']"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.current"
      v-model:limit="queryParams.size" @pagination="getList" />
      
    <!-- 查看详情 -->
    <SupplierDetailDialog v-model="showDetailDialog" :data="supplierData" :supplier-dicts="supplierDicts"
      :supplierTag="supplierTag" />

    <!-- 新增编辑弹窗 -->
    <SupplierFormDialog v-model:visible="supplierFormVisible" :edit-data="currentEditData"
      :supplier-dicts="supplierDicts" :supplierTag="supplierTag" @submit-success="handleSubmitSuccess" />
  </div>
</template>

<script setup name="SupplierIndex">
import { ElMessageBox } from 'element-plus';
import SupplierDetailDialog from '../components/supplier/detailDialog.vue';
import SupplierFormDialog from '../components/supplier/formDialog.vue';
import { listSupplier, getSupplier, delSupplier, remarkSupplier } from "@/api/Website/supplier";
import { supplierDicts } from './supplierDicts';


const { proxy } = getCurrentInstance();
const supplierList = ref([]);
const loading = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const supplierData = ref({});
const showDetailDialog = ref(false);
const currentEditData = ref(null);
const supplierFormVisible = ref(false);
const route = useRoute();

// 判断是哪种供应商
const supplierTag = computed(() => {
  let tempTag = ''
  if (route.path.endsWith('/supplier/logistics')) {
    tempTag = 'logistics';
  } else if (route.path.endsWith('/supplier/index')) {
    tempTag = 'products';
  }
  return tempTag;
})

const data = reactive({
  queryParams: {
    current: 1,
    size: 10,
    supplierName: undefined,
    status: undefined,
    supplierType: supplierTag.value === 'products' ? 0 : 1,
  },
});

const { queryParams } = toRefs(data);

/** 查询供应商列表 */
function getList() {
  loading.value = true;
  listSupplier(queryParams.value).then(response => {
    const data = response.data;
    supplierList.value = data.records.filter(item => !item.isDeleted);
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
/** 搜索供应商 */
function handleSearch(row) {
  getSupplier(row.id).then(response => {
    if (response.code !== 200) {
      proxy.$modal.msgError("获取供应商详情失败");
      return;
    }
    supplierData.value = response.data;
    showDetailDialog.value = true;
  });
}

/** 新增供应商 */
function handleAdd() {
  currentEditData.value = null;
  supplierFormVisible.value = true;
}

/** 修改供应商 */
function handleEdit(row) {
  getSupplier(row.id).then(response => {
    if (response.code !== 200) {
      proxy.$modal.msgError("获取供应商详情失败");
      return;
    }
    currentEditData.value = response.data;
    supplierFormVisible.value = true;
  });
}

// 提交
const handleSubmitSuccess = (formData) => {
  getList();
};

// 删除供应商
const handleDelete = (row) => {
  ElMessageBox.confirm("此操作将删除数据,是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      // 调用删除接口
      delSupplier(row.id).then((res) => {
        proxy.$modal.msgSuccess("删除成功");
        getList();
      });
    })
    .catch(() => { });
};

// 提交审核
const handleRemark = async (row) => {
  const res = await remarkSupplier(row.id);
  if (res.code !== 200) {
    proxy.$modal.msgError("提交审核失败");
    return;
  }
  getList();
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
};

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  queryParams.value.supplierName = undefined;
  queryParams.value.status = undefined;
  handleQuery();
};

getList();
</script>
