<template>
  <el-dialog
    v-model="dialogVisible"
    width="70%"
    :before-close="handleClose"
    append-to-body
    title="文档预览"
  >
    <component
      :is="previewComponent"
      v-if="innerFileUrl && previewComponent"
      :src="innerFileUrl"
      style="width: 100%; min-height: 600px"
    />
    <div v-else>暂不支持该格式或文件地址无效</div>
  </el-dialog>
</template>

<script setup>
import { computed, watch, ref, defineAsyncComponent } from "vue";

const props = defineProps({
  visible: Boolean,
  fileUrl: String,
  fileType: String // 可选，优先用 fileType，否则自动判断
});
const emit = defineEmits(["update:visible"]);

const innerFileUrl = ref("");

// 控制对话框显示
const dialogVisible = computed({
  get() {
    return props.visible;
  },
  set(value) {
    emit("update:visible", value);
  }
});

// 监听外部 fileUrl 变化，只有弹窗打开时才赋值
watch(
  () => props.fileUrl,
  (val) => {
    if (dialogVisible.value) {
      innerFileUrl.value = val;
    }
  }
);

const previewComponent = computed(() => {
  let type = props.fileType;
  if (!type && innerFileUrl.value) {
    const ext = innerFileUrl.value.split(".").pop().toLowerCase();
    type = ext;
  }

  if (["doc", "docx"].includes(type)) {
    return defineAsyncComponent(() => import("@vue-office/docx"));
  }
  if (["xls", "xlsx"].includes(type)) {
    return defineAsyncComponent(() => import("@vue-office/excel"));
  }
  if (["pdf"].includes(type)) {
    return defineAsyncComponent(() => import("@vue-office/pdf"));
  }
  return null;
});

function handleClose() {
  emit("update:visible", false);
  innerFileUrl.value = "";
}
</script>
