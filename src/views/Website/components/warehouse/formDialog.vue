<template>
  <el-dialog :title="dialogTitle" v-model="dialogVisible" width="900px" @close="handleClose">
    <el-form ref="formRef" :model="formData" label-width="100px" :rules="rules">
      <el-divider content-position="left">基本信息</el-divider>
      <el-row>
        <el-col :span="12">
          <el-form-item label="仓库名称" prop="warehouseName" :rules="rules.warehouseName">
            <el-input v-model="formData.warehouseName" placeholder="请输入仓库名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="仓库类型" prop="warehouseType">
            <el-select v-model="formData.warehouseType" placeholder="请选择仓库类型">
              <el-option v-for="(item, index) in warehouseDicts.warehouseTypeList" :key="index" :label="item" :value="index" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="仓库状态" prop="status">
            <el-select v-model="formData.status" placeholder="请选择仓库状态">
              <el-option v-for="(item, index) in warehouseDicts.statusList" :key="index" :label="item" :value="index" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系人" prop="contactPerson" :rules="rules.contactPerson">
            <el-input v-model="formData.contactPerson" placeholder="请输入联系人姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话" prop="contactPhone" :rules="rules.contactPhone">
            <el-input v-model="formData.contactPhone" placeholder="请输入联系电话" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="地理位置" prop="warehouseLocation" :rules="rules.warehouseLocation">
            <el-input v-model="formData.warehouseLocation" placeholder="请输入地理位置" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="详细地址" prop="warehouseAddress" :rules="rules.warehouseAddress">
            <el-input v-model="formData.warehouseAddress" placeholder="请输入详细地址" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="仓库面积" prop="areaSize">
            <el-input-number v-model="formData.areaSize" placeholder="请输入仓库面积(平方米)" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="仓库描述" prop="description">
            <el-input v-model="formData.description" type="textarea" placeholder="请输入仓库描述" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import { addWarehouse, updateWarehouse } from '@/api/Website/warehouse';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  editData: {
    type: Object,
    default: null
  },
  warehouseDicts: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:visible', 'submit-success']);

const formRef = ref();
const submitLoading = ref(false);

const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
});

const dialogTitle = computed(() => {
  return props.editData ? '编辑仓库' : '新增仓库';
});

// 表单数据
const formData = reactive({
  id: null,
  warehouseId: '',
  warehouseName: '',
  warehouseLocation: '',
  warehouseAddress: '',
  contactPerson: '',
  contactPhone: '',
  warehouseType: 0,
  status: 0,
  areaSize: 0,
  description: ''
});

// 表单验证规则
const rules = {
  warehouseName: [
    { required: true, message: '请输入仓库名称', trigger: 'blur' }
  ],
  contactPerson: [
    { required: true, message: '请输入联系人', trigger: 'blur' }
  ],
  contactPhone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  warehouseLocation: [
    { required: true, message: '请输入地理位置', trigger: 'blur' }
  ],
  warehouseAddress: [
    { required: true, message: '请输入详细地址', trigger: 'blur' }
  ]
};

// 监听编辑数据变化
watch(() => props.editData, (newData) => {
  if (newData) {
    Object.assign(formData, newData);
  } else {
    resetForm();
  }
}, { immediate: true });

// 监听弹窗显示状态
watch(() => props.visible, (val) => {
  if (val) {
    nextTick(() => {
      if (formRef.value) {
        formRef.value.clearValidate();
      }
    });
  }
});

// 重置表单
function resetForm() {
  Object.assign(formData, {
    id: null,
    warehouseId: '',
    warehouseName: '',
    warehouseLocation: '',
    warehouseAddress: '',
    contactPerson: '',
    contactPhone: '',
    warehouseType: 0,
    status: 0,
    areaSize: 0,
    description: ''
  });
}

// 关闭弹窗
function handleClose() {
  dialogVisible.value = false;
  resetForm();
}

// 提交表单
function handleSubmit() {
  formRef.value.validate((valid) => {
    if (valid) {
      submitLoading.value = true;
      
      const submitData = { ...formData };
      const apiCall = props.editData ? updateWarehouse(submitData) : addWarehouse(submitData);
      
      apiCall.then(response => {
        if (response.code === 200) {
          ElMessage.success(props.editData ? '编辑成功' : '新增成功');
          emit('submit-success', submitData);
          handleClose();
        } else {
          ElMessage.error(response.msg || '操作失败');
        }
      }).catch(error => {
        console.error('提交失败:', error);
        ElMessage.error('操作失败');
      }).finally(() => {
        submitLoading.value = false;
      });
    }
  });
}
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}

.divider {
  margin: 20px 0;
}

.el-input-number{
  width: 100%;
}
</style>