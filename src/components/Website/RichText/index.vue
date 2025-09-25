<template>
  <div style="border: 1px solid #ccc;height: 100%;" class="rich-text-mn">
    <Toolbar :editor="editorRef" :default-config="toolbarConfig" style="border-bottom: 1px solid #ccc;" />
    <Editor v-model="valueHtml" :default-config="editorConfig"
      :style="{ 'height': `${height}px`, 'overflow-y': 'hidden' }" @on-created="handleCreated" @on-change="handleChange"
      @on-destroyed="handleDestroyed" @on-focus="handleFocus" @on-blur="handleBlur" @custom-alert="customAlert"
      @custom-paste="customPaste" />
    <!-- 图片预览弹窗 -->
    <el-dialog v-model="imgPreviewVisible" title="图片预览" width="800px" append-to-body>
      <img v-if="imgPreviewUrl" :src="imgPreviewUrl" style="display:block;max-width:100%;margin:0 auto;" />
    </el-dialog>
  </div>
</template>

<script setup>
  import '@wangeditor-next/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor-next/editor-for-vue'
import { getToken } from "@/utils/auth";
import { ElMessage } from "element-plus";
import axios from 'axios';

const webHost = import.meta.env.VITE_APP_BASE_API;
const obsHost = import.meta.env.VITE_BASE_IMG_URL;
const uploadUrl = webHost + '/ossUpload/uploadFiles';

const { proxy } = getCurrentInstance()
const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: String,
    required: false
  },
  height: {
    type: Number,
    default: 455
  },
  disabled: {
    type: Boolean,
    default: false
  },
  toolbarConfig: {
    type: Object,
    default: {}
  }
})
// 编辑器实例，必须用 shallowRef，重要！
const editorRef = shallowRef()
const height = ref(props.height)

// 内容 HTML
const valueHtml = ref('')

// 图片预览状态
const imgPreviewVisible = ref(false)
const imgPreviewUrl = ref('')

// 记录已绑定的点击事件处理器，便于卸载
let unbindImgClick = null

watch(
  () => valueHtml.value,
  (newValue) => {
    emit('update:modelValue', newValue)
  }
)
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== valueHtml.value) {
      valueHtml.value = newValue
    }
  },
  { immediate: true }
)

onMounted(() => { })

props.toolbarConfig.excludeKeys = [
  'insertLink',
  'insertVideo',
  'todo',
  'group-video',
  'fullScreen'
]

