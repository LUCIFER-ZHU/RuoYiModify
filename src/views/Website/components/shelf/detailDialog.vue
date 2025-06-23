<template>
  <el-dialog v-model="visible" title="货架详情" width="900px" append-to-body>
    <el-descriptions :column="2" border>
      <el-descriptions-item width="150" label="货架ID">
        {{ data.shelfId }}
      </el-descriptions-item>
      <el-descriptions-item width="200" label="货架名称">
        {{ data.shelfName }}
      </el-descriptions-item>
      <el-descriptions-item label="仓库ID">
        {{ data.warehouseId }}
      </el-descriptions-item>
      <el-descriptions-item label="仓库区域">
        {{ data.warehouseRegion }}
      </el-descriptions-item>
      <el-descriptions-item label="货架类型">
        {{ shelfDicts.shelfTypeList[data.shelfType] }}
      </el-descriptions-item>
      <el-descriptions-item label="层数">
        {{ data.levelCount }}
      </el-descriptions-item>
      <el-descriptions-item label="货架状态">
        {{ shelfDicts.statusList[data.status] }}
      </el-descriptions-item>
      <el-descriptions-item label="货架描述">
        {{ data.description }}
      </el-descriptions-item>
      <el-descriptions-item label="创建人">
        {{ data.createBy }}
      </el-descriptions-item>
      <el-descriptions-item label="创建时间">
        {{ parseTime(data.createTime) }}
      </el-descriptions-item>
      <el-descriptions-item label="更新人">
        {{ data.updateBy }}
      </el-descriptions-item>
      <el-descriptions-item label="更新时间">
        {{ parseTime(data.updateTime) }}
      </el-descriptions-item>
    </el-descriptions>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    default: () => ({})
  },
  shelfDicts: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['update:modelValue']);

const visible = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  }
});
</script>