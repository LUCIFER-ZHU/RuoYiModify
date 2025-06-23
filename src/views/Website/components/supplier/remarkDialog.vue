<template>
  <el-dialog v-model="dialogVisible" title="审核人员审核" width="900px" :destroy-on-close="true" @close="handleClose">
    <el-form ref="formRef" :model="formData" label-width="100px" :rule="rules">
      <el-row>
        <el-col :span="24">
          <el-form-item label="审核内容" prop="businessContent" :rules="rules.businessContent">
            <el-input :rows="8" type="textarea" v-model="formData.businessContent" placeholder="请输入审核内容" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="formData.remark" placeholder="请输入备注" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status" :rules="rules.status">
            <el-select v-model="formData.status">
              <el-option v-for="(item, index) in supplierDicts.checkList" :key="index" :label="item" :value="index" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">返回</el-button>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ElMessage } from "element-plus";
import { remarkSupplier2 } from "@/api/Website/supplier";
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  supplierDicts: {
    type: Object,
    required: true
  },
  editData: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["update:visible", "submit"]);

// 表单
const formRef = ref(null);

// 表单数据
const formData = ref({
  id: "",
  businessId: "",
  businessContent: "",
  remark: '',
  status: 0
});

// 表单校验规则
const rules = reactive({
  businessContent: { required: true, message: '必填项', trigger: 'blur' },
  status: { required: true, message: '必填项', trigger: 'blur' },
})

// 监听编辑数据变化
watch(
  () => props.editData,
  (newVal) => {
    if (newVal) {
      formData.value = {
        ...newVal,
      };
    } else {
      formData.value = {
        businessId: "",
        businessContent: "",
        remark: '',
        status: 0
      };
    }
  },
  { immediate: true }
);

// 控制对话框显示
const dialogVisible = computed({
  get() {
    return props.visible;
  },
  set(value) {
    emit("update:visible", value);
  },
});


const handleClose = () => {
  formRef.value.resetFields();
  emit('update:visible', false);
}

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value.validate();
    await remarkSupplier2(formData.value);
    emit("submit-success");
    dialogVisible.value = false;
  } catch (error) {
    console.error("操作失败", error);
    ElMessage.error(error.response?.data?.message || "操作失败");
  }
};
</script>