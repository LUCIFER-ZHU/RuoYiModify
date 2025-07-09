<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <el-row>
      <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="83px" @submit.native.prevent>
        <el-form-item label="字典名称" prop="name">
          <el-input v-model="queryParams.name" placeholder="请输入字典名称" clearable style="width: 200px" @keyup.enter="handleQuery" />
        </el-form-item>
        <!-- <el-form-item label="字典编码" prop="value">
          <el-input v-model="queryParams.value" placeholder="请输入字典编码" clearable style="width: 200px"
            @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="字典状态" clearable style="width: 150px">
            <el-option label="正常" value="0" />
            <el-option label="禁用" value="1" />
          </el-select>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAddDict" v-hasPermi="['dict:manage:add']">新增字典</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Sort" @click="toggleExpandAll">展开/折叠</el-button>
      </el-col>
    </el-row>

    <!-- 树形表格数据 -->
    <el-table
      ref="tableRef"
      v-loading="loading"
      :data="dictList"
      row-key="id"
      :default-expand-all="false"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      border
    >
      <el-table-column label="字典名称" prop="name" width="200">
        <template #default="scope">
          <span v-if="scope.row.level === 1">{{ scope.row.name }}</span>
          <span v-else class="dict-item-label">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="字典编码" prop="value" width="200">
        <template #default="scope">
          <span v-if="scope.row.level === 1">{{ scope.row.value || '-' }}</span>
          <span v-else class="dict-item-value">{{ scope.row.value }}</span>
        </template>
      </el-table-column>
      <el-table-column label="字典项值" prop="code" width="150" align="center">
        <template #default="scope">
          <span v-show="scope.row.level === 2">{{ scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="description" width="200" align="center">
        <template #default="scope">
          <span>{{ scope.row.description || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" width="100" align="center">
        <template #default="scope">
          <el-tag :type="scope.row.status == 0 ? 'success' : 'danger'">
            {{ scope.row.status == 0 ? '正常' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180" align="center">
        <template #default="scope">
          {{ parseTime(scope.row.createTime) }}
        </template>        
      </el-table-column>
      <el-table-column label="更新时间" width="180" align="center">
        <template #default="scope">
          {{ parseTime(scope.row.updateTime) }}
        </template>        
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="300" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <!-- 字典操作 -->
          <template v-if="scope.row.level === 1">
            <!-- <el-tooltip content="查询字典项" placement="top">
              <el-button link type="success" icon="Search" @click="handleSearchDict(scope.row)"></el-button>
            </el-tooltip> -->
            <el-tooltip content="新增字典项" placement="top">
              <el-button link type="success" icon="Plus" @click="handleAddDictItem(scope.row)"
                v-hasPermi="['dict:manage:item:add']"></el-button>
            </el-tooltip>
            <el-tooltip content="编辑字典" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleEditDict(scope.row)"
                v-hasPermi="['dict:manage:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除字典" placement="top">
              <el-button link type="danger" icon="Delete" @click="handleDeleteDict(scope.row)"
                v-hasPermi="['dict:manage:delete']"></el-button>
            </el-tooltip>
          </template>
          <!-- 字典项操作 -->
          <template v-else>
            <el-tooltip content="编辑字典项" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleEditDictItem(scope.row)"
                v-hasPermi="['dict:manage:item:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除字典项" placement="top">
              <el-button link type="danger" icon="Delete" @click="handleDeleteDictItem(scope.row)"
                v-hasPermi="['dict:manage:item:delete']"></el-button>
            </el-tooltip>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <!-- 字典表单对话框 -->
    <el-dialog v-model="dictFormVisible" :title="dictFormTitle" width="600px" append-to-body>
      <el-form ref="dictFormRef" :model="dictForm" :rules="dictRules" label-width="120px">
        <el-form-item label="字典名称" prop="name">
          <el-input v-model="dictForm.name" placeholder="请输入字典名称" />
        </el-form-item>
        <el-form-item label="字典编码" prop="value">
          <el-input v-model="dictForm.value" placeholder="请输入字典编码" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="dictForm.status">
            <el-radio :value="0">正常</el-radio>
            <el-radio :value="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input v-model="dictForm.description" type="textarea" :rows="3" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dictFormVisible = false">取消</el-button>
          <el-button type="primary" @click="submitDictForm" :loading="submitLoading">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 字典项表单对话框 -->
    <el-dialog v-model="itemFormVisible" :title="itemFormTitle" width="600px" append-to-body>
      <el-form ref="itemFormRef" :model="itemForm" :rules="itemRules" label-width="120px">
        <el-form-item label="字典名称">
          <el-input v-model="currentDict.name" disabled />
        </el-form-item>
        <el-form-item label="字典编码" prop="value">
          <el-input v-model="itemForm.value" disabled/>
        </el-form-item>
        <el-form-item label="项目标签" prop="name">
          <el-input v-model="itemForm.name" placeholder="请输入项目标签" />
        </el-form-item>
        <el-form-item label="项目值" prop="code">
          <el-input-number v-model="itemForm.code" placeholder="请输入项目值"/>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="itemForm.status">
            <el-radio :label="0">正常</el-radio>
            <el-radio :label="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input v-model="itemForm.description" type="textarea" :rows="3" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="itemFormVisible = false">取消</el-button>
          <el-button type="primary" @click="submitItemForm" :loading="submitLoading">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="DictManage">
import { ElMessageBox } from 'element-plus';
import { 
  getDictTree, 
  addDict, 
  updateDict, 
  delDict
} from "@/api/Website/dictManage";

const { proxy } = getCurrentInstance();
const dictList = ref([]);
const loading = ref(true);
const isExpandAll = ref(false);
const submitLoading = ref(false);

// 搜索参数
const queryParams = ref({
  name: undefined,
  value: undefined,
  status: undefined
});

// 字典表单
const dictFormVisible = ref(false);
const dictFormTitle = ref('');
const dictForm = ref({
  id: undefined,
  name: '',
  value: '',
  status: 0,
  code: 0,
  description: ''
});
const dictRules = {
  name: [
    { required: true, message: '请输入字典名称', trigger: 'blur' }
  ],
  value: [
    { required: true, message: '请输入字典编码', trigger: 'blur' }
  ]
};

// 字典项表单
const itemFormVisible = ref(false);
const itemFormTitle = ref('');
const currentDict = ref({});
const itemForm = ref({
  id: undefined,
  parentId: undefined,
  name: '',
  value: '',
  status: 0,
  code: 0,
  description: ''
});
const itemRules = {
  name: [
    { required: true, message: '请输入项目标签', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入项目值', trigger: 'blur' }
  ]
};

/** 查询字典列表 */
function getList() {
  loading.value = true;
  getDictTree(queryParams.value).then(response => {
    if (response.success) {
      dictList.value = response.data;
    }
    loading.value = false;
  }).catch(() => {
    loading.value = false;
  });
}

/** 搜索按钮操作 */
function handleQuery() {
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  queryParams.value = {
    name: undefined,
    value: undefined,
    status: undefined
  };
  handleQuery();
}

/** 展开/折叠操作 */
function toggleExpandAll() {
  isExpandAll.value = !isExpandAll.value;
  const table = proxy.$refs.tableRef;
  if (table) {
    dictList.value.forEach(row => {
      table.toggleRowExpansion(row, isExpandAll.value);
    });
  }
}

/** 新增字典 */
function handleAddDict() {
  resetDictForm();
  dictFormTitle.value = '新增字典';
  dictFormVisible.value = true;
}

/** 编辑字典 */
function handleEditDict(row) {
  resetDictForm();
  dictForm.value = { ...row };
  dictFormTitle.value = '编辑字典';
  dictFormVisible.value = true;
}

/** 删除字典 */
function handleDeleteDict(row) {
  ElMessageBox.confirm(`确定删除字典"${row.name}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    delDict(row.id).then(response => {
      if (response.success) {
        proxy.$modal.msgSuccess('删除成功');
        getList();
      }
    });
  }).catch(() => {});
}

/** 新增字典项 */
function handleAddDictItem(row) {
  resetItemForm();
  currentDict.value = row;
  itemForm.value.parentId = row.id;
  itemForm.value.value = row.value;
  itemFormTitle.value = '新增字典项';
  itemFormVisible.value = true;
}

/** 编辑字典项 */
function handleEditDictItem(row) {
  resetItemForm();
  // 找到父字典
  const parentDict = dictList.value.find(dict => 
    dict.children && dict.children.some(item => item.id === row.id)
  );
  currentDict.value = parentDict || {};
  itemForm.value = { ...row };
  itemFormTitle.value = '编辑字典项';
  itemFormVisible.value = true;
}

/** 删除字典项 */
function handleDeleteDictItem(row) {
  ElMessageBox.confirm(`确定删除字典项"${row.name}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    delDict(row.id).then(response => {
      if (response.success) {
        proxy.$modal.msgSuccess('删除成功');
        getList();
      }
    });
  }).catch(() => {});
}

/** 提交字典表单 */
function submitDictForm() {
  proxy.$refs.dictFormRef.validate(valid => {
    if (valid) {
      submitLoading.value = true;
      const isEdit = dictForm.value.id !== undefined;
      const apiCall = isEdit ? updateDict(dictForm.value) : addDict(dictForm.value);
      
      apiCall.then(response => {
        if (response.success) {
          proxy.$modal.msgSuccess(isEdit ? '修改成功' : '新增成功');
          dictFormVisible.value = false;
          getList();
        }
      }).finally(() => {
        submitLoading.value = false;
      });
    }
  });
}

/** 提交字典项表单 */
function submitItemForm() {
  proxy.$refs.itemFormRef.validate(valid => {
    if (valid) {
      submitLoading.value = true;
      const isEdit = itemForm.value.id !== undefined;
      const apiCall = isEdit ? updateDict(itemForm.value) : addDict(itemForm.value);
      
      apiCall.then(response => {
        if (response.success) {
          proxy.$modal.msgSuccess(isEdit ? '修改成功' : '新增成功');
          itemFormVisible.value = false;
          getList();
        }
      }).finally(() => {
        submitLoading.value = false;
      });
    }
  });
}

/** 重置字典表单 */
function resetDictForm() {
  dictForm.value = {
    id: undefined,
    name: '',
    value: '',
    status: 0,
    code: 0,
    description: ''
  };
  if (proxy.$refs.dictFormRef) {
    proxy.$refs.dictFormRef.clearValidate();
  }
}

/** 重置字典项表单 */
function resetItemForm() {
  itemForm.value = {
    id: undefined,
    parentId: undefined,
    name: '',
    value: '',
    status: 0,
    code: 0,
    description: ''
  };
  if (proxy.$refs.itemFormRef) {
    proxy.$refs.itemFormRef.clearValidate();
  }
}

// 初始化
getList();
</script>

<style scoped>
.dict-item-label {
  color: #409eff;
  font-weight: 500;
}

.dict-item-value {
  color: #67c23a;
  font-family: 'Courier New', monospace;
}

.app-container {
  padding: 20px;
}

.mb8 {
  margin-bottom: 8px;
}

.el-input-number{
  width: 100%;
}
</style>