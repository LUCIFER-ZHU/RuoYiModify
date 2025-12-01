<template>
  <div class="social-media-container">
    <!-- 创建按钮 -->
    <div class="header-actions">
      <el-button type="primary" :icon="Plus" @click="handleCreateSession">
        创建新会话
      </el-button>
    </div>

    <!-- 社交媒体平台列表 -->
    <div class="platform-list" v-loading="listLoading">
      <el-empty v-if="platformList.length === 0" description="暂无社交媒体账号" />

      <div v-else class="card-grid">
        <el-card v-for="item in platformList" :key="item.smpId" class="platform-card" shadow="hover">
          <div class="card-content">
            <!-- 左侧头像 -->
            <div class="avatar-section">
              <el-avatar :size="60" :src="getAvatarUrl(item.socialMediaAvatar)">
                <img src="@/assets/images/whatsapp.png" />
              </el-avatar>
            </div>

            <!-- 中间信息 -->
            <div class="info-section">
              <div class="info-row">
                <span class="label">账号名称：</span>
                <span class="value">{{ item.socialMediaName || '-' }}</span>
              </div>
              <div class="info-row">
                <span class="label">社交媒体ID：</span>
                <span class="value">{{ item.socialMediaId || '-' }}</span>
              </div>
              <div class="info-row">
                <span class="label">会话ID：</span>
                <span class="value">{{ item.apiSessionId || '-' }}</span>
              </div>
            </div>

            <!-- 右侧状态 -->
            <div class="status-section">
              <!-- 在线状态 -->
              <div class="online-status">
                <span class="status-dot" :class="item.socialMediaConnectStatus ? 'online' : 'offline'"></span>
                <span class="status-text">{{ item.socialMediaConnectStatus ? '在线' : '离线' }}</span>
              </div>
              <!-- 同步状态 -->
              <el-tag :type="getSyncStatusType(item.synDataStatus)" effect="dark" size="small">
                {{ getSyncStatusText(item.synDataStatus) }}
              </el-tag>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 二维码扫码弹窗 -->
    <el-dialog v-model="qrcodeDialogVisible" title="扫描二维码绑定WhatsApp" width="400px" :close-on-click-modal="false"
      @close="handleDialogClose">
      <div class="qrcode-dialog-content">
        <!-- 加载状态 -->
        <div v-if="qrcodeStatus === 1" class="status-message">
          <el-icon class="is-loading" :size="40">
            <Loading />
          </el-icon>
          <p>正在准备二维码...</p>
        </div>

        <!-- 二维码显示 -->
        <div v-else-if="qrcodeStatus === 0" class="qrcode-wrapper">
          <img v-if="qrcodeUrl" :src="qrcodeUrl" alt="WhatsApp二维码" class="qrcode-image" />
          <p class="qrcode-tip">请使用WhatsApp扫描二维码</p>
        </div>

        <!-- 同步完成 -->
        <div v-else-if="qrcodeStatus === 2" class="status-message success">
          <el-icon :size="40" color="#67c23a">
            <CircleCheck />
          </el-icon>
          <p>绑定成功！</p>
        </div>

        <!-- 失败状态 -->
        <div v-else-if="qrcodeStatus === 3" class="status-message error">
          <el-icon :size="40" color="#f56c6c">
            <CircleClose />
          </el-icon>
          <p>绑定失败，请重试</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Loading, CircleCheck, CircleClose } from '@element-plus/icons-vue'
// 引入二维码生成库
import QRCode from 'qrcode'
// 引入API接口
import { getSocialMediaList, createWhatsappSession, getWhatsappQRCode, deleteWhatsappSession } from '@/api/Website/whatsapp'
// 引入WebSocket客户端
import socketClient from '@/utils/socketClient'

// ==================== 数据定义 ====================
/** 社交媒体平台列表 */
const platformList = ref([])
/** 列表加载状态 */
const listLoading = ref(false)
/** 二维码弹窗显示状态 */
const qrcodeDialogVisible = ref(false)
/** 二维码URL */
const qrcodeUrl = ref('')
/** 二维码状态：0-二维码，1-准备中，2-完成同步，3-失败 4-离线*/
const qrcodeStatus = ref(null)
/** 当前会话ID */
const currentSessionId = ref('')
/** WebSocket取消订阅函数 */
let unsubscribeFunc = null
/** 是否已扫码完成（用于判断关闭弹窗时是否需要删除会话） */
const isScanned = ref(false)
/** 是否已取消创建会话（用于防止弹窗关闭后继续订阅） */
const isCanceled = ref(false)

