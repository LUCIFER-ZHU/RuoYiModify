<!--
  WebSocket 使用示例组件
  @description 展示如何在 Vue 组件中使用 WebSocket 实时通信
  @author ERP System
-->

<template>
  <div class="websocket-example">

    <!-- 二维码生成器 -->
    <el-card>
      <template #header>
        <div class="card-header">
          <span>二维码生成器</span>
        </div>
      </template>
      
      <el-form>
        <el-form-item label="内容">
          <el-input 
            v-model="imgSrc" 
            placeholder="请输入要生成二维码的内容（URL、文本等）"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button 
            type="primary" 
            @click="handleGenerateQRCode"
            :disabled="!imgSrc"
          >
            生成二维码
          </el-button>
          
          <el-button 
            v-if="qrcodeUrl" 
            @click="handleDownloadQRCode"
          >
            下载二维码
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 二维码显示区域 -->
      <div v-if="qrcodeUrl" class="qrcode-container">
        <el-divider>生成的二维码</el-divider>
        <div class="qrcode-display">
          <img :src="qrcodeUrl" alt="二维码">
        </div>
      </div>
    </el-card>

    <!-- 连接状态 -->
    <el-card class="status-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>WebSocket 连接状态</span>
          <el-tag :type="statusTagType">{{ statusText }}</el-tag>
        </div>
      </template>
      
      <el-descriptions :column="2" border>
        <el-descriptions-item label="连接状态">
          <el-tag :type="isConnected ? 'success' : 'danger'">
            {{ isConnected ? '已连接' : '未连接' }}
          </el-tag>
        </el-descriptions-item>
        
        <el-descriptions-item label="状态码">
          {{ status }}
        </el-descriptions-item>
        
        <el-descriptions-item label="已订阅主题">
          {{ subscribedTopics.length }}
        </el-descriptions-item>
        
        <el-descriptions-item label="收到消息数">
          {{ messageCount }}
        </el-descriptions-item>
      </el-descriptions>

      <el-divider />

      <div style="text-align: center;">
        <el-button 
          type="primary" 
          :loading="connectLoading"
          :disabled="isConnected"
          @click="handleInitWebSocket"
        >
          {{ isConnected ? '已连接' : '手动初始化连接' }}
        </el-button>
      </div>
    </el-card>

    <!-- 订阅管理 -->
    <el-card class="subscribe-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>订阅管理</span>
        </div>
      </template>

      <el-form :inline="true">
        <el-form-item label="主题地址">
          <el-input 
            v-model="topicInput" 
            placeholder="/topic/example"
            style="width: 300px"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button 
            type="primary" 
            :disabled="!isConnected"
            @click="handleSubscribe"
          >
            订阅
          </el-button>
        </el-form-item>
      </el-form>

      <el-divider />

      <div class="topic-list">
        <h4>已订阅主题列表：</h4>
        <el-tag
          v-for="topic in subscribedTopics"
          :key="topic"
          closable
          @close="handleUnsubscribe(topic)"
          style="margin-right: 10px; margin-bottom: 10px"
        >
          {{ topic }}
        </el-tag>
        
        <el-empty 
          v-if="subscribedTopics.length === 0" 
          description="暂无订阅"
          :image-size="80"
        />
      </div>
    </el-card>

    <!-- 消息列表 -->
    <el-card class="message-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>消息列表</span>
          <el-button 
            size="small" 
            text 
            @click="clearMessages"
          >
            清空
          </el-button>
        </div>
      </template>

      <el-timeline>
        <el-timeline-item
          v-for="(msg, index) in messages"
          :key="index"
          :timestamp="msg.timestamp"
          placement="top"
          :type="msg.type"
        >
          <el-card>
            <h4>来自: {{ msg.topic }}</h4>
            <pre>{{ JSON.stringify(msg.data, null, 2) }}</pre>
          </el-card>
        </el-timeline-item>
      </el-timeline>

      <el-empty 
        v-if="messages.length === 0" 
        description="暂无消息"
        :image-size="100"
      />
    </el-card>

    <!-- 快捷订阅 -->
    <el-card class="quick-subscribe-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>快捷订阅</span>
        </div>
      </template>

      <el-space wrap>
        <el-button 
          type="success" 
          :disabled="!isConnected"
          @click="subscribeUserChannel"
        >
          订阅个人通知
        </el-button>
        
        <el-button 
          type="info" 
          :disabled="!isConnected"
          @click="subscribeSystemChannel"
        >
          订阅系统广播
        </el-button>
        
        <el-button 
          type="warning" 
          :disabled="!isConnected"
          @click="subscribeOrderUpdates"
        >
          订阅订单更新
        </el-button>
      </el-space>
    </el-card>

    <!-- 发送消息 -->
    <el-card class="send-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>发送消息（测试）</span>
        </div>
      </template>

      <el-form>
        <el-form-item label="目标地址">
          <el-input 
            v-model="sendDestination" 
            placeholder="/app/test"
          />
        </el-form-item>
        
        <el-form-item label="消息内容">
          <el-input 
            v-model="sendMessage" 
            type="textarea" 
            :rows="4"
            placeholder='{"key": "value"}'
          />
        </el-form-item>
        
        <el-form-item>
          <el-button 
            type="primary" 
            :disabled="!isConnected"
            @click="handleSend"
          >
            发送
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup name="WebSocketExample">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useSocket } from '@/utils/socketClient'
import useUserStore from '@/store/modules/user'
// 引入二维码生成库
import QRCode from 'qrcode'