const editorConfig = {
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: {
      fieldName: 'file',
      // 跨域是否传递 cookie ，默认为 false
      withCredentials: true,
      // 小于该值就插入 base64 格式（而不上传），默认为 0
      base64LimitSize: 5 * 1024,
      // 单个文件的最大体积限制，默认为 2M
      maxFileSize: 10 * 1024 * 1024, // 5M
      // 最多可上传几个文件，默认为 100
      maxNumberOfFiles: 20,

      // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
      allowedFileTypes: [],

      // 将 meta 拼接到 url 参数中，默认 false
      metaWithUrl: false,

      // 自定义增加 http  header
      headers: { Authorization: "Bearer " + getToken() },
      // 超时时间，默认为 10 秒
      timeout: 5 * 1000, // 5 秒
      // 上传之前触发
      onBeforeUpload(file) {
        // file 选中的文件，格式如 { key: file }
        let fileObj = Object.values(file)[0].data
        const isJPG = fileObj.type == 'image/jpg' || fileObj.type == 'image/jpeg' || fileObj.type == 'image/png'
        if (!isJPG) {
         ElMessage.warn('图片只能是 JPG、GIF、PNG 格式!')
        }
        // 判断图片宽高
        // 定义 filereader对象

        // 判断图片大小
        let isLt = fileObj.size / 1024 / 1024 < 5 // 判断是否小于5M
        if (!isLt) {
         ElMessage.warn('图片大小不能超过5M! 请重新上传')
        }
        console.log(file, 'before')
        console.log('isJPG, isSize, sisLt', isJPG, isLt)
        if (!isJPG) {
          return {}
        } else if (!isLt) {
          return {}
        } else {
          return file
        }
        // 可以 return
        // 1. return file 或者 new 一个 file ，接下来将上传
        // 2. return false ，不上传这个 file
      },
      // 上传进度的回调函数
      onProgress(progress) {
        // progress 是 0-100 的数字
        console.log('progress', progress)
      },
      // 单个文件上传成功之后
      onSuccess(file, res) {
        console.log(`${file.name} 上传成功`, res)
      },
      // 自定义插入图片
      // customInsert(res, insertFn) {
      //   console.log(112, res);

      // },
      // 单个文件上传失败
      // onFailed(file, res) {
      //     console.log(`${file.name} 上传失败`, res)
      // },
      // 上传错误，或者触发 timeout 超时
      onError(file, err, res) {
        console.log(`${file.name} 上传出错`, err, res)
      }
    },

    //上传视频配置
    // uploadVideo: {
    //   server: webHost + '/ossUpload/upload',
    //   // form-data fieldName ，默认值 'wangeditor-uploaded-video'
    //   fieldName: 'file',
    //   // 跨域是否传递 cookie ，默认为 false
    //   withCredentials: true,
    //   // 小于该值就插入 base64 格式（而不上传），默认为 0
    //   base64LimitSize: 10 * 1024,
    //   // 将 meta 拼接到 url 参数中，默认 false
    //   metaWithUrl: false,
    //   // 自定义增加 http  header
    //   headers: headerObj,
    //   // 跨域是否传递 cookie ，默认为 false
    //   withCredentials: true,
    //   // 超时时间，默认为 5 秒
    //   timeout: 10 * 1000, // 10 秒
    //   // 单个文件的最大体积限制，默认为 10M
    //   maxFileSize: 30 * 1024 * 1024, // 30M
    //   // 最多可上传几个文件，默认为 5
    //   maxNumberOfFiles: 3,
    //   // 选择文件时的类型限制，默认为 ['video/*'] 。如不想限制，则设置为 []
    //   allowedFileTypes: [],
    //   // 上传之前触发
    //   onBeforeUpload(file) {
    //     // JS 语法
    //     // file 选中的文件，格式如 { key: file }
    //     let fileObj = Object.values(file)[0].data
    //     const isVIDEO = fileObj.type == 'video/mp4' || fileObj.type == 'video/flv' || fileObj.type == 'video/avi'
    //     if (!isVIDEO) {
    //      ElMessage.warn('视频只能是 video/mp4,video/flv,video/avi 格式!')
    //     }
    //     // 判断video宽高
    //     // 定义 filereader对象

    //     // 判断图片大小
    //     let isLt = fileObj.size / 1024 / 1024 < 20 // 判断是否小于20M
    //     if (!isLt) {
    //      ElMessage.warn('video大小不能超过30M! 请重新上传')
    //     }
    //     console.log(file, 'before')
    //     console.log('isVIDEO, isSize, sisLt', isVIDEO, isLt)
    //     if (!isVIDEO) {
    //       return false
    //     } else if (!isLt) {
    //       return false
    //     } else {
    //       return file
    //     }

    //     // 可以 return
    //     // 1. return file 或者 new 一个 file ，接下来将上传
    //     // 2. return false ，不上传这个 file
    //   },

    //   // 上传进度的回调函数
    //   onProgress(progress) {       // JS 语法
    //     // progress 是 0-100 的数字
    //     console.log('progress', progress)
    //   },

    //   // 单个文件上传成功之后
    //   onSuccess(file, res) {          // JS 语法
    //     console.log(`${file.name} 上传成功`, res)
    //   },


    //   // 单个文件上传失败
    //   onFailed(file, res) {          // JS 语法
    //     console.log(`${file.name} 上传失败`, res)
    //   },

    //   // 上传错误，或者触发 timeout 超时
    //   onError(file, err, res) {               // JS 语法
    //     console.log(`${file.name} 上传出错`, err, res)
    //   },

    //   // 自定义插入图片
    //   customInsert(res, insertFn) {
    //     // res 即服务端的返回结果
    //     // 从 res 中找到 url alt href 
    //     insertFn(isExternal(res.fileName) ? res.fileName : webHost + res.fileName, '', '')
    //   },
    // }
  },
  hoverbarKeys: {
    // image: {
    //   menuKeys: []
    // }
  }
}