// ==================== 生命周期 ====================
onMounted(() => {
  // 加载社交媒体列表
  loadSocialMediaList()
})

onUnmounted(() => {
  // 组件卸载时取消订阅
  if (unsubscribeFunc) {
    unsubscribeFunc()
  }
})

// ==================== 方法定义 ====================
/**
 * 加载社交媒体平台列表
 * @description 从服务器获取当前用户的所有社交媒体账号
 */
const loadSocialMediaList = async () => {
  try {
    listLoading.value = true
    const response = await getSocialMediaList()

    if (response && response.success) {
      platformList.value = response.data || []
    } else {
      ElMessage.error(response.message || '获取社交媒体列表失败')
    }
  } catch (error) {
    console.error('获取社交媒体列表失败:', error)
    ElMessage.error('获取社交媒体列表失败')
  } finally {
    listLoading.value = false
  }
}

/**
 * 检查同步状态是否允许创建新会话
 * @returns {boolean} true表示可以创建，false表示不能创建
 * @description 验证所有平台是否都处于同步完成(2)或同步失败(3)的状态
 */
const canCreateSession = () => {
  // 如果列表为空，允许创建
  if (platformList.value.length === 0) {
    return true
  }

  // 检查是否所有平台都是同步完成(2)或同步失败(3)
  const allSyncComplete = platformList.value.every((item) => {
    return item.synDataStatus === 2 || item.synDataStatus === 3
  })

  return allSyncComplete
}

/**
 * 收集浏览器设备指纹信息
 * @returns {Object} 设备指纹信息对象
 * @description 收集浏览器的设备指纹基础信息，用于创建会话时传递给后端
 */
const collectDeviceFingerprint = () => {
  try {
    // 用户代理字符串
    const userAgent = navigator.userAgent || ''
    
    // 浏览器语言数组
    const languages = navigator.languages || []

    // 浏览器语言
    const language = navigator.language || ''
    
    // 设备内存大小（GB），部分浏览器可能不支持
    const deviceMemory = navigator.deviceMemory || null
    
    // CPU核心数
    const hardwareConcurrency = navigator.hardwareConcurrency || null

    
    // 屏幕信息对象（包含屏幕相关属性）
    const screen = window.screen ? {
      width: window.screen.width || 0,
      height: window.screen.height || 0,
      availWidth: window.screen.availWidth || 0,
      availHeight: window.screen.availHeight || 0,
      colorDepth: window.screen.colorDepth || 0,
      pixelDepth: window.screen.pixelDepth || 0
    } : null
    
    // 窗口内部宽度
    const innerWidth = window.innerWidth || 0
    
    // 窗口内部高度
    const innerHeight = window.innerHeight || 0

    return {
      userAgent: userAgent,
      languages: languages,
      language: language,
      deviceMemory: deviceMemory,
      hardwareConcurrency: hardwareConcurrency,
      screen: screen,
      innerWidth: innerWidth,
      innerHeight: innerHeight
    }
  } catch (error) {
    console.error('收集设备指纹信息失败:', error)
    // 如果收集失败，返回默认值
    return {
      userAgent: '',
      languages: [],
      deviceMemory: null,
      hardwareConcurrency: null,
      screen: null,
      innerWidth: 0,
      innerHeight: 0
    }
  }
}

/**
 * 创建新会话
 * @description 调用创建会话接口、获取第一次二维码并订阅WebSocket主题
 */
