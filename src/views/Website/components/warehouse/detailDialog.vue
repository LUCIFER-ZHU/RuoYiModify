<template>
  <el-dialog v-model="visible" title="仓库详情" width="900px" :destroy-on-close="true" @close="handleClose">
    <el-divider content-position="left">基本信息</el-divider>
    <el-descriptions :column="2" border>
      <el-descriptions-item label="仓库名称">{{ data.warehouseName }}</el-descriptions-item>
      <el-descriptions-item label="仓库类型">{{ warehouseDicts.warehouseTypeList[data.warehouseType] }}</el-descriptions-item>
      <el-descriptions-item label="仓库状态">
        {{ warehouseDicts.statusList[data.status] }}
      </el-descriptions-item>
      <el-descriptions-item label="联系人">{{ data.contactPerson }}</el-descriptions-item>
      <el-descriptions-item label="联系电话">{{ data.contactPhone }}</el-descriptions-item>
      <el-descriptions-item label="地理位置">{{ data.warehouseLocation }}</el-descriptions-item>
      <el-descriptions-item label="详细地址">{{ data.warehouseAddress }}</el-descriptions-item>
      <el-descriptions-item label="仓库面积">{{ data.areaSize }}</el-descriptions-item>
      <el-descriptions-item label="仓库描述">{{ data.description }}</el-descriptions-item>
      <el-descriptions-item label="创建人">{{ data.createBy }}</el-descriptions-item>
      <el-descriptions-item label="创建时间">{{ parseTime(data.createTime) }}</el-descriptions-item>
      <el-descriptions-item label="更新人">{{ data.updateBy }}</el-descriptions-item>
      <el-descriptions-item label="更新时间">{{ parseTime(data.updateTime) }}</el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import { ElDialog, ElDescriptions, ElDescriptionsItem, ElTag, ElImage } from 'element-plus';
const props = defineProps({
  modelValue: Boolean,
  data: {
    type: Object,
    required: true
  },
  warehouseDicts: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);

const visible = ref(props.modelValue);

watch(() => props.modelValue, (val) => {
  visible.value = val;
});

function handleClose() {
  emit('update:modelValue', false);
}
</script>

<style scoped>
.contact-info,
.account-info,
.product-info {
  margin-top: 20px;
}

.divider {
  margin: 20px 0;
}
</style>