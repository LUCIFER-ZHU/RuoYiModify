<template>
  <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑货架' : '新增货架'" width="900px" @close="handleCancel">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="货架名称" prop="shelfName">
            <el-input v-model="formData.shelfName" placeholder="请输入货架名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="仓库区域" prop="warehouseRegion">
            <el-input v-model="formData.warehouseRegion" placeholder="请输入仓库区域" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="货架类型" prop="shelfType">
            <el-select v-model="formData.shelfType" placeholder="请选择货架类型" style="width: 100%">
              <el-option v-for="(item, index) in shelfDicts.shelfTypeList" :key="index" :label="item" :value="index" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="层数" prop="levelCount">
            <el-input-number v-model="formData.levelCount" :min="1" :max="20" placeholder="请输入层数" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="货架状态" prop="status">
            <el-select v-model="formData.status" placeholder="请选择货架状态" style="width: 100%">
              <el-option v-for="(item, index) in shelfDicts.statusList" :key="index" :label="item" :value="index" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="货架描述" prop="description">
            <el-input v-model="formData.description" type="textarea" :rows="3" placeholder="请输入货架描述" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { addShelf, updateShelf } from '@/api/Website/shelf';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  editData: {
    type: Object,
    default: null
  },
  shelfDicts: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['update:visible', 'submit-success']);

const { proxy } = getCurrentInstance();
const formRef = ref();
const submitLoading = ref(false);

const dialogVisible = computed({
  get() {
    return props.visible;
  },
  set(value) {
    emit('update:visible', value);
  }
});

const isEdit = computed(() => {
  return props.editData && props.editData.id;
});

const formData = ref({
  shelfId: '',
  shelfName: '',
  warehouseId: '',
  warehouseRegion: '',
  shelfType: 0,
  levelCount: 1,
  status: 0,
  description: ''
});

const rules = {
  shelfName: [
    { required: true, message: '请输入货架名称', trigger: 'blur' }
  ],
  shelfType: [
    { required: true, message: '请选择货架类型', trigger: 'change' }
  ],
  levelCount: [
    { required: true, message: '请输入层数', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择货架状态', trigger: 'change' }
  ]
};

// 监听编辑数据变化
watch(() => props.editData, (newData) => {
  if (newData) {
    formData.value = { ...newData };
  } else {
    resetForm();
  }
}, { immediate: true });

// 监听对话框显示状态
watch(() => props.visible, (newVal) => {
  if (newVal && !props.editData) {
    resetForm();
  }
});

function resetForm() {
  formData.value = {
    shelfId: '',
    shelfName: '',
    warehouseId: '',
    warehouseRegion: '',
    shelfType: 0,
    levelCount: 1,
    status: 0,
    description: ''
  };
  if (formRef.value) {
    formRef.value.clearValidate();
  }
}

function handleCancel() {
  dialogVisible.value = false;
  resetForm();
}

function handleSubmit() {
  formRef.value.validate((valid) => {
    if (valid) {
      submitLoading.value = true;
      const submitData = { ...formData.value };
      
      const apiCall = isEdit.value ? updateShelf(submitData) : addShelf(submitData);
      
      apiCall.then(response => {
        if (response.code === 200) {
          proxy.$modal.msgSuccess(isEdit.value ? '修改成功' : '新增成功');
          dialogVisible.value = false;
          emit('submit-success', submitData);
          resetForm();
        } else {
          proxy.$modal.msgError(response.msg || (isEdit.value ? '修改失败' : '新增失败'));
        }
      }).catch(error => {
        proxy.$modal.msgError(isEdit.value ? '修改失败' : '新增失败');
      }).finally(() => {
        submitLoading.value = false;
      });
    }
  });
}
</script>