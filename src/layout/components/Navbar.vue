<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="appStore.sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <breadcrumb v-if="!settingsStore.topNav" id="breadcrumb-container" class="breadcrumb-container" />
    <top-nav v-if="settingsStore.topNav" id="topmenu-container" class="topmenu-container" />

    <div class="right-menu">
      <template v-if="appStore.device !== 'mobile'">
        <!-- 系统通知小铃铛 -->
        <!-- <el-tooltip content="系统通知" effect="dark" placement="bottom">
          <div class="right-menu-item hover-effect notification-wrapper" @click="showNotifications">
            <el-badge :value="unreadCount" :hidden="unreadCount === 0" class="notification-badge">
                <el-icon><Bell /></el-icon>
            </el-badge>
          </div>
        </el-tooltip> -->
        
        <header-search id="header-search" class="right-menu-item" />

        <!-- <el-tooltip content="源码地址" effect="dark" placement="bottom">
          <ruo-yi-git id="ruoyi-git" class="right-menu-item hover-effect" />
        </el-tooltip>

        <el-tooltip content="文档地址" effect="dark" placement="bottom">
          <ruo-yi-doc id="ruoyi-doc" class="right-menu-item hover-effect" />
        </el-tooltip> -->

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip content="主题模式" effect="dark" placement="bottom">
          <div class="right-menu-item hover-effect theme-switch-wrapper" @click="toggleTheme">
            <svg-icon v-if="settingsStore.isDark" icon-class="sunny" />
            <svg-icon v-if="!settingsStore.isDark" icon-class="moon" />
          </div>
        </el-tooltip>

        <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>
      </template>
      <div class="avatar-container">
        <el-dropdown @command="handleCommand" class="right-menu-item hover-effect" trigger="click">
          <div class="avatar-wrapper">
            <img :src="userStore.avatar" class="user-avatar" />
            <el-icon><caret-bottom /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <router-link to="/user/profile">
                <el-dropdown-item>个人中心</el-dropdown-item>
              </router-link>
              <el-dropdown-item command="setLayout" v-if="settingsStore.showSettings">
                <span>布局设置</span>
              </el-dropdown-item>
              <el-dropdown-item divided command="logout">
                <span>退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

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
              <span class="notification-time">{{ formatTime(notification.time) }}</span>
            </div>
            <div class="notification-content-text">{{ notification.content }}</div>
            <div v-if="!notification.read" class="unread-dot"></div>
          </div>
        </div>
        <div v-if="notifications.length > 0" class="notification-actions">
          <el-button @click="markAllAsRead" type="primary" size="small">全部标记为已读</el-button>
          <el-button @click="clearAllNotifications" type="danger" size="small" plain>清空通知</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import Breadcrumb from '@/components/Breadcrumb'
import TopNav from '@/components/TopNav'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import HeaderSearch from '@/components/HeaderSearch'
import RuoYiGit from '@/components/RuoYi/Git'
import RuoYiDoc from '@/components/RuoYi/Doc'
import useAppStore from '@/store/modules/app'
import useUserStore from '@/store/modules/user'
import useSettingsStore from '@/store/modules/settings'

const appStore = useAppStore()
const userStore = useUserStore()
const settingsStore = useSettingsStore()

// 通知相关状态
const notifications = ref([])
const notificationDrawer = ref(false)
let eventSource = null

// 计算未读通知数量
const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read).length
})

// SSE连接
function connectSSE() {
  // 模拟的SSE接口地址
  const sseUrl = '/api/notifications/stream'
  
  eventSource = new EventSource(sseUrl)
  
  eventSource.onopen = function(event) {
    console.log('SSE连接已建立')
  }
  
  eventSource.onmessage = function(event) {
    try {
      const notification = JSON.parse(event.data)
      addNotification(notification)
    } catch (error) {
      console.error('解析通知数据失败:', error)
    }
  }
  
  eventSource.onerror = function(event) {
    console.error('SSE连接错误:', event)
    // 重连逻辑
    setTimeout(() => {
      if (eventSource.readyState === EventSource.CLOSED) {
        connectSSE()
      }
    }, 5000)
  }
}

// 断开SSE连接
function disconnectSSE() {
  if (eventSource) {
    eventSource.close()
    eventSource = null
  }
}

// 添加新通知
function addNotification(notification) {
  const newNotification = {
    id: notification.id || Date.now(),
    title: notification.title || '系统通知',
    content: notification.content || '',
    time: notification.time || new Date().toISOString(),
    read: false,
    type: notification.type || 'info'
  }
  
  notifications.value.unshift(newNotification)
  
  // 显示桌面通知提示
  ElMessage({
    message: `新通知：${newNotification.title}`,
    type: 'info',
    duration: 3000
  })
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
    // 这里可以调用后端API标记为已读
    // markNotificationAsRead(notification.id)
  }
}

// 标记所有通知为已读
function markAllAsRead() {
  notifications.value.forEach(n => {
    n.read = true
  })
  // 这里可以调用后端API批量标记为已读
  // markAllNotificationsAsRead()
  ElMessage.success('已标记所有通知为已读')
}

// 清空所有通知
function clearAllNotifications() {
  ElMessageBox.confirm('确定要清空所有通知吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    notifications.value = []
    // 这里可以调用后端API清空通知
    // clearAllNotifications()
    ElMessage.success('已清空所有通知')
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

// 获取历史通知
async function fetchNotifications() {
  try {
    // 模拟API调用
    // const response = await fetch('/api/notifications')
    // const data = await response.json()
    // notifications.value = data.notifications || []
    
    // 模拟数据
    notifications.value = [
      {
        id: 1,
        title: '系统维护通知',
        content: '系统将于今晚22:00-24:00进行维护，请提前保存工作。',
        time: new Date(Date.now() - 3600000).toISOString(),
        read: false,
        type: 'warning'
      },
      {
        id: 2,
        title: '新功能上线',
        content: '报表模块新增了数据导出功能，欢迎体验。',
        time: new Date(Date.now() - 7200000).toISOString(),
        read: true,
        type: 'info'
      }
    ]
  } catch (error) {
    console.error('获取通知失败:', error)
  }
}

function toggleSideBar() {
  appStore.toggleSideBar()
}

function handleCommand(command) {
  switch (command) {
    case "setLayout":
      setLayout();
      break;
    case "logout":
      logout();
      break;
    default:
      break;
  }
}

function logout() {
  ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    userStore.logOut().then(() => {
      location.href = '/index';
    })
  }).catch(() => { });
}

const emits = defineEmits(['setLayout'])
function setLayout() {
  emits('setLayout');
}

function toggleTheme() {
  settingsStore.toggleTheme()
}

// 生命周期钩子
onMounted(() => {
  // fetchNotifications()
  // connectSSE()
})

onUnmounted(() => {
  // disconnectSSE()
})
</script>

<style lang='scss' scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: var(--navbar-bg);
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .topmenu-container {
    position: absolute;
    left: 50px;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    display: flex;

    &:focus {
      outline: none;
    }

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

      &.theme-switch-wrapper {
        display: flex;
        align-items: center;

        svg {
          transition: transform 0.3s;
          
          &:hover {
            transform: scale(1.15);
          }
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

    .avatar-container {
      margin-right: 40px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        i {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
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