// 获取 user store
const userStore = useUserStore()

// 二维码相关数据
const imgSrc = ref('')
const qrcodeUrl = ref('')

// 获取 WebSocket 实例
const { 
  isConnected, 
  status, 
  subscribedTopics,
  subscribe,
  unsubscribe,
  send,
  subscribeUserChannel: subUserChannel,
  subscribeSystemChannel: subSystemChannel
} = useSocket()

// 连接加载状态
const connectLoading = ref(false)

// 状态计算
const statusText = computed(() => {
  const statusMap = {
    'disconnected': '未连接',
    'connecting': '连接中',
    'connected': '已连接',
    'reconnecting': '重连中'
  }
  return statusMap[status.value] || '未知'
})

const statusTagType = computed(() => {
  const typeMap = {
    'disconnected': 'info',
    'connecting': 'warning',
    'connected': 'success',
    'reconnecting': 'warning'
  }
  return typeMap[status.value] || 'info'
})

/**
 * 生成二维码
 * @description 将输入框中的内容生成二维码图片
 */
const handleGenerateQRCode = async () => {
  try {
    if (!imgSrc.value) {
      ElMessage.warning('请输入要生成二维码的内容')
      return
    }

    // 生成二维码配置
    const options = {
      errorCorrectionLevel: 'H', // 高容错率
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      width: 300,
      color: {
        dark: '#000000', // 二维码颜色
        light: '#FFFFFF' // 背景颜色
      }
    }

    // 生成二维码 Data URL
    const url = await QRCode.toDataURL(imgSrc.value, options)
    qrcodeUrl.value = url
    
    ElMessage.success('二维码生成成功')
  } catch (error) {
    console.error('生成二维码失败:', error)
    ElMessage.error(`生成二维码失败: ${error.message || '未知错误'}`)
  }
}

/**
 * 下载二维码图片
 * @description 将生成的二维码图片下载到本地
 */
const handleDownloadQRCode = () => {
  try {
    if (!qrcodeUrl.value) {
      ElMessage.warning('请先生成二维码')
      return
    }

    // 创建下载链接
    const link = document.createElement('a')
    link.href = qrcodeUrl.value
    link.download = `qrcode-${Date.now()}.png`
    
    // 触发下载
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    ElMessage.success('二维码下载成功')
  } catch (error) {
    console.error('下载二维码失败:', error)
    ElMessage.error(`下载失败: ${error.message || '未知错误'}`)
  }
}

// 消息相关
const messages = ref([])
const messageCount = computed(() => messages.value.length)

/**
 * 手动初始化 WebSocket 连接
 */
const handleInitWebSocket = async () => {
  try {
    connectLoading.value = true
    await userStore.initWebSocket()
    ElMessage.success('WebSocket 连接初始化成功')
  } catch (error) {
    console.error('WebSocket 连接初始化失败:', error)
    ElMessage.error(`连接失败: ${error.message || '未知错误'}`)
  } finally {
    connectLoading.value = false
  }
}

/**
 * 添加消息到列表
 * @param {string} topic - 主题地址
 * @param {Object} data - 消息数据
 */
