<template>
  <div>
    <!-- 系统通知小铃铛 -->
    <el-tooltip content="系统通知" effect="dark" placement="bottom">
      <div class="right-menu-item hover-effect notification-wrapper" @click="showNotifications">
        <el-badge :value="unreadCount" :hidden="unreadCount === 0" class="notification-badge">
          <el-icon :size="20"><Bell /></el-icon>
        </el-badge>
      </div>
    </el-tooltip>

    <!-- 通知弹窗 -->
    <el-drawer
      v-model="notificationDrawer"
      title="系统通知"
      direction="rtl"
      size="400px"
      :before-close="handleNotificationClose"
    >
      <div class="notification-content">
        <div v-if="notifications.length === 0" class="no-notifications">
          <el-empty description="暂无通知" />
        </div>
        <div v-else class="notification-list">
          <div
            v-for="notification in notifications"
            :key="notification.id"
            class="notification-item"
            :class="{ 'unread': !notification.read }"
            @click="markAsRead(notification)"
          >
            <div class="notification-header">
              <span class="notification-title">{{ notification.title }}</span>
              <span class="notification-time">{{ notification.time }}</span>
            </div>
            <div class="notification-content-text">{{ notification.content }}</div>
            <div v-if="!notification.read" class="unread-dot"></div>
          </div>
        </div>
        <!-- <div v-if="notifications.length > 0" class="notification-actions">
          <el-button @click="markAllAsRead" type="primary" size="small">全部标记为已读</el-button>
          <el-button @click="clearAllNotifications" type="danger" size="small" plain>清空通知</el-button>
        </div> -->
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getToken } from '@/utils/auth'
import useUserStore from '@/store/modules/user'
import { EventSourcePolyfill } from "event-source-polyfill"

// 通知相关状态
const notifications = ref([])
const notificationDrawer = ref(false)
let eventSource = null

// 计算未读通知数量
const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read).length
})

// 将后端通知数据转换为前端格式
function convertNotifications(notificationsData) {
  if (!Array.isArray(notificationsData)) {
    console.error('通知数据格式错误，应为数组')
    return []
  }
  
  const formattedNotifications = notificationsData.map(notification => ({
    id: notification.id || Date.now(),
    title: notification.title || '系统通知',
    content: notification.content || '',
    time: notification.time || new Date().toISOString(),
    read: notification.read || false,
  }))
  
  // 按时间排序，最新的在前面
  return formattedNotifications.sort((a, b) => new Date(b.time) - new Date(a.time))
}

// SSE连接
function connectSSE() {
  const userId = useUserStore().id
  // SSE接口地址
  const sseUrl = import.meta.env.VITE_APP_BASE_API + '/application/sse/connect/notifications/' + userId
  
  // 关闭之前的连接
  if (eventSource) {
    eventSource.close()
    eventSource = null
  }
  
  try {
    // 使用EventSourcePolyfill，支持自定义请求头
    eventSource = new EventSourcePolyfill(sseUrl,
    // {
    //   headers: {
    //     Authorization: "Bearer " + getToken()
    //   },
    //   heartbeatTimeout: 30000, // 心跳超时时间
    //   withCredentials: true // 允许携带cookie
    // }      
    )    
    eventSource.onopen = function(event) {
      console.log('SSE连接已建立')
    }
    
    eventSource.onmessage = function(event) {
      try {
        console.log('接收到SSE消息:', event);
        
        if (event.data) {
          const data = JSON.parse(event.data)
          // 处理后端返回的全量通知数组
          notifications.value = convertNotifications(data)
          
          // 如果有未读通知，显示提示
          const unreadNotifications = data.filter(n => !n.read)
          if (unreadNotifications.length > 0) {
            ElMessage({
              message: `您有${unreadNotifications.length}条未读通知`,
              type: 'info',
              duration: 3000
            })
          }
        }
      } catch (error) {
        console.error('解析通知数据失败:', error)
      }
    }
    
    eventSource.onerror = function(event) {
      console.error('SSE连接错误:', event)
      
      // 关闭连接
      if (eventSource) {
        eventSource.close()
        eventSource = null
      }
      
      // 自动重连逻辑 - 使用指数退避策略
      const retryDelay = 3000 // 初始重连延迟3秒
      console.log(`将在${retryDelay/1000}秒后尝试重新连接...`)
      
      setTimeout(() => {
        console.log('正在尝试重新连接SSE...')
        connectSSE()
      }, retryDelay)
    }
  } catch (error) {
    console.error('创建SSE连接失败:', error)
  }
}

// 断开SSE连接
function disconnectSSE() {
  if (eventSource) {
    eventSource.close()
    eventSource = null
  }
}

// 显示通知面板
function showNotifications() {
  notificationDrawer.value = true
}

