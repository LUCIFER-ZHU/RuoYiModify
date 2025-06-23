<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <el-row>
      <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="83px">
        <el-form-item label="货架名称" prop="shelfName">
          <el-input v-model="queryParams.shelfName" placeholder="请输入货架名称" clearable style="width: 240px"
            @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="货架状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="货架状态" clearable style="width: 240px">
            <el-option v-for="(item, index) in shelfDicts.statusList" :key="index" :label="item" :value="index" />
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
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['shelf:gen:add']">新增</el-button>
      </el-col>
    </el-row>

    <!-- 表格数据 -->
    <el-table height="100%" v-loading="loading" :data="shelfList" @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="货架名称" prop="shelfName" align="center" width="100" />
      <el-table-column label="仓库区域" align="center" width="200">
        <template #default="scope">
          {{ scope.row.warehouseRegion }}
        </template>
      </el-table-column>
      <el-table-column label="货架类型" align="center" width="120">
        <template #default="scope">
          {{ shelfDicts.shelfTypeList[scope.row.shelfType] }}
        </template>
      </el-table-column>
      <el-table-column label="层数" prop="levelCount" align="center" width="80" />
      <el-table-column label="货架状态" align="center" width="100">
        <template #default="scope">
          {{ shelfDicts.statusList[scope.row.status] }}
        </template>
      </el-table-column>
      <el-table-column label="货架描述" prop="description" align="center" width="400" />
      <el-table-column label="操作" fixed="right" width="200" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-tooltip content="编辑" placement="top">
            <el-button link type="primary" icon="Edit" @click="handleEdit(scope.row)"
              v-hasPermi="['shelf:gen:edit']"></el-button>
          </el-tooltip>
          <el-tooltip content="详情" placement="top">
            <el-button link type="primary" icon="Search" @click="handleSearch(scope.row)"
              v-hasPermi="['shelf:gen:detail']"></el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button link type="danger" icon="Delete" @click="handleDelete(scope.row)"
              v-hasPermi="['shelf:gen:delete']"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.current"
      v-model:limit="queryParams.size" @pagination="getList" />

    <!-- 查看详情 -->
    <ShelfDetailDialog v-model="showDetailDialog" :data="shelfData" :shelf-dicts="shelfDicts" />

    <!-- 新增编辑弹窗 -->
    <ShelfFormDialog v-model:visible="shelfFormVisible" :edit-data="currentEditData"
      :shelf-dicts="shelfDicts" @submit-success="handleSubmitSuccess" />
  </div>
</template>

<script setup name="Shelf">
import { ElMessageBox } from 'element-plus';
import ShelfDetailDialog from '../components/shelf/detailDialog.vue';
import ShelfFormDialog from '../components/shelf/formDialog.vue';
import { listShelf, getShelf, delShelf } from "@/api/Website/shelf";
import { shelfDicts } from './shelfDicts';


const { proxy } = getCurrentInstance();
const shelfList = ref([]);
const loading = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const shelfData = ref({});
const showDetailDialog = ref(false);
const currentEditData = ref(null);
const shelfFormVisible = ref(false);

const data = reactive({
  queryParams: {
    current: 1,
    size: 10,
    shelfName: undefined,
    warehouseId: undefined,
    status: undefined,
  },
});

const { queryParams } = toRefs(data);

/** 查询货架列表 */
function getList() {
  loading.value = true;
  listShelf(queryParams.value).then(response => {
    const data = response.data;
    shelfList.value = data.records.filter(item => !item.isDeleted);
    total.value = data.total;
    loading.value = false;
  });
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}
/** 搜索货架 */
function handleSearch(row) {
  getShelf(row.id).then(response => {
    if (response.code !== 200) {
      proxy.$modal.msgError("获取货架详情失败");
      return;
    }
    shelfData.value = response.data;
    showDetailDialog.value = true;
  });
}

/** 新增货架 */
function handleAdd() {
  currentEditData.value = null;
  shelfFormVisible.value = true;
}

/** 修改货架 */
function handleEdit(row) {
  getShelf(row.id).then(response => {
    if (response.code !== 200) {
      proxy.$modal.msgError("获取货架详情失败");
      return;
    }
    currentEditData.value = response.data;
    shelfFormVisible.value = true;
  });
}

// 提交
const handleSubmitSuccess = (formData) => {
  getList();
};

// 删除货架
const handleDelete = (row) => {
  ElMessageBox.confirm("此操作将删除数据,是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      // 调用删除接口
      delShelf(row.id).then((res) => {
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
  queryParams.value.shelfName = undefined;
  queryParams.value.warehouseId = undefined;
  queryParams.value.status = undefined;
  handleQuery();
};

getList();
</script>