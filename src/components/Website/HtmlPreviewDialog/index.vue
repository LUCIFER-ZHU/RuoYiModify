<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="60%"
    top="5vh"
    append-to-body
    destroy-on-close
    class="html-preview-dialog"
  >
    <div class="preview-container" v-loading="loading">
      <iframe
        v-if="url"
        id="previewIframe"
        :src="url"
        width="100%"
        height="100%"
        frameborder="0"
        @load="onIframeLoad"
      ></iframe>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handlePrint">打印</el-button>
        <el-button @click="handleDownload">下载</el-button>
        <el-button @click="handleClose">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  url: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: '预览'
  },
  fileName: {
    type: String,
    default: 'document.html'
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:visible', 'close']);

const dialogVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
    if (!val) {
      emit('close');
    }
  }
});

function handleClose() {
  dialogVisible.value = false;
}

function onIframeLoad() {
  // iframe loaded
}

/**
 * 打印预览内容
 */
function handlePrint() {
  const iframe = document.getElementById('previewIframe');
  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.print();
  }
}

/**
 * 下载预览内容
 */
function handleDownload() {
  if (!props.url) return;
  const link = document.createElement('a');
  link.href = props.url;
  link.download = props.fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
</script>

<style scoped>
.preview-container {
  height: 70vh;
}
</style>
