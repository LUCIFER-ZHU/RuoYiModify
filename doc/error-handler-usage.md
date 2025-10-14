# 统一错误捕获与日志上报模块使用文档

## 概述

本模块提供了一个统一的错误捕获与处理系统，能够自动捕获Vue应用中的各种错误类型，并提供友好的用户提示和详细的错误日志记录。

---

## 功能特性

### 🎯 自动错误捕获
- **Vue组件错误**: 自动捕获组件内的错误和警告
- **全局JavaScript错误**: 捕获未处理的脚本错误
- **Promise拒绝**: 捕获未处理的Promise错误
- **资源加载错误**: 捕获图片、脚本、样式等资源加载失败
- **网络错误**: 识别并特殊处理网络请求错误

### 📊 智能错误分类
- **错误类型**: `vue_error`、`promise_rejection`、`resource_error`、`network_error`等
- **错误级别**: `low`、`medium`、`high`、`critical`四个级别
- **自动分级**: 根据错误类型自动分配合适的错误级别

### 💬 用户友好通知
- **分级通知**: 根据错误级别选择合适的通知方式
- **友好消息**: 将技术错误转换为用户易懂的提示
- **可配置**: 可开启/关闭用户通知功能

---

## 快速开始

### 1. 自动初始化

模块已在 `main.js` 中自动初始化，无需额外配置：

```javascript
// main.js 中已包含
import ErrorHandler from '@/utils/errorHandler'

ErrorHandler.init(app, {
  reportUrl: '/api/error/report', // 错误上报接口地址（暂时未启用）
  enableConsoleLog: process.env.NODE_ENV === 'development', // 开发环境启用控制台日志
  enableNotification: true, // 启用用户通知
  maxQueueSize: 50 // 错误队列最大长度
})
```

### 2. 全局方法

已挂载到Vue实例的全局方法：

```javascript
// 在组件中可直接使用
this.$reportError(error, extraInfo, level)
this.$getErrorStats()
```

---

## 使用方法

### 1. 自动捕获（推荐）

大多数错误会被自动捕获，无需额外代码：

```vue
<template>
  <div>
    <!-- 组件错误会被自动捕获 -->
    <button @click="triggerError">触发错误</button>
  </div>
</template>

<script setup>
// Vue组件错误、Promise错误等都会被自动捕获
function triggerError() {
  throw new Error('这是一个测试错误') // 会被自动捕获
}

// 异步错误也会被捕获
async function asyncError() {
  throw new Error('异步错误') // 会被自动捕获
}
</script>
```

### 2. 手动上报错误

在需要特殊处理的场景下手动上报：

```javascript
// Options API
export default {
  methods: {
    async handleSubmit() {
      try {
        await this.submitData()
      } catch (error) {
        // 手动上报错误，附加业务信息
        this.$reportError(error, {
          component: 'UserForm',
          action: 'submit',
          userId: this.currentUser.id
        })
      }
    }
  }
}
```

```javascript
// Composition API
import ErrorHandler, { ERROR_LEVELS } from '@/utils/errorHandler'

export default {
  setup() {
    const { proxy } = getCurrentInstance()
    
    const handleError = (error) => {
      // 使用全局方法
      proxy.$reportError(error, { 
        context: 'composition-api' 
      }, ERROR_LEVELS.HIGH)
      
      // 或直接调用模块方法
      ErrorHandler.reportError(error, {
        context: 'direct-call'
      }, ERROR_LEVELS.MEDIUM)
    }
    
    return { handleError }
  }
}
```

### 3. 业务错误处理

针对常见业务场景的错误处理：

```javascript
import { BusinessErrorHandler } from '@/utils/errorHandler.example'

// 表单验证错误
const validationErrors = {
  email: '邮箱格式不正确',
  password: '密码长度不足'
}
BusinessErrorHandler.handleValidationError(validationErrors, 'loginForm')

// 权限错误
BusinessErrorHandler.handlePermissionError('用户管理', '删除')

// 数据加载错误
try {
  const data = await loadUserData()
} catch (error) {
  BusinessErrorHandler.handleDataLoadError('用户数据', error)
}
```

### 4. API请求错误处理

在API请求中集成错误处理：

```javascript
// 在request.js中
import ErrorHandler, { ERROR_TYPES, ERROR_LEVELS } from '@/utils/errorHandler'

// 响应拦截器
service.interceptors.response.use(
  response => response,
  error => {
    // 自动上报网络错误
    ErrorHandler.reportError(error, {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText
    }, ERROR_LEVELS.MEDIUM)
    
    return Promise.reject(error)
  }
)
```

### 5. 错误统计查看

获取应用的错误统计信息：

```javascript
// 在组件中查看错误统计
export default {
  mounted() {
    // 获取错误统计
    const stats = this.$getErrorStats()
    console.log('错误统计:', stats)
    
    /* 返回格式：
    {
      total: 15,                    // 总错误数
      byType: {                     // 按类型统计
        vue_error: 5,
        network_error: 3,
        promise_rejection: 7
      },
      byLevel: {                    // 按级别统计
        low: 3,
        medium: 8,
        high: 3,
        critical: 1
      },
      recentErrors: [...]           // 最近10个错误
    }
    */
  }
}
```

---

## 错误类型与级别

### 错误类型 (ERROR_TYPES)

| 类型 | 说明 | 示例 |
|------|------|------|
| `vue_error` | Vue组件错误 | 组件渲染错误、计算属性错误 |
| `vue_warn` | Vue警告 | 组件警告信息 |
| `promise_rejection` | Promise拒绝 | 未捕获的异步错误 |
| `resource_error` | 资源加载错误 | 图片、脚本加载失败 |
| `script_error` | 脚本错误 | JavaScript语法错误 |
| `network_error` | 网络错误 | API请求失败 |
| `custom_error` | 自定义错误 | 手动上报的错误 |

