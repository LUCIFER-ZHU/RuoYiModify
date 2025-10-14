<template>
  <el-dialog :close-on-click-modal="false" v-model="dialogVisible" title="合同收款" width="400px" @close="handleClose">
    <el-form ref="formRef" :model="form" label-width="80px" :rules="rules">
      <el-form-item label="收款状态" prop="paymentState" required>
        <el-select v-model="form.paymentState" placeholder="请选择收款状态" style="width: 220px">
          <el-option v-for="item in filteredPaymentStates" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleSubmitDebounced">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { debounce } from 'lodash-es';
import { collectContract } from '@/api/Website/contract';
import { ElMessage } from 'element-plus';
import { validateAndCollect } from '@/utils/validate';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  row: {
    type: Object,
    default: null,
  },
  contractDicts: {
    type: Object,
    required: true
  }
});
const emit = defineEmits(['update:visible', 'submit-success']);
const form = ref({ paymentState: null });
// 表单
const formRef = ref(null);
// 提交loading状态
const submitLoading = ref(false);
// 控制对话框显示
const dialogVisible = computed({
  get() {
    return props.visible;
  },
  set(value) {
    emit("update:visible", value);
  },
});

const filteredPaymentStates = computed(() => {
  const state = props.row?.paymentState;
  const all = props.contractDicts?.collectionState || [];
  if (state === 0) return all.filter(i => i.value === 1 || i.value === 2);
  if (state === 1) return all.filter(i => i.value === 4);
  if (state === 2) return all.filter(i => i.value === 3 || i.value === 4);
  if (state === 3) return all.filter(i => i.value === 4);
  return all;
});

watch(() => props.visible, (val) => {
  if (val && props.row) {
    form.value = {
      paymentState: null
    };
  }
});

function handleClose() {
  dialogVisible.value = false;
}

// 表单校验
const rules = reactive({
  paymentState: [
    { required: true, message: '请输入收款状态', trigger: 'blur' }
  ],
})

async function handleSubmit() {
  // 防止重复提交
  if (submitLoading.value) return;
  
  try {
    submitLoading.value = true;
    // 先进行前端校验：未通过则提示具体字段信息并中断
    const { valid, joined } = await validateAndCollect(formRef.value, '、');
    if (!valid) {
      ElMessage.error(joined || '请检查必填项或格式错误');
      submitLoading.value = false;
      return;
    }

    await collectContract({
      contractId: props.row.contractId,
      currencyType: props.row.currencyType,
      paymentState: form.value.paymentState
    });
    ElMessage.success("操作成功");
    emit('submit-success');
    dialogVisible.value = false;
  } catch (error) {
    console.error("操作失败", error);
    ElMessage.error(error.response?.message || "操作失败");
  } finally {
    submitLoading.value = false;
  }
}

/**
 * 防抖提交函数
 * 使用lodash-es的debounce，延迟500ms，防止重复点击
 */
const handleSubmitDebounced = debounce(handleSubmit, 500, {
  leading: true,  // 第一次点击立即执行
  trailing: false // 后续点击在延迟期间内不执行
});
</script>