// 自定义上传图片函数
editorConfig.MENU_CONF.uploadImage.customUpload = async (file, insertFn) => {
  // 创建FormData对象，用于存储要上传的文件
  const formData = new FormData();
  formData.append('file', file);
  // 发起POST请求上传文件
  try {
    const response = await axios.post(uploadUrl, formData, {
      headers: {
        Authorization: "Bearer " + getToken(),
        'Content-Type': 'multipart/form-data',
      },
    });

    // 处理上传成功后的逻辑
    if (response.status === 200) {
      const url = obsHost + response.data?.data?.url; // 上传成功后返回的图片URL
      insertFn(url, '', ''); // 插入图片到编辑器中
    } else {
      // 处理上传失败的情况
      console.error('Upload failed:', response);
    }
  } catch (error) {
    // 处理请求错误
    console.error('Error uploading file:', error);
  }
};

// 组件销毁时，也及时销毁编辑器，重要！
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

// 编辑器回调函数
const handleCreated = (editor) => {
  // console.log('created',  editor)
  editorRef.value = editor // 记录 editor 实例，重要！
  if (props.disabled) {
    editor.disable()
  } else {
    editor.enable()
  }

  // 绑定图片点击预览：使用官方 API 获取可编辑容器并代理 <img> 点击
  try {
    const contentArea = editor.getEditableContainer && editor.getEditableContainer();
    if (contentArea) {
      const handler = (e) => {
        const target = e.target;
        if (target && target.tagName === 'IMG') {
          imgPreviewUrl.value = target.getAttribute('src') || '';
          if (imgPreviewUrl.value) {
            imgPreviewVisible.value = true;
          }
        }
      };
      contentArea.addEventListener('click', handler);
      // 缓存解绑函数
      unbindImgClick = () => contentArea.removeEventListener('click', handler);
    }
  } catch (err) {
    // 忽略非关键错误
    console.warn('绑定图片预览事件失败', err);
  }
}
const handleChange = (editor) => {
  // console.log('change:', editor.getHtml())
}
const handleDestroyed = (editor) => {
  // console.log('destroyed', editor)
  // 卸载图片点击事件
  try {
    unbindImgClick && unbindImgClick();
    unbindImgClick = null;
  } catch (_) {}
}
const handleFocus = (editor) => {
  //  console.log('focus', editor)
}
const handleBlur = (editor) => {
  // console.log('blur', editor)
}
const customAlert = (info, type) => {
  // alert(`【自定义提示】${type} - ${info}`)
}
const customPaste = (editor, event, callback) => {
  // console.log('ClipboardEvent 粘贴事件对象', event)
  // 自定义插入内容
  // editor.insertText('xxx')

  // 返回值（注意，vue 事件的返回值，不能用 return）
  // callback(false) // 返回 false ，阻止默认粘贴行为
  callback(true)
  // 返回 true ，继续默认的粘贴行为
}

/**
 * 主动触发一次图片点击预览（供外部调试/扩展）
 * @param {string} url 图片地址
 * @returns {void}
 */
function previewImage(url) {
  if (!url) return;
  imgPreviewUrl.value = url;
  imgPreviewVisible.value = true;
}
</script>

<style scoped>
#editor {
  width: 100%;
  height: 100%;
}
</style>