const handleCreateSession = async () => {
  try {
    // 检查同步状态
    // if (!canCreateSession()) {
    //   ElMessage.warning('当前有平台正在同步中，请等待同步完成后再创建新会话')
    //   return
    // }

    // 立即打开弹窗并显示加载状态
    qrcodeDialogVisible.value = true
    qrcodeStatus.value = 1 // 加载状态
    isScanned.value = false // 重置扫码状态
    isCanceled.value = false // 重置取消状态

    // 收集浏览器设备指纹信息
    const deviceFingerprint = collectDeviceFingerprint()

    // 调用创建会话接口，传递设备指纹信息
    const response = await createWhatsappSession(deviceFingerprint)

    // 检查是否在等待期间弹窗已被关闭
    if (isCanceled.value) {
      console.log('用户已关闭弹窗，取消后续操作')
      return
    }

    if (response && response.success) {
      // 获取会话ID（从message字段）
      currentSessionId.value = response.data

      if (!currentSessionId.value) {
        ElMessage.error('会话ID获取失败')
        qrcodeDialogVisible.value = false
        return
      }

      console.log('会话创建成功')

      // 再次检查弹窗是否还打开
      if (isCanceled.value) {
        console.log('用户已关闭弹窗，取消订阅')
        // 删除刚创建的会话
        if (currentSessionId.value) {
          try {
            await deleteWhatsappSession(currentSessionId.value)
            console.log('已删除未使用的会话:', currentSessionId.value)
          } catch (error) {
            console.error('删除会话失败:', error)
          }
        }
        return
      }

      // 获取第一次二维码
      await fetchFirstQRCode(currentSessionId.value)

      // 最后检查一次弹窗状态，确保不在关闭后订阅
      if (isCanceled.value) {
        console.log('用户已关闭弹窗，不进行订阅')
        return
      }

      // 订阅WebSocket主题（用于后续二维码刷新和状态更新）
      subscribeWhatsappBind(currentSessionId.value)
    } else {
      ElMessage.error(response.message || '创建会话失败')
      qrcodeDialogVisible.value = false
    }
  } catch (error) {
    console.error('创建会话失败:', error)
    ElMessage.error('创建会话失败')
    qrcodeDialogVisible.value = false
  }
}

/**
 * 获取第一次二维码
 * @param {string} sessionId - 会话ID
 * @description 通过HTTP GET请求获取第一次二维码
 */
const fetchFirstQRCode = async (sessionId) => {
  try {
    const response = await getWhatsappQRCode(sessionId)

    if (response && response.success && response.data) {
      // 生成二维码
      await generateQRCode(response.data)
      qrcodeStatus.value = 0 // 更新为二维码状态
    } else {
      ElMessage.error('获取二维码失败')
      qrcodeDialogVisible.value = false
    }
  } catch (error) {
    console.error('获取二维码失败:', error)
    ElMessage.error('获取二维码失败')
    qrcodeDialogVisible.value = false
  }
}

/**
 * 订阅WhatsApp绑定主题
 * @param {string} sessionId - 会话ID
 * @description 通过WebSocket订阅绑定状态变化
 */
const subscribeWhatsappBind = (sessionId) => {
  try {
    const topic = `/topic/whatsapp/bind/${sessionId}`
    
    // 每次订阅之前先把上一个取消订阅
    if (unsubscribeFunc) {
      unsubscribeFunc()
    }

    // 订阅主题
    unsubscribeFunc = socketClient.subscribe(topic, async (data) => {
      console.log('收到WhatsApp绑定消息:', data)

      // 更新状态
      qrcodeStatus.value = data.code

      if (data.code === 0) {
        // 生成二维码
        await generateQRCode(data.message)
      } else if (data.code === 1) {
        // 扫码完成，关闭弹窗并取消订阅
        ElMessage.success(data.message || '扫码完成！')
        isScanned.value = true // 标记为已扫码
        qrcodeDialogVisible.value = false
      } else if (data.code === 2) {
        // 完成同步
        ElMessage.success(data.message || '绑定成功！')
        qrcodeDialogVisible.value = false
      } else if (data.code === 3) {
        // 失败
        ElMessage.error(data.message || '绑定失败，请重试')
        qrcodeDialogVisible.value = false
      }

      if (data.code !== 0) {
        setTimeout(() => {
          // 刷新列表
          loadSocialMediaList()          
        }, 1000)        
      }
    })

    console.log(`已订阅主题: ${topic}`)
  } catch (error) {
    console.error('订阅WhatsApp主题失败:', error)
    ElMessage.error('订阅失败')
  }
}

/**
 * 生成二维码
 * @param {string} content - 二维码内容
 * @description 将服务器返回的内容生成二维码图片
 */