### 错误级别 (ERROR_LEVELS)

| 级别 | 说明 | 用户通知 | 控制台输出 |
|------|------|----------|------------|
| `low` | 低级错误，不影响主要功能 | 无通知 | `console.info` |
| `medium` | 中级错误，影响部分功能 | 消息提示 | `console.warn` |
| `high` | 高级错误，影响核心功能 | 消息提示 | `console.error` |
| `critical` | 严重错误，系统无法正常运行 | 通知弹窗 | `console.error` |

---

## 配置选项

### 初始化配置

```javascript
ErrorHandler.init(app, {
  // 错误上报接口（暂时未启用）
  reportUrl: '/api/error/report',
  
  // 是否启用控制台日志（建议开发环境开启）
  enableConsoleLog: process.env.NODE_ENV === 'development',
  
  // 是否启用用户通知
  enableNotification: true,
  
  // 错误队列最大长度
  maxQueueSize: 50
})
```

### 运行时配置

```javascript
// 动态修改配置
const errorCollector = ErrorHandler.getCollector() // 假设提供此方法
errorCollector.enableNotification = false // 关闭用户通知
errorCollector.enableConsoleLog = true    // 开启控制台日志
```

---

## 高级用法

### 1. 错误边界组件

创建错误边界组件来捕获子组件错误：

```vue
<!-- ErrorBoundary.vue -->
<template>
  <div v-if="hasError" class="error-boundary">
    <h3>页面出现异常</h3>
    <p>请刷新页面重试，如果问题持续存在，请联系管理员。</p>
    <el-button @click="retry">重试</el-button>
  </div>
  <slot v-else />
</template>

<script>
export default {
  name: 'ErrorBoundary',
  data() {
    return {
      hasError: false,
      error: null
    }
  },
  errorCaptured(error, instance, info) {
    this.hasError = true
    this.error = error
    
    // 上报错误
    this.$reportError(error, {
      componentName: instance?.$options?.name || 'Unknown',
      errorInfo: info,
      boundaryComponent: 'ErrorBoundary'
    })
    
    return false // 阻止错误继续传播
  },
  methods: {
    retry() {
      this.hasError = false
      this.error = null
    }
  }
}
</script>
```

### 2. 自动重试机制

```javascript
import { ErrorRecoveryStrategy } from '@/utils/errorHandler.example'

// 带重试的API调用
async function fetchDataWithRetry() {
  return await ErrorRecoveryStrategy.retryWithBackoff(
    async () => {
      const response = await fetch('/api/data')
      if (!response.ok) throw new Error('请求失败')
      return response.json()
    },
    3, // 最大重试3次
    1000 // 初始延迟1秒
  )
}

// 带降级的功能
async function fetchDataWithFallback() {
  return await ErrorRecoveryStrategy.withFallback(
    () => fetchFromPrimaryAPI(),
    () => fetchFromCacheAPI()
  )
}
```

### 3. 性能监控

```javascript
// 监控长任务
if ('PerformanceObserver' in window) {
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach(entry => {
      if (entry.duration > 100) {
        ErrorHandler.reportError(
          `长任务检测: ${entry.duration}ms`,
          { duration: entry.duration },
          ERROR_LEVELS.LOW
        )
      }
    })
  })
  observer.observe({ entryTypes: ['longtask'] })
}
```

---

## 最佳实践

### 1. 错误分级原则

- **Low**: 警告信息、性能问题、非关键功能异常
- **Medium**: 业务逻辑错误、网络请求失败、表单验证错误
- **High**: 核心功能异常、组件渲染错误、权限错误
- **Critical**: 系统崩溃、安全问题、数据丢失风险

### 2. 错误信息编写

```javascript
// ❌ 不好的错误信息
throw new Error('error')

// ✅ 好的错误信息
throw new Error('用户登录失败: 用户名或密码错误')

// ✅ 带上下文的错误上报
this.$reportError(error, {
  action: 'login',
  username: form.username,
  timestamp: Date.now(),
  userAgent: navigator.userAgent
})
```

### 3. 避免错误循环

```javascript
// ❌ 可能导致无限循环
try {
  dangerousFunction()
} catch (error) {
  this.$reportError(error) // 如果reportError也出错会循环
}

// ✅ 安全的错误处理
try {
  dangerousFunction()
} catch (error) {
  try {
    this.$reportError(error)
  } catch (reportError) {
    console.error('错误上报失败:', reportError)
  }
}
```

### 4. 敏感信息过滤

```javascript
// 过滤敏感信息
const safeError = {
  ...error,
  extra: {
    ...error.extra,
    password: undefined, // 移除密码
    token: undefined,    // 移除token
    creditCard: undefined // 移除信用卡信息
  }
}
this.$reportError(safeError)
```

---

## 故障排除

### 常见问题

**Q: 错误没有被捕获？**
A: 检查是否在`main.js`中正确初始化了ErrorHandler，确保在Vue应用挂载之前调用`ErrorHandler.init(app)`。

**Q: 控制台没有错误日志？**
A: 检查`enableConsoleLog`配置是否为`true`，开发环境下默认开启。

**Q: 用户收到太多错误通知？**
A: 可以设置`enableNotification: false`关闭通知，或者调整错误级别，只有`medium`以上级别才会显示通知。

**Q: 错误队列占用内存过多？**
A: 调整`maxQueueSize`配置，默认50条，可以根据需要调整。

### 调试方法

```javascript
// 获取当前错误队列
const stats = this.$getErrorStats()
console.log('当前错误统计:', stats)

// 手动触发测试错误
this.$reportError('测试错误', { test: true }, 'low')

// 清空错误记录
ErrorHandler.clearErrors()
```