// 关闭通知面板
function handleNotificationClose() {
  notificationDrawer.value = false
}

// 标记单个通知为已读
function markAsRead(notification) {
  if (!notification.read) {
    notification.read = true
    
    // 这里调用后端API标记为已读
    // 例如：
    // markNotificationAsRead(notification.id).then(() => {
    //   // 成功标记为已读后，可以选择是否刷新通知列表
    //   // fetchNotifications()
    // }).catch(error => {
    //   console.error('标记通知为已读失败:', error)
    //   // 如果失败，恢复未读状态
    //   notification.read = false
    // })
  }
}

// 标记所有通知为已读
function markAllAsRead() {
  notifications.value.forEach(n => {
    n.read = true
  })
  
  // 这里调用后端API批量标记为已读
  // 例如：
  // markAllNotificationsAsRead().then(() => {
  //   ElMessage.success('已标记所有通知为已读')
  //   // 成功标记为已读后，可以选择是否刷新通知列表
  //   // fetchNotifications()
  // }).catch(error => {
  //   console.error('标记所有通知为已读失败:', error)
  //   // 如果失败，恢复未读状态
  //   notifications.value.forEach(n => {
  //     n.read = false
  //   })
  // })
  
  ElMessage.success('已标记所有通知为已读')
}

// 清空所有通知
function clearAllNotifications() {
  ElMessageBox.confirm('确定要清空所有通知吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 这里调用后端API清空通知
    // 例如：
    // clearAllNotificationsApi().then(() => {
    //   notifications.value = []
    //   ElMessage.success('已清空所有通知')
    // }).catch(error => {
    //   console.error('清空通知失败:', error)
    //   ElMessage.error('清空通知失败，请重试')
    // })
    
    notifications.value = []
    ElMessage.success('已清空所有通知')
  }).catch(() => {
    // 用户取消操作
  })
}

// 格式化时间
function formatTime(timeStr) {
  const time = new Date(timeStr)
  const now = new Date()
  const diff = now - time
  
  if (diff < 60000) { // 1分钟内
    return '刚刚'
  } else if (diff < 3600000) { // 1小时内
    return `${Math.floor(diff / 60000)}分钟前`
  } else if (diff < 86400000) { // 24小时内
    return `${Math.floor(diff / 3600000)}小时前`
  } else {
    return time.toLocaleDateString()
  }
}



// 生命周期钩子
onMounted(() => {
  // 然后建立SSE连接获取实时通知
  // connectSSE()
  
  // 添加页面刷新时的事件监听
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onUnmounted(() => {
  // 组件卸载时断开SSE连接
  disconnectSSE()
  
  // 移除页面刷新事件监听
  window.removeEventListener('beforeunload', handleBeforeUnload)
})

// 页面刷新时断开SSE连接的处理函数
const handleBeforeUnload = () => {
  disconnectSSE()
}

// 导出组件属性和方法
defineExpose({
  unreadCount,
  showNotifications
})
</script>

<style lang='scss' scoped>
.right-menu-item {
  display: inline-block;
  padding: 0 8px;
  height: 100%;
  font-size: 18px;
  color: var(--navbar-text);
  vertical-align: text-bottom;

  &.hover-effect {
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  &.notification-wrapper {
    display: flex;
    align-items: center;
    position: relative;

    .notification-badge {
      display: flex;
      :deep(.el-badge__content) {
        top: 8px;
        right: 8px;
      }
    }

    .notification-icon {
      font-size: 18px;
      transition: transform 0.3s;

      &:hover {
        transform: scale(1.15);
      }
    }
  }
}

// 通知面板样式
.notification-content {
  height: 100%;
  display: flex;
  flex-direction: column;

  .no-notifications {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .notification-list {
    flex: 1;
    overflow-y: auto;

    .notification-item {
      padding: 16px;
      border-bottom: 1px solid #f0f0f0;
      cursor: pointer;
      position: relative;
      transition: background-color 0.3s;

      &:hover {
        background-color: #f8f9fa;
      }

      &.unread {
        background-color: #f0f9ff;
        border-left: 3px solid #409eff;
      }

      .notification-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;

        .notification-title {
          font-weight: 600;
          color: #303133;
          font-size: 14px;
        }

        .notification-time {
          font-size: 12px;
          color: #909399;
        }
      }

      .notification-content-text {
        color: #606266;
        font-size: 13px;
        line-height: 1.4;
      }

      .unread-dot {
        position: absolute;
        top: 16px;
        right: 16px;
        width: 8px;
        height: 8px;
        background-color: #f56c6c;
        border-radius: 50%;
      }
    }
  }

  .notification-actions {
    padding: 16px;
    border-top: 1px solid #f0f0f0;
    display: flex;
    gap: 8px;
  }
}
</style>