const generateQRCode = async (content) => {
  try {
    if (!content) {
      ElMessage.warning('二维码内容为空')
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
    const url = await QRCode.toDataURL(content, options)
    qrcodeUrl.value = url

    console.log('二维码生成成功')
  } catch (error) {
    console.error('生成二维码失败:', error)
    ElMessage.error(`生成二维码失败: ${error.message || '未知错误'}`)
  }
}

/**
 * 获取头像URL
 * @param {string} avatar - 头像地址
 * @returns {string} 完整的头像URL
 */
const getAvatarUrl = (avatar) => {
  if (!avatar) {
    return ''
  }
  // 如果是完整URL，直接返回
  if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
    return avatar
  }
  // 否则拼接服务器地址
  return `${import.meta.env.VITE_APP_BASE_API}${avatar}`
}

/**
 * 获取同步状态文本
 * @param {number} status - 状态码
 * @returns {string} 状态文本
 */
const getSyncStatusText = (status) => {
  const statusMap = {
    0: '未同步',
    1: '同步中',
    2: '同步完成',
    3: '同步失败'
  }
  return statusMap[status] || '未知状态'
}

/**
 * 获取同步状态标签类型
 * @param {number} status - 状态码
 * @returns {string} Element Plus标签类型
 */
const getSyncStatusType = (status) => {
  const typeMap = {
    0: 'info',
    1: 'warning',
    2: 'success',
    3: 'danger'
  }
  return typeMap[status] || 'info'
}

/**
 * 弹窗关闭处理
 * @description 清理资源并根据扫码状态决定是否删除会话
 */
const handleDialogClose = async () => {
  // 标记为已取消，防止异步操作继续执行
  isCanceled.value = true

  // 如果没有扫码完成，且存在会话ID，则删除会话
  if (!isScanned.value && currentSessionId.value) {
    try {
      await deleteWhatsappSession(currentSessionId.value)
      console.log('已删除未使用的会话:', currentSessionId.value)

      // 取消订阅
      if (unsubscribeFunc) {
        unsubscribeFunc()
        unsubscribeFunc = null
      }
    } catch (error) {
      console.error('删除会话失败:', error)
      // 删除失败不阻塞关闭流程
    }
  }


  // 重置状态
  qrcodeUrl.value = ''
  qrcodeStatus.value = null
  currentSessionId.value = ''
  isScanned.value = false
}
</script>

<style lang="scss" scoped>
.social-media-container {
  padding: 20px;

  .header-actions {
    margin-bottom: 20px;
  }

  .platform-list {
    .card-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;

      .platform-card {

        :deep(.el-card__body){
          overflow-x: auto;
        }

        .card-content {
          display: flex;
          align-items: center;
          gap: 16px;

          .avatar-section {
            flex-shrink: 0;
          }

          .info-section {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 8px;

            .info-row {
              display: flex;
              align-items: center;
              font-size: 14px;

              .label {
                color: #909399;
                margin-right: 8px;
                min-width: 100px;
              }

              .value {
                color: #606266;
                font-weight: 500;
              }
            }
          }

          .status-section {
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 8px;
            
            .online-status {
              display: flex;
              align-items: center;
              gap: 6px;
              font-size: 13px;
              
              .status-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                transition: all 0.3s;
                
                &.online {
                  background-color: #67c23a;
                  box-shadow: 0 0 6px rgba(103, 194, 58, 0.5);
                }
                
                &.offline {
                  background-color: #909399;
                }
              }
              
              .status-text {
                color: #606266;
                font-weight: 500;
              }
            }
          }
        }
      }
    }
  }

  // 二维码弹窗样式
  .qrcode-dialog-content {
    text-align: center;
    padding: 20px;

    .status-message {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 40px 20px;

      p {
        margin: 0;
        font-size: 16px;
        color: #606266;
      }

      &.success p {
        color: #67c23a;
        font-weight: 500;
      }

      &.error p {
        color: #f56c6c;
        font-weight: 500;
      }
    }

    .qrcode-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;

      .qrcode-image {
        width: 300px;
        height: 300px;
        border: 1px solid #e4e7ed;
        border-radius: 8px;
      }

      .qrcode-tip {
        margin: 0;
        font-size: 14px;
        color: #909399;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .social-media-container {
    .platform-list .card-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