const addMessage = (topic, data) => {
  messages.value.unshift({
    topic,
    data,
    timestamp: new Date().toLocaleTimeString(),
    type: 'primary'
  })
  
  // 限制消息数量
  if (messages.value.length > 50) {
    messages.value.pop()
  }
}

/**
 * 清空消息列表
 */
const clearMessages = () => {
  messages.value = []
  ElMessage.success('消息列表已清空')
}

// 订阅管理
const topicInput = ref('/topic/example')

/**
 * 订阅主题
 */
const handleSubscribe = () => {
  try {
    if (!topicInput.value) {
      ElMessage.warning('请输入主题地址')
      return
    }

    if (subscribedTopics.value.includes(topicInput.value)) {
      ElMessage.warning('该主题已订阅')
      return
    }

    subscribe(topicInput.value, (data) => {
      addMessage(topicInput.value, data)
    })

    ElMessage.success(`已订阅: ${topicInput.value}`)
    topicInput.value = ''
  } catch (error) {
    ElMessage.error(`订阅失败: ${error.message}`)
  }
}

/**
 * 取消订阅
 * @param {string} topic - 主题地址
 */
const handleUnsubscribe = (topic) => {
  try {
    unsubscribe(topic)
    ElMessage.success(`已取消订阅: ${topic}`)
  } catch (error) {
    ElMessage.error(`取消订阅失败: ${error.message}`)
  }
}

// 快捷订阅
/**
 * 订阅用户个人频道
 */
const subscribeUserChannel = () => {
  try {
    subUserChannel((data) => {
      addMessage('用户个人频道', data)
      
      // 显示通知
      ElMessage({
        message: `收到个人消息: ${data.content || ''}`,
        type: 'info',
        duration: 3000
      })
    })
    
    ElMessage.success('已订阅用户个人频道')
  } catch (error) {
    ElMessage.error(`订阅失败: ${error.message}`)
  }
}

/**
 * 订阅系统广播频道
 */
const subscribeSystemChannel = () => {
  try {
    subSystemChannel((data) => {
      addMessage('系统广播频道', data)
      
      // 显示系统通知
      ElMessage({
        message: `系统消息: ${data.message || ''}`,
        type: 'warning',
        duration: 5000
      })
    })
    
    ElMessage.success('已订阅系统广播频道')
  } catch (error) {
    ElMessage.error(`订阅失败: ${error.message}`)
  }
}

/**
 * 订阅订单更新
 */
const subscribeOrderUpdates = () => {
  try {
    subscribe('/topic/order-updates', (data) => {
      addMessage('订单更新频道', data)
      
      ElMessage({
        message: `订单更新: ${data.orderId || ''}`,
        type: 'success',
        duration: 3000
      })
    })
    
    ElMessage.success('已订阅订单更新频道')
  } catch (error) {
    ElMessage.error(`订阅失败: ${error.message}`)
  }
}

// 发送消息
const sendDestination = ref('/app/test')
const sendMessage = ref('{"message": "Hello Server!"}')

/**
 * 发送消息到服务器
 */
const handleSend = () => {
  try {
    if (!sendDestination.value) {
      ElMessage.warning('请输入目标地址')
      return
    }

    if (!sendMessage.value) {
      ElMessage.warning('请输入消息内容')
      return
    }

    // 解析 JSON
    const messageData = JSON.parse(sendMessage.value)
    
    send(sendDestination.value, messageData)
    
    ElMessage.success('消息已发送')
  } catch (error) {
    if (error instanceof SyntaxError) {
      ElMessage.error('消息格式错误，请输入有效的 JSON')
    } else {
      ElMessage.error(`发送失败: ${error.message}`)
    }
  }
}
</script>

<style scoped lang="scss">
.websocket-example {
  padding: 20px;

  .el-card {
    margin-bottom: 20px;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  // 二维码容器样式
  .qrcode-container {
    margin-top: 20px;

    .qrcode-display {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      background-color: #f5f7fa;
      border-radius: 8px;

      img {
        max-width: 300px;
        border: 2px solid #e4e7ed;
        border-radius: 4px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      }
    }
  }

  .topic-list {
    h4 {
      margin-bottom: 10px;
      color: #606266;
    }
  }

  .message-card {
    max-height: 600px;
    overflow-y: auto;

    pre {
      background-color: #f5f7fa;
      padding: 10px;
      border-radius: 4px;
      overflow-x: auto;
      font-size: 12px;
    }
  }
}
</style>

