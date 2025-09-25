<template>
  <div class="upload-file">
    <el-upload
      multiple
      :action="uploadFileUrl"
      :before-upload="handleBeforeUpload"
      :file-list="fileList"
      :data="data"
      :limit="limit"
      :on-error="handleUploadError"
      :on-exceed="handleExceed"
      :on-success="handleUploadSuccess"
      :show-file-list="false"
      :headers="headers"
      class="upload-file-uploader"
      ref="fileUpload"
      v-if="!disabled"
    >
      <!-- 上传按钮 -->
      <el-button type="primary">选取文件</el-button>
    </el-upload>
    <!-- 上传提示 -->
    <div class="el-upload__tip" v-if="showTip && !disabled">
      请上传
      <template v-if="fileSize"> 大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b> </template>
      <template v-if="fileType"> 格式为 <b style="color: #f56c6c">{{ fileType.join("、") }}</b> </template>
      的文件
    </div>
    <!-- 文件列表 -->
    <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear" tag="ul">
      <li :key="file.uid" class="el-upload-list__item ele-upload-list__item-content" v-for="(file, index) in fileList">
        <el-link :href="`${baseUrl}${file.url}`" underline="never" target="_blank">
          <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
        </el-link>
        <div class="ele-upload-list__item-content-action">
          <!-- 预览在禁用状态也可用 -->
          <el-link underline="never" @click="handlePreview(file)" type="primary" v-if="file.url">预览</el-link>
          <!-- 删除仅在未禁用时显示 -->
          <el-link underline="never" @click="handleDelete(index)" type="danger" v-if="!disabled">删除</el-link>
        </div>
      </li>
    </transition-group>
  </div>
  <!-- 预览弹窗 -->
  <el-dialog v-model="previewVisible" title="文件预览" width="800px" append-to-body>
    <img v-if="isImageFile(previewFileUrl)" :src="previewFileUrl"
      style="display: block; max-width: 100%; margin: 0 auto" />
    <iframe v-else-if="isPdfFile(previewFileUrl)" :src="previewFileUrl"
      style="width: 100%; height: 600px; border: none;" />
    <div v-else style="text-align: center; padding: 50px;">
      <p>该文件类型不支持预览</p>
      <el-button type="primary" @click="downloadFile(previewFileUrl)">下载文件</el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import { getCurrentInstance, ref, computed, watch } from "vue";
import { getToken } from "@/utils/auth";
import { toRaw } from 'vue';

const props = defineProps({
  modelValue: [String, Object, Array],
  // 上传接口地址
  action: {
    type: String,
    default: "/ossUpload/uploadFiles"
  },
  // 上传携带的参数
  data: {
    type: Object
  },
  // 数量限制
  limit: {
    type: Number,
    default: 5
  },
  // 大小限制(MB)
  fileSize: {
    type: Number,
    default: 10
  },
  // 文件类型（MIME），例如 ['application/pdf', 'image/png']
  fileType: {
    type: Array,
    default: () => [
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "text/plain",
      "application/pdf",
      // 图片类 MIME（新增）
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/bmp",
      "image/webp",
      "image/svg+xml"
    ]
  },
  // 是否显示提示
  isShowTip: {
    type: Boolean,
    default: true
  },
  // 文件回显地址
  baseUrl : {
    type: String,
    default: import.meta.env.VITE_BASE_IMG_URL
  },  
  // 禁用组件（仅查看文件）
  disabled: {
    type: Boolean,
    default: false
  }
});

const { proxy } = getCurrentInstance();
const emit = defineEmits();
const number = ref(0);
const uploadList = ref([]);
const baseUrl = props.baseUrl || import.meta.env.VITE_APP_BASE_API;
const uploadFileUrl = ref(import.meta.env.VITE_APP_BASE_API + props.action); // 上传文件服务器地址
const headers = ref({ Authorization: "Bearer " + getToken() });
const fileList = ref([]);
const showTip = computed(
  () => props.isShowTip && (props.fileType || props.fileSize)
);

// 根据 fileType 生成 accept 属性字符串
const acceptAttr = computed(() => {
  try {
    if (!Array.isArray(props.fileType) || props.fileType.length === 0) return undefined;
    return props.fileType.join(',');
  } catch (e) {
    return undefined;
  }
});

watch(() => props.modelValue, val => {
  if (val) {
    let temp = 1;
    let list = [];
    // 只支持对象数组，使用toRaw脱钩
    if (Array.isArray(val)) {
      list = toRaw(val);
    } else {
      list = [];
    }
    // 将数组转为对象数组，创建新对象，不修改原对象
    fileList.value = list.map(item => ({
      ...item,  // 因为已经脱钩，直接展开
      uid: new Date().getTime() + temp++  // 添加uid但不影响原对象
    }));
  } else {
    fileList.value = [];
    return [];
  }
},{ immediate: true });

