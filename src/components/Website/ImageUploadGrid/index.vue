<template>
  <div class="component-upload-image">
    <div class="upload-image-list">
      <!-- 自定义文件列表显示 -->
      <div v-if="fileList.length > 0" class="custom-file-list">
        <div v-for="(file, index) in fileList" :key="index" class="custom-file-item"
          @click="handlePictureCardPreview(file)">
          <div v-if="isPdfFile(file.url)" class="pdf-file-item">
            <el-icon class="pdf-icon">
              <Document />
            </el-icon>
            <span class="file-name">{{ file.name || getFileName(file.url) }}</span>
          </div>
          <div v-else class="image-file-item">
            <img :src="file.url" :alt="file.name" class="file-preview" />
          </div>
          <el-button v-if="!disabled" type="danger" size="small" class="delete-btn" @click.stop="handleDelete(file)"
            icon="Delete" />
        </div>
      </div>

      <el-upload multiple :action="uploadImgUrl" list-type="picture-card" :on-success="handleUploadSuccess"
        :before-upload="handleBeforeUpload" :data="data" :limit="limit" :on-error="handleUploadError"
        :on-exceed="handleExceed" ref="imageUpload" :before-remove="handleDelete" :show-file-list="false"
        :headers="headers" :file-list="fileList" :on-preview="handlePictureCardPreview"
        :class="{ hide: fileList.length >= limit || disabled }" :disabled="disabled">
        <el-icon class="avatar-uploader-icon">
          <plus />
        </el-icon>
      </el-upload>
    </div>

    <!-- 上传提示 -->
    <div class="el-upload__tip" v-if="showTip">
      请上传
      <template v-if="fileSize">
        大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b>
      </template>
      <template v-if="fileType">
        格式为 <b style="color: #f56c6c">{{ fileType.join("、") }}</b>
      </template>
      的文件
    </div>

    <el-dialog v-model="dialogVisible" title="预览" width="800px" append-to-body>
      <img v-if="isImageFile(dialogImageUrl)" :src="dialogImageUrl"
        style="display: block; max-width: 100%; margin: 0 auto" />
      <iframe v-else-if="isPdfFile(dialogImageUrl)" :src="dialogImageUrl"
        style="width: 100%; height: 600px; border: none;" />
      <div v-else style="text-align: center; padding: 50px;">
        <p>该文件类型不支持预览</p>
        <el-button type="primary" @click="downloadFile(dialogImageUrl)">下载文件</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { getToken } from "@/utils/auth";
import { isExternal } from "@/utils/validate";
import { Document } from '@element-plus/icons-vue';

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
  // 图片数量限制
  limit: {
    type: Number,
    default: 5,
  },
  // 大小限制(MB)
  fileSize: {
    type: Number,
    default: 10,
  },
  // 文件类型（MIME），例如 ['image/png', 'image/jpeg', 'application/pdf']
  fileType: {
    type: Array,
    default: () => ["image/png", "image/jpeg", "application/pdf"],
  },
  // 是否显示提示
  isShowTip: {
    type: Boolean,
    default: true
  },
  // 图片回显地址
  baseUrl: {
    type: String,
    default: import.meta.env.VITE_BASE_IMG_URL
  },
  // 是否禁用上传
  disabled: {
    type: Boolean,
    default: false
  }
});

const { proxy } = getCurrentInstance();
const emit = defineEmits();
const number = ref(0);
const uploadList = ref([]);
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const baseUrl = props.baseUrl || import.meta.env.VITE_APP_BASE_API;
const uploadImgUrl = ref(import.meta.env.VITE_APP_BASE_API + props.action); // 上传的图片服务器地址
const headers = ref({ Authorization: "Bearer " + getToken() });
const fileList = ref([]);
const showTip = computed(
  () => props.isShowTip && (props.fileType || props.fileSize)
);

watch(() => props.modelValue, val => {
  if (val) {
    // 首先将值转为数组
    const list = Array.isArray(val) ? val : val.split(",");
    // 然后将数组转为对象数组（兼容字符串或对象）
    fileList.value = list.map((item) => {
      // 字符串：可能是相对路径或完整URL
      if (typeof item === "string") {
        const isAbs = item.indexOf(baseUrl) > -1 || isExternal(item);
        const absUrl = isAbs ? item : baseUrl + (item.startsWith('/') ? item : ('/' + item));
        return { name: getFileName(absUrl), url: absUrl };
      }
      // 对象：优先使用 url 字段
      if (item && typeof item === 'object' && item.url) {
        const urlVal = item.url;
        const isAbs = urlVal.indexOf(baseUrl) > -1 || isExternal(urlVal);
        const absUrl = isAbs ? urlVal : baseUrl + (urlVal.startsWith('/') ? urlVal : ('/' + urlVal));
        return { name: item.name || getFileName(absUrl), url: absUrl };
      }
      return item;
    });
    
    // 如果输入的是数组格式，立即转换为字符串格式发送给父组件
    if (Array.isArray(val)) {
      emit("update:modelValue", listToString(fileList.value));
    }
  } else {
    fileList.value = [];
  }
}, { deep: true, immediate: true });

