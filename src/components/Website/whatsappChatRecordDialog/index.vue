<template>
  <el-dialog 
    v-model="dialogVisible" 
    title="WhatsApp聊天记录" 
    width="60%"
    :close-on-click-modal="false"
    class="whatsapp-chat-dialog"
    @close="handleClose"
  >
    <div class="chat-container" v-loading="loading">
      <!-- 聊天消息列表 -->
      <div 
        class="chat-messages" 
        ref="chatMessagesRef"
      >
        <!-- 顶部加载状态指示器 -->
        <div v-if="isLoading" class="top-loading-container">
          <div class="loading-indicator">
            <el-icon class="is-loading"><Loading /></el-icon>
            <span>正在加载历史消息...</span>
          </div>
        </div>

        <div 
          v-for="record in chatRecords" 
          :key="record.cwrId"
          :data-message-id="record.cwrId"
          class="message-wrapper"
          :class="getMessageClass(record)"
        >
          <!-- 消息气泡 -->
          <div class="message-bubble">
            <!-- 发送者信息和时间戳 -->
            <div v-if="record.senderName" class="sender-info">
              <span class="message-time">{{ formatChatTime(record.chatTime) }}</span>
              <span class="sender-name">{{ record.senderName }}</span>
            </div>

            <!-- 消息内容区域 -->
            <div class="message-content">
              <!-- 端到端加密通知 (messageType = 1) -->
              <template v-if="record.messageType === 1">
                <div class="system-message">
                  <el-icon><Lock /></el-icon>
                  <span>{{ record.messageBody || '端到端加密通知' }}</span>
                </div>
              </template>

              <!-- 图片消息 (messageType = 2) -->
              <template v-else-if="record.messageType === 2">
                <div class="media-message image-message">
                  <el-image 
                    v-if="record.file && record.file.url"
                    :src="baseUrl + record.file.url" 
                    :preview-src-list="[baseUrl + record.file.url]"
                    fit="cover"
                    style="max-width: 250px; max-height: 250px; border-radius: 8px;"
                  />
                  <!-- 图片描述 -->
                  <div v-if="record.messageCaption" class="media-caption">
                    {{ record.messageCaption }}
                  </div>
                </div>
              </template>

              <!-- 视频消息 (messageType = 3) -->
              <template v-else-if="record.messageType === 3">
                <div class="media-message video-message">
                  <video 
                    v-if="record.file && record.file.url"
                    controls 
                    style="max-width: 300px; border-radius: 8px;"
                  >
                  <source :src="baseUrl + record.file.url" :type="record.file.mimeType" />
                </video>
                  <!-- 视频描述 -->
                  <div v-if="record.messageCaption" class="media-caption">
                    {{ record.messageCaption }}
                  </div>
                </div>
              </template>

              <!-- 文本聊天消息 (messageType = 4) -->
              <template v-else-if="record.messageType === 4">
                <div class="text-message">{{ record.messageBody }}</div>
              </template>

              <!-- 语音消息 (messageType = 5) -->
              <template v-else-if="record.messageType === 5">
                <div class="media-message audio-message">
                  <audio 
                    v-if="record.file && record.file.url"
                    controls 
                    style="width: 250px;" 
                  >
                  <source :src="baseUrl + record.file.url" :type="record.file.mimeType" /></audio>
                </div>
              </template>

              <!-- 文档/文件消息 (messageType = 8) -->
              <template v-else-if="record.messageType === 8">
                <div class="media-message document-message">
                  <el-link 
                    v-if="record.file && record.file.url"
                    :href="baseUrl + record.file.url" 
                    target="_blank" 
                    :underline="always"
                  >
                    <el-icon><Document /></el-icon>
                    <span v-if="record.file && record.file.originalFileName">{{ record.file.originalFileName || '查看文档' }}</span>
                  </el-link>
                </div>
              </template>

              <!-- 未知类型消息 -->
              <template v-else>
                <div class="text-message unknown-type">
                  {{ record.messageBody || '未知消息类型' }}
                  <span class="message-type-tag">(类型: {{ record.messageType }})</span>
                </div>
              </template>
            </div>
          </div>
        </div>

        <!-- 空状态提示 -->
        <div v-if="!loading && chatRecords.length === 0" class="empty-state">
          <el-empty description="暂无聊天记录" />
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="WhatsappChatRecordDialog">
import { ref, watch, nextTick, computed, getCurrentInstance } from 'vue'
import { useInfiniteScroll } from '@vueuse/core'
import { getWhatsappChatRecordPage } from '@/api/Website/whatsapp'
import { Loading, Lock, Document } from '@element-plus/icons-vue'
import { parseTime } from '@/utils/ruoyi'

