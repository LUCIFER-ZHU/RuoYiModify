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
import { computed, watch, ref } from "vue";
import VueOfficeDocx from "@vue-office/docx";
import VueOfficeExcel from "@vue-office/excel";
import VueOfficePdf from "@vue-office/pdf";

const props = defineProps({
  visible: Boolean,
  fileUrl: String,
  fileType: String // 可选，优先用fileType，否则自动判断
});
const emit = defineEmits(["update:visible"]);

// 内部管理fileUrl
const innerFileUrl = ref("");

// 控制对话框显示
const dialogVisible = computed({
  get() {
    return props.visible;
  },
  set(value) {
    emit("update:visible", value);
  },
});

// 监听外部fileUrl变化，只有弹窗打开时才赋值
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
  if (["doc", "docx"].includes(type)) return VueOfficeDocx;
  if (["xls", "xlsx"].includes(type)) return VueOfficeExcel;
  if (["pdf"].includes(type)) return VueOfficePdf;
  return null;
});

function handleClose() {
  emit("update:visible", false);
  // 关闭时清空内部fileUrl
  innerFileUrl.value = "";
}
</script> 