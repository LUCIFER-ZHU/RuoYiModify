import { createApp, defineAsyncComponent  } from 'vue'

import Cookies from 'js-cookie'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import locale from 'element-plus/es/locale/lang/zh-cn'
import horizontalScroll from 'el-table-horizontal-scroll'

import '@/assets/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import directive from './directive' // directive

// 注册指令
import plugins from './plugins' // plugins
import { download } from '@/utils/request'

// svg图标
import 'virtual:svg-icons-register'
import SvgIcon from '@/components/SvgIcon'
import elementIcons from '@/components/SvgIcon/svgicon'

import './permission' // permission control

// 统一错误处理
import ErrorHandler from '@/utils/errorHandler'

import { useDict } from '@/utils/dict'
import { useDictMn } from '@/utils/dictMn'
import { parseTime, resetForm, addDateRange, handleTree, selectDictLabel, selectDictLabels } from '@/utils/ruoyi'

// 分页组件
import Pagination from '@/components/Pagination'
// 自定义表格工具组件
import RightToolbar from '@/components/RightToolbar'
// 富文本组件
import Editor from "@/components/Editor"
// 文件上传组件
import FileUpload from "@/components/FileUpload"
// 图片上传组件
import ImageUpload from "@/components/ImageUpload"
// 图片预览组件
import ImagePreview from "@/components/ImagePreview"
// 字典标签组件
import DictTag from '@/components/DictTag'


// 自定义
// 图片上传组件
import ImageUploadGrid from "@/components/Website/ImageUploadGrid"
import DictTagMn from "@/components/Website/DictTagMn"
import RichTextMn from "@/components/Website/RichText"
import FileUploadMn from "@/components/Website/FileUploadMn"
// 异步组件
const asyncComponents = {
  DocumentPreviewMn: () => import('@/components/Website/DocumentPreviewMn'),
}



const app = createApp(App)

// 全局方法挂载
app.config.globalProperties.useDict = useDict
app.config.globalProperties.useDictMn = useDictMn
app.config.globalProperties.download = download
app.config.globalProperties.parseTime = parseTime
app.config.globalProperties.resetForm = resetForm
app.config.globalProperties.handleTree = handleTree
app.config.globalProperties.addDateRange = addDateRange
app.config.globalProperties.selectDictLabel = selectDictLabel
app.config.globalProperties.selectDictLabels = selectDictLabels

// 全局错误上报方法
app.config.globalProperties.$reportError = ErrorHandler.reportError
app.config.globalProperties.$getErrorStats = ErrorHandler.getErrorStats

// 全局组件挂载
app.component('DictTag', DictTag)
app.component('Pagination', Pagination)
app.component('FileUpload', FileUpload)
app.component('ImageUpload', ImageUpload)
app.component('ImagePreview', ImagePreview)
app.component('RightToolbar', RightToolbar)
app.component('Editor', Editor)

// 自定义
app.component('ImageUploadGrid', ImageUploadGrid)
app.component('DictTagMn', DictTagMn)
app.component('RichTextMn', RichTextMn)
app.component('FileUploadMn', FileUploadMn)
// 遍历注册异步组件
Object.entries(asyncComponents).forEach(([name, loader]) => {
  app.component(name, defineAsyncComponent(loader))
})

app.use(router)
app.use(store)
app.use(plugins)
app.use(elementIcons)
app.component('svg-icon', SvgIcon)
app.use(horizontalScroll)

directive(app)

// 使用element-plus 并且设置全局的大小
app.use(ElementPlus, {
  locale: locale,
  // 支持 large、default、small
  size: Cookies.get('size') || 'default'
})

// 初始化错误处理器
ErrorHandler.init(app, {
  reportUrl: '/api/error/report', // 错误上报接口地址
  enableConsoleLog: true, // 开发环境启用控制台日志
  enableNotification: true, // 启用用户通知
  maxQueueSize: 50 // 错误队列最大长度
})

app.mount('#app')