/**
 * 组件属性定义
 * @typedef {Object} Props
 * @property {boolean} visible - 对话框显示状态
 * @property {Object} contactData - 联系人数据对象，包含联系人ID等信息
 */
const props = defineProps({
  // 对话框显示状态
  visible: {
    type: Boolean,
    default: false
  },
  // 联系人数据（包含 cwcId 等）
  contactData: {
    type: Object,
    default: () => ({})
  },
  // 图片/文件基础URL
  baseUrl: {
    type: String,
    default: import.meta.env.VITE_BASE_IMG_URL
  }
})

/**
 * 组件事件定义
 */
const emit = defineEmits(['update:visible'])

// 获取代理实例
const { proxy } = getCurrentInstance()

// 响应式引用
const loading = ref(false)
const chatRecords = ref([])
const chatMessagesRef = ref()

// 分页相关状态
const currentPage = ref(1) // 当前页码
const pageSize = ref(10) // 每页数量
const total = ref(0) // 总记录数
const isInitialLoading = ref(true) // 是否首次加载
const isLoadingMore = ref(false) // 是否正在加载更多（防止重复加载）

// MutationObserver 相关
const heightObserver = ref(null) // 高度变化观察器
const shouldAutoScroll = ref(false) // 是否需要自动滚动到底部

// 控制对话框显示
const dialogVisible = computed({
  get() {
    return props.visible
  },
  set(value) {
    emit('update:visible', value)
  }
})

/**
 * 设置无限滚动（向上滚动加载历史消息）
 */
const infiniteScrollResult = useInfiniteScroll(
  chatMessagesRef,
  async () => {
    // 跳过首次加载（首次加载在 watch 中处理）
    if (isInitialLoading.value) {
      return
    }
    // 防止正在加载时重复触发
    if (isLoadingMore.value) {
      return
    }
    // 加载更多历史消息
    await loadMoreChatRecords()
  },
  {
    direction: 'top', // 向上滚动触发
    distance: 50, // 距离顶部50px时触发
    interval: 300, // 防抖间隔300ms
    canLoadMore: () => {
      // 判断是否还有更多数据可以加载
      return chatRecords.value.length < total.value && !isInitialLoading.value && !isLoadingMore.value
    }
  }
)

// 解构出 isLoading
const isLoading = infiniteScrollResult.isLoading

/**
 * 监听对话框显示状态，加载聊天记录
 */
watch(() => props.visible, async (visible) => {
  if (visible && props.contactData) {
    // 重置分页状态
    currentPage.value = 1
    total.value = 0
    chatRecords.value = []
    isInitialLoading.value = true
    // 重置无限滚动
    if (infiniteScrollResult.reset && typeof infiniteScrollResult.reset === 'function') {
      infiniteScrollResult.reset()
    }
    // 首次加载
    await loadChatRecords()
    // 首次加载完成
    isInitialLoading.value = false
  }
})

/**
 * 加载聊天记录数据（首次加载）
 * @returns {Promise<void>}
 * @throws {Error} 当加载失败时抛出
 */