// 上传前校检格式和大小
function handleBeforeUpload(file) {
  // 使用 MIME 类型进行校验（不再使用文件后缀名）
  if (props.fileType.length) {
    // 直接使用 props.fileType 作为允许的 MIME 列表
    const allowMimes = new Set(props.fileType.map(t => String(t).toLowerCase()));
    if (!allowMimes.has(String(file.type).toLowerCase())) {
      proxy.$modal.msgError(`文件格式不正确，请上传${props.fileType.join("/")}格式文件!`);
      return false;
    }
  }
  // 校检文件名是否包含特殊字符
  if (file.name.includes(',')) {
    proxy.$modal.msgError('文件名不正确，不能包含英文逗号!');
    return false;
  }
  // 校检文件大小
  if (props.fileSize) {
    const isLt = file.size / 1024 / 1024 < props.fileSize;
    if (!isLt) {
      proxy.$modal.msgError(`上传文件大小不能超过 ${props.fileSize} MB!`);
      return false;
    }
  }
  proxy.$modal.loading("正在上传文件，请稍候...");
  number.value++;
  return true;
}

// 文件个数超出
function handleExceed() {
  proxy.$modal.msgError(`上传文件数量不能超过 ${props.limit} 个!`);
}

// 上传失败
function handleUploadError(err) {
  proxy.$modal.msgError("上传文件失败");
  proxy.$modal.closeLoading();
}

// 上传成功回调
function handleUploadSuccess(res, file) {
  if (res.code === 200 && res.data) {
    uploadList.value.push({ name: res.data.name, url: res.data.url });
    uploadedSuccessfully();
  } else {
    number.value--;
    proxy.$modal.closeLoading();
    proxy.$modal.msgError(res.msg);
    proxy.$refs.fileUpload.handleRemove(file);
    uploadedSuccessfully();
  }
}

// 删除文件
function handleDelete(index) {
  fileList.value.splice(index, 1);
  const emitValue = listToArray(fileList.value);
  // 使用JSON转换确保断开响应式引用
  emit("update:modelValue", emitValue);
}

// 上传结束处理
function uploadedSuccessfully() {
  if (number.value > 0 && uploadList.value.length === number.value) {
    fileList.value = fileList.value.filter(f => f.url !== undefined).concat(uploadList.value);
    uploadList.value = [];
    number.value = 0;
    const emitValue = listToArray(fileList.value);
    // 使用JSON转换确保断开响应式引用
    console.log('emitValue', emitValue);
    emit("update:modelValue", emitValue);
    proxy.$modal.closeLoading();
  }
}

// 获取文件名称
function getFileName(name) {
  // 如果是url那么取最后的名字 如果不是直接返回
  if (name.lastIndexOf("/") > -1) {
    return name.slice(name.lastIndexOf("/") + 1);
  } else {
    return name;
  }
}

// 对象转成数组，严格只返回name和url字段
function listToArray(list) {
  return list.filter(item => item.url).map(item => ({
    name: item.name,
    url: item.url
  }));
}

// 预览相关
const previewVisible = ref(false);
const previewFileUrl = ref("");
const previewFileType = ref("");

/**
 * 处理文件预览
 * 支持图片直接展示、PDF 内嵌预览，其他类型提供下载
 * @param {Object} file - 文件对象（包含url/name等字段）
 * @returns {void}
 */
function handlePreview(file) {
  if (!file || !file.url) return;
  previewFileUrl.value = baseUrl + file.url;
  const ext = (file.url.split(".").pop() || '').toLowerCase();
  previewFileType.value = ext;
  previewVisible.value = true;
}

/**
 * 判断是否为图片文件
 * @param {string} url - 文件URL
 * @returns {boolean} 是否为图片文件
 */
function isImageFile(url) {
  if (!url) return false;
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
  const extension = url.split('.').pop()?.toLowerCase();
  return imageExtensions.includes(extension);
}

/**
 * 判断是否为PDF文件
 * @param {string} url - 文件URL
 * @returns {boolean} 是否为PDF文件
 */
function isPdfFile(url) {
  if (!url) return false;
  return url.toLowerCase().endsWith('.pdf');
}

/**
 * 下载文件
 * @param {string} url - 文件URL
 */
function downloadFile(url) {
  const link = document.createElement('a');
  link.href = url;
  link.download = url.split('/').pop() || 'download';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
</script>

<style scoped lang="scss">
.upload-file-uploader {
  margin-bottom: 5px;
}
.upload-file-list .el-upload-list__item {
  border: 1px solid #e4e7ed;
  line-height: 2;
  margin-bottom: 10px;
  position: relative;
}
.upload-file-list .ele-upload-list__item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: inherit;
}
.ele-upload-list__item-content-action{
  margin-left: 10px;
}
.ele-upload-list__item-content-action .el-link {
  margin-right: 10px;
}
.el-upload-list__item{
  padding-left: 10px;
}
</style>
