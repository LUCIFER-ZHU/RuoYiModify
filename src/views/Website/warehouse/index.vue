<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <el-row>
      <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="83px">
        <el-form-item label="仓库名称" prop="warehouseName">
          <el-input v-model="queryParams.warehouseName" placeholder="请输入仓库名称" clearable style="width: 240px"
            @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="仓库状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="仓库状态" clearable style="width: 240px">
            <el-option v-for="(item, index) in warehouseDicts.statusList" :key="index" :label="item" :value="index" />
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
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['warehouse:gen:add']">新增</el-button>
      </el-col>
    </el-row>

    <!-- 表格数据 -->
    <el-table height="100%" v-loading="loading" :data="warehouseList" @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="仓库名称" prop="warehouseName" align="center" width="150" />
      <el-table-column label="仓库类型" align="center" width="120">
        <template #default="scope">
          {{ warehouseDicts.warehouseTypeList[scope.row.warehouseType] }}
        </template>
      </el-table-column>
      <el-table-column label="仓库状态" align="center" width="100">
        <template #default="scope">
          {{ warehouseDicts.statusList[scope.row.status] }}
        </template>
      </el-table-column>
      <el-table-column label="联系人" prop="contactPerson" align="center" width="120"></el-table-column>
      <el-table-column label="联系电话" prop="contactPhone" align="center" width="150" />
      <el-table-column label="地理位置" prop="warehouseLocation" align="center" width="200" />
      <el-table-column label="详细地址" prop="warehouseAddress" align="center" width="200" />
      <el-table-column label="面积(㎡)" prop="areaSize" align="center" width="100" />
      <el-table-column label="仓库描述" prop="description" align="center" width="300" />
      <el-table-column label="操作" fixed="right" width="200" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-tooltip content="编辑" placement="top">
            <el-button link type="primary" icon="Edit" @click="handleEdit(scope.row)"
              v-hasPermi="['warehouse:gen:edit']"></el-button>
          </el-tooltip>
          <el-tooltip content="详情" placement="top">
            <el-button link type="primary" icon="Search" @click="handleSearch(scope.row)"
              v-hasPermi="['warehouse:gen:detail']"></el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button link type="danger" icon="Delete" @click="handleDelete(scope.row)"
              v-hasPermi="['warehouse:gen:delete']"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.current"
      v-model:limit="queryParams.size" @pagination="getList" />

    <!-- 查看详情 -->
    <WarehouseDetailDialog v-model="showDetailDialog" :data="warehouseData" :warehouse-dicts="warehouseDicts" />

    <!-- 新增编辑弹窗 -->
    <WarehouseFormDialog v-model:visible="warehouseFormVisible" :edit-data="currentEditData"
      :warehouse-dicts="warehouseDicts" @submit-success="handleSubmitSuccess" />
  </div>
</template>

<script setup name="Warehouse">
import { ElMessageBox } from 'element-plus';
import WarehouseDetailDialog from '../components/warehouse/detailDialog.vue';
import WarehouseFormDialog from '../components/warehouse/formDialog.vue';
import { listWarehouse, getWarehouse, delWarehouse } from "@/api/Website/warehouse";
import { warehouseDicts } from './warehouseDicts';


const { proxy } = getCurrentInstance();
const warehouseList = ref([]);
const loading = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const warehouseData = ref({});
const showDetailDialog = ref(false);
const currentEditData = ref(null);
const warehouseFormVisible = ref(false);

const data = reactive({
  queryParams: {
    current: 1,
    size: 10,
    warehouseName: undefined,
    status: undefined,
  },
});

const { queryParams } = toRefs(data);

/** 查询仓库列表 */
function getList() {
  loading.value = true;
  listWarehouse(queryParams.value).then(response => {
    const data = response.data;
    warehouseList.value = data.records.filter(item => !item.isDeleted);
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
/** 搜索仓库 */
function handleSearch(row) {
  getWarehouse(row.id).then(response => {
    if (response.code !== 200) {
      proxy.$modal.msgError("获取仓库详情失败");
      return;
    }
    warehouseData.value = response.data;
    showDetailDialog.value = true;
  });
}

/** 新增仓库 */
function handleAdd() {
  currentEditData.value = null;
  warehouseFormVisible.value = true;
}

/** 修改仓库 */
function handleEdit(row) {
  getWarehouse(row.id).then(response => {
    if (response.code !== 200) {
      proxy.$modal.msgError("获取仓库详情失败");
      return;
    }
    currentEditData.value = response.data;
    warehouseFormVisible.value = true;
  });
}

// 提交
const handleSubmitSuccess = (formData) => {
  getList();
};

// 删除仓库
const handleDelete = (row) => {
  ElMessageBox.confirm("此操作将删除数据,是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      // 调用删除接口
      delWarehouse(row.id).then((res) => {
        proxy.$modal.msgSuccess("删除成功");
        getList();
      });
    })
    .catch(() => { });
};

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
};

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  queryParams.value.warehouseName = undefined;
  queryParams.value.status = undefined;
  handleQuery();
};

getList();
</script>