async function loadChatRecords() {
  try {
    loading.value = true
    
    const cwcId = props.contactData.cwcId
    
    if (!cwcId) {
      proxy.$modal.msgError('联系人ID不存在')
      return
    }

    const response = await getWhatsappChatRecordPage({
      cwcId: cwcId,
      pageNum: currentPage.value,
      pageSize: pageSize.value
    })
    
    if (response.code === 200 && response.data) {
      const newRecords = response.data.records || []
      
      // 首次加载时，直接设置数据
      chatRecords.value = newRecords
      // 设置总记录数
      total.value = response.data.total || 0
      
      // 按 chatTime 从旧到新排序
      chatRecords.value.sort((a, b) => {
        const timeA = a.chatTime ? new Date(a.chatTime).getTime() : 0
        const timeB = b.chatTime ? new Date(b.chatTime).getTime() : 0
        return timeA - timeB
      })
      
      // 等待DOM更新
      await nextTick()
      
      // 启用自动滚动
      shouldAutoScroll.value = true
      
      // 启动高度监听（用于监听所有内容加载导致的高度变化）
      setupHeightObserver()
      
      // 首次滚动到底部
      scrollToBottom()
    } else {
      proxy.$modal.msgError(response.msg || '获取聊天记录失败')
    }
  } catch (error) {
    console.error('加载聊天记录失败:', error)
    proxy.$modal.msgError('加载聊天记录失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

/**
 * 获取消息样式类名
 * @param {Object} record - 聊天记录对象
 * @returns {Object} 样式类名对象
 * @description 
 * isUser === true: 业务员发送的消息（显示在右边）
 * isUser === false: 客户发送的消息（显示在左边）
 */
function getMessageClass(record) {
  return {
    'message-sent': record.isUser === true, // 业务员发送（右边）
    'message-received': record.isUser === false, // 客户发送（左边）
    'message-system': record.messageType === 1, // 系统消息
    'message-media': [2, 3, 5, 8].includes(record.messageType) // 媒体消息
  }
}

/**
 * 格式化聊天时间
 * @param {string} chatTime - 聊天时间字符串
 * @returns {string} 格式化后的时间
 */
function formatChatTime(chatTime) {
  if (!chatTime) return ''
  
  const now = new Date()
  const msgTime = new Date(chatTime)
  const diffDays = Math.floor((now - msgTime) / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    // 今天：显示时分
    return msgTime.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  } else if (diffDays === 1) {
    // 昨天
    return `昨天 ${msgTime.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })}`
  } else if (diffDays < 7) {
    // 一周内：显示星期
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    return `${weekdays[msgTime.getDay()]} ${msgTime.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })}`
  } else {
    // 超过一周：显示完整日期
    return parseTime(chatTime, '{y}-{m}-{d} {h}:{i}')
  }
}

/**
 * 滚动到消息底部
 */
function scrollToBottom() {
  if (chatMessagesRef.value) {
    chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight
  }
}

/**
 * 设置高度变化监听器
 * 使用MutationObserver监听DOM变化，当图片、视频等媒体内容加载导致高度变化时自动滚动到底部
 */
function setupHeightObserver() {
  if (!chatMessagesRef.value || heightObserver.value) return
  
  // 创建MutationObserver实例
  heightObserver.value = new MutationObserver((mutations) => {
    // 检查是否需要自动滚动
    if (!shouldAutoScroll.value) return
    
    let shouldScroll = false
    
    // 检查是否有子元素变化或属性变化
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // 有新的子元素添加
        shouldScroll = true
      } else if (mutation.type === 'attributes') {
        // 属性变化（比如img的src加载完成、video加载等）
        shouldScroll = true
      }
    })
    
    // 如果检测到变化，滚动到底部
    if (shouldScroll) {
      scrollToBottom()
    }
  })
  
  // 开始观察
  heightObserver.value.observe(chatMessagesRef.value, {
    childList: true, // 观察子元素的变化
    subtree: true, // 观察所有后代节点
    attributes: true, // 观察属性变化
    attributeFilter: ['src', 'style', 'class'] // 只观察可能影响布局的属性
  })
  
  // 同时监听图片加载完成事件
  const images = chatMessagesRef.value.querySelectorAll('img')
  images.forEach(img => {
    if (!img.complete) {
      img.addEventListener('load', scrollToBottom, { once: true })
      img.addEventListener('error', scrollToBottom, { once: true })
    }
  })
}

/**
 * 清理高度变化监听器
 */
function cleanupHeightObserver() {
  if (heightObserver.value) {
    heightObserver.value.disconnect()
    heightObserver.value = null
  }
}

/**
 * 加载更多聊天记录（由 useInfiniteScroll 自动触发）
 * @returns {Promise<void>}
 * @throws {Error} 当加载失败时抛出
 */
async function loadMoreChatRecords() {
  // 如果已经没有更多数据或正在加载，直接返回
  if (chatRecords.value.length >= total.value || isLoadingMore.value) {
    return
  }
  
  try {
    // 加载更多历史消息时停止自动滚动
    shouldAutoScroll.value = false
    
    // 设置加载中状态
    isLoadingMore.value = true
    
    // 记录当前的滚动位置
    const currentScrollTop = chatMessagesRef.value?.scrollTop || 0
    const currentScrollHeight = chatMessagesRef.value?.scrollHeight || 0
    
    // 增加页码
    currentPage.value += 1
    
    const cwcId = props.contactData.cwcId
    
    if (!cwcId) {
      return
    }

    const response = await getWhatsappChatRecordPage({
      cwcId: cwcId,
      pageNum: currentPage.value,
      pageSize: pageSize.value
    })
    
    if (response.code === 200 && response.data) {
      const newRecords = response.data.records || []
      
      if (newRecords.length > 0) {
        // 将新数据添加到现有数据前面
        chatRecords.value = [...newRecords, ...chatRecords.value]
        
        // 按 chatTime 从旧到新排序
        chatRecords.value.sort((a, b) => {
          const timeA = a.chatTime ? new Date(a.chatTime).getTime() : 0
          const timeB = b.chatTime ? new Date(b.chatTime).getTime() : 0
          return timeA - timeB
        })
        
        // 等待DOM更新后，计算新的高度差，恢复到原来的位置
        await nextTick()
        
        if (chatMessagesRef.value) {
          const newScrollHeight = chatMessagesRef.value.scrollHeight
          const heightDifference = newScrollHeight - currentScrollHeight
          // 保持用户原来看到的内容位置不变
          chatMessagesRef.value.scrollTop = currentScrollTop + heightDifference
        }
      }
    }
  } catch (error) {
    // 加载失败时回退页码
    currentPage.value -= 1
    console.error('加载更多聊天记录失败:', error)
  } finally {
    // 重置加载状态，延迟一点时间防止立即再次触发
    setTimeout(() => {
      isLoadingMore.value = false
    }, 500)
  }
}