// 上传前loading加载
function handleBeforeUpload(file) {
  // 仅使用 MIME 类型进行校验，不使用文件后缀名
  let isValidFile = false;
  if (props.fileType.length) {
    // 直接使用 props.fileType 作为允许的 MIME 列表
    const allowMimes = new Set(props.fileType.map(t => String(t).toLowerCase()));
    isValidFile = allowMimes.has(String(file.type).toLowerCase());
  } else {
    // 默认支持图片和 PDF（基于 MIME）
    isValidFile = file.type.startsWith('image/') || file.type === 'application/pdf';
  }
  if (!isValidFile) {
    proxy.$modal.msgError(`文件格式不正确，请上传${props.fileType.join("/")}格式文件!`);
    return false;
  }
  if (file.name.includes(',')) {
    proxy.$modal.msgError('文件名不正确，不能包含英文逗号!');
    return false;
  }
  if (props.fileSize) {
    const isLt = file.size / 1024 / 1024 < props.fileSize;
    if (!isLt) {
      proxy.$modal.msgError(`上传文件大小不能超过 ${props.fileSize} MB!`);
      return false;
    }
  }
  proxy.$modal.loading("正在上传文件，请稍候...");
  number.value++;
}

// 文件个数超出
function handleExceed() {
  proxy.$modal.msgError(`上传文件数量不能超过 ${props.limit} 个!`);
}

// 上传成功回调
function handleUploadSuccess(res, file) {
  console.log('imageUploadGrid', res);
  if (res.code === 200) {
    const url = res.data?.url || res.url || res.msg;
    const nameFromServer = res.data?.name;
    if (typeof url === "string") {
      let tempUrl = '';
      if (url.startsWith('/')) {
        tempUrl = url;
      } else {
        tempUrl = '/' + url;
      }
      const absUrl = (tempUrl.indexOf(baseUrl) === -1 && !isExternal(tempUrl)) ? (baseUrl + tempUrl) : tempUrl;
      const finalName = nameFromServer || getFileName(absUrl);
      uploadList.value.push({ name: finalName, url: absUrl });
    }

    uploadedSuccessfully();
  } else {
    number.value--;
    proxy.$modal.closeLoading();
    proxy.$modal.msgError(res.msg);
    proxy.$refs.imageUpload.handleRemove(file);
    uploadedSuccessfully();
  }
}

// 删除图片
function handleDelete(file) {
  const findex = fileList.value.map(f => f.name).indexOf(file.name);
  if (findex > -1 && uploadList.value.length === number.value) {
    fileList.value.splice(findex, 1);
    emit("update:modelValue", listToString(fileList.value));
    return false;
  }
}

// 上传结束处理
function uploadedSuccessfully() {
  if (number.value > 0 && uploadList.value.length === number.value) {
    fileList.value = fileList.value.filter(f => f.url !== undefined).concat(uploadList.value);
    uploadList.value = [];
    number.value = 0;
    emit("update:modelValue", listToString(fileList.value));
    proxy.$modal.closeLoading();
  }
}

// 上传失败
function handleUploadError() {
  proxy.$modal.msgError("上传文件失败");
  proxy.$modal.closeLoading();
}

// 预览
function handlePictureCardPreview(file) {
  dialogImageUrl.value = file.url;
  dialogVisible.value = true;
}

/**
 * 将文件对象数组转换为逗号分隔的字符串
 * @param {Array} list - 文件对象数组，每个对象包含url属性
 * @param {string} separator - 分隔符，默认为逗号
 * @returns {string} 转换后的字符串
 */
function listToString(list, separator) {
  separator = separator || ",";
  // 使用filter和map简化逻辑，避免手动拼接字符串
  const urlList = list
    .filter(item => item && item.url && item.url.indexOf("blob:") !== 0)
    .map(item => item.url.replace(baseUrl, ""));
  
  return urlList.join(separator);
}

// // 将内部文件对象列表转换为仅包含相对路径的字符串数组，用于对外 v-model
// function listToArray(list) {
//   return list
//     .filter(item => item.url && item.url.indexOf("blob:") !== 0)
//     .map(item => {
//       const relative = item.url.replace(baseUrl, "");
//       // 统一为以 / 开头的相对路径
//       const normalized = relative.startsWith('/') ? relative : ('/' + relative);
//       return normalized;
//     });
// }

// 将内部文件对象列表转换为[{name,url}]数组（相对路径），用于对外v-model
// function listToArray(list) {
//   return list
//     .filter(item => item.url && item.url.indexOf("blob:") !== 0)
//     .map(item => {
//       const relative = item.url.replace(baseUrl, "");
//       // 统一为以 / 开头的相对路径
//       const normalized = relative.startsWith('/') ? relative : ('/' + relative);
//       return {
//         // name 优先使用后端返回的 name（在上传成功时已存入 item.name）
//         name: item.name || getFileName(normalized),
//         url: normalized
//       };
//     });
// }


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

/**
 * 获取文件名
 * @param {string} url - 文件URL
 * @returns {string} 文件名
 */
function getFileName(url) {
  if (!url) return '';
  const fileName = url.split('/').pop() || '';
  // 如果文件名太长，截取前20个字符并添加省略号
  return fileName.length > 20 ? fileName.substring(0, 20) + '...' : fileName;
}
</script>

<style scoped lang="scss">
// .el-upload--picture-card 控制加号部分
:deep(.hide .el-upload--picture-card) {
  display: none;
}

.upload-image-list {
  display: flex;
}

// 自定义文件列表样式
.custom-file-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-right: 8px;
}

.custom-file-item {
  position: relative;
  width: 148px;
  height: 148px;
  border: 1px solid #c0ccda;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: #409eff;

    .delete-btn {
      opacity: 1;
    }
  }
}

.pdf-file-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 8px;
  background-color: #f5f7fa;

  .pdf-icon {
    font-size: 32px;
    color: #f56c6c;
    margin-bottom: 8px;
  }

  .file-name {
    font-size: 12px;
    color: #606266;
    text-align: center;
    word-break: break-all;
    line-height: 1.2;
  }
}

.image-file-item {
  width: 100%;
  height: 100%;

  .file-preview {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.delete-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  opacity: 0;
  transition: opacity 0.3s;
  z-index: 10;
}
</style>