<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" @submit.prevent>
      <el-form-item label="键" prop="configKey">
        <el-input
          v-model="queryParams.configKey"
          placeholder="请输入键"
          clearable
          style="width: 200px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
      <!-- <el-form-item style="float: right">
        <el-button type="primary" icon="Plus" @click="handleAdd"
          >新增</el-button
        >
      </el-form-item> -->
    </el-form>

    <el-table v-loading="loading" :data="tableData" style="width: 100%">
      <el-table-column
        label="ID"
        width="100"
        align="center"
        prop="id"
        sortable
      />
      <el-table-column label="键" align="center" prop="configKey" />
      <el-table-column label="值" align="center" prop="configValue" />
      <el-table-column label="配置说明" align="center" prop="remark" sortable />
      <el-table-column label="操作" align="center" width="300">
        <template #default="scope">
          <el-button
            link
            type="primary"
            icon="Edit"
            @click="handleDetails(scope.row)"
            >详情</el-button
          >
          <el-button
            link
            type="primary"
            icon="Edit"
            @click="handleEdit(scope.row)"
            >编辑</el-button
          >
          <el-button
            link
            type="primary"
            icon="Delete"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 新增/编辑/详情 -->
    <ConfigFormDialog
      v-model="dialogVisible"
      :mode="dialogMode"
      :data="currentRow"
      @submit="handleDialogSubmit"
    />
  </div>
</template>
<script setup>
import ConfigFormDialog from "./components/ConfigFormDialog.vue";
import {
  listTable,
  getConfigDetail,
  addConfig,
  updateConfig,
  delSystemConfig
} from "@/api/Website/SystemConfig";
import { ElMessage, ElMessageBox } from 'element-plus';
import { ref, reactive, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
const router = useRouter(); // 路由
watch();
onMounted(() => {
  getList();
});
const queryRef = ref();
const loading = ref(true);
const total = ref(0);
const tableData = ref([]);
const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  configKey: "",
});

/** 列表数据 */
function getList() {
  loading.value = true;
  listTable(queryParams.value).then((response) => {
    tableData.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

const dialogVisible = ref(false);
const dialogMode = ref("add"); // add | edit | detail
const currentRow = ref(null);

//新增
const handleAdd = () => {
  dialogMode.value = "add";
  currentRow.value = null;
  dialogVisible.value = true;
};

//编辑
const handleEdit = (row) => {
  dialogMode.value = "edit";
  getConfigDetail(row.id).then((res) => {
    currentRow.value = res.data;
    dialogVisible.value = true;
  });
};

//详情
const handleDetails = (row) => {
  dialogMode.value = "detail";
  getConfigDetail(row.id).then((res) => {
    currentRow.value = res.data;
    dialogVisible.value = true;
  });
};

//提交
const handleDialogSubmit = (data) => {
  if (dialogMode.value === "add") {
    addConfig(data).then(() => {
      ElMessage.success("新增成功");
      dialogVisible.value = false;
      getList();
    });
  } else if (dialogMode.value === "edit") {
    updateConfig(data).then(() => {
      ElMessage.success("修改成功");
      dialogVisible.value = false;
      getList();
    });
  }
};

//删除
const handleDelete = (row) => {
  ElMessageBox.confirm("此操作将删除数据,是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
        delSystemConfig(row.id).then((res) => {
        ElMessage.success("删除成功");
        getList();
      });
    })
    .catch(() => {});
};

/** 搜索按钮操作 */
function handleQuery() {
  event.preventDefault();
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  queryRef.value.resetFields();
  handleQuery();
}
</script>
<style lang="scss" scoped></style>