/**
 * 关闭对话框
 */
function handleClose() {
  chatRecords.value = []
  currentPage.value = 1
  total.value = 0
  isInitialLoading.value = true
  isLoadingMore.value = false
  shouldAutoScroll.value = false
  // 清理高度监听器
  cleanupHeightObserver()
  // 重置无限滚动
  if (infiniteScrollResult.reset && typeof infiniteScrollResult.reset === 'function') {
    infiniteScrollResult.reset()
  }
  
  emit('update:visible', false)
}
</script>

<style lang="scss" scoped>
.chat-container {
  height: 70vh;
  display: flex;
  flex-direction: column;
  background: #e5ddd5;
  background-image: 
    radial-gradient(circle, rgba(0,0,0,0.05) 1px, transparent 1px);
  background-size: 20px 20px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  // display: flex;
  // flex-direction: column-reverse; // 向上滚动加载需要反转显示顺序
  
  .message-wrapper {
    margin-bottom: 16px;
    width: 100%;
    display: block;
    
    .message-bubble {
      display: flex;
      flex-direction: column;
      max-width: 65%;
      position: relative;
      
      .sender-info {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 4px;
        
        .message-time {
          font-size: 13px;
          color: #8696a0;
          white-space: nowrap;
        }
        
        .sender-name {
          font-size: 14px;
          color: #667781;
          font-weight: 500;
          word-break: break-word;
        }
      }
      
      .message-content {
        background: #ffffff;
        border-radius: 12px;
        padding: 8px 12px;
        word-wrap: break-word;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        
        .text-message {
          line-height: 1.5;
          color: #111b21;
          white-space: pre-wrap;
          
          &.unknown-type .message-type-tag {
            font-size: 11px;
            color: #667781;
            font-style: italic;
            margin-left: 4px;
          }
        }
        
        .system-message {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #667781;
          font-size: 13px;
          font-style: italic;
          
          .el-icon {
            font-size: 14px;
          }
        }
        
        .media-message {
          .el-image {
            display: block;
            cursor: pointer;
          }
          
          video {
            display: block;
          }
          
          audio {
            outline: none;
          }
          
          &.document-message .el-link {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #00a884;
            
            .el-icon {
              font-size: 18px;
            }
          }
          
          .media-caption {
            margin-top: 8px;
            color: #111b21;
            font-size: 14px;
            line-height: 1.4;
          }
        }
      }
    }
    
    // 业务员发送的消息样式（显示在右边）
    &.message-sent {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      
      .message-bubble {
        align-items: flex-end;
        
        .sender-info {
          flex-direction: row; // 右边消息：时间 + 名称
        }
        
        .message-content {
          background: #d9fdd3; // 绿色气泡表示业务员发送
          color: #111b21;
        }
      }
    }
    
    // 客户发送的消息样式（显示在左边）
    &.message-received {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      
      .message-bubble {
        align-items: flex-start;
        
        .sender-info {
          flex-direction: row-reverse; // 左边消息：名称 + 时间
        }
        
        .message-content {
          background: #ffffff; // 白色气泡表示客户发送
          color: #111b21;
        }
      }
    }
    
    // 系统消息样式（居中显示）
    &.message-system {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 16px 0;
      
      .message-bubble {
        max-width: 80%;
        align-items: center;
        
        .message-content {
          background: #fff4e6;
          border-radius: 8px;
          padding: 6px 16px;
        }
      }
    }
    
    // 媒体消息样式
    &.message-media {
      .message-bubble .message-content {
        padding: 4px;
      }
      
      &.message-sent .message-content {
        background: #d9fdd3;
      }
      
      &.message-received .message-content {
        background: #ffffff;
      }
    }
  }
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #667781;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  padding: 10px 0;
}

// 滚动条样式
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

// 顶部加载状态指示器样式
.top-loading-container {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  justify-content: center;
  padding: 12px 20px;
  background: rgba(229, 221, 213, 0.95);
  backdrop-filter: blur(4px);
  border-radius: 0 0 12px 12px;
  margin-bottom: 8px;
  
  .loading-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #667781;
    font-size: 13px;
    
    .el-icon {
      font-size: 16px;
      animation: rotate 1s linear infinite;
    }
    
    span {
      font-weight: 500;
    }
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

