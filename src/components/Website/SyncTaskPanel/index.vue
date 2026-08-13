<!--
  同步任务面板
  @description 顶部导航栏左侧的同步任务图标
  订阅 /topic/sync/list：
    - 初始订阅时返回：SyncRecord 数组
    - 推送消息格式：SyncPushItem 数组
  每个同步任务后面有重试按钮（调用 /iotda/sync-task/retry）
  @author ERP System
-->

<template>
  <div>
    <el-tooltip content="设备云同步任务" effect="dark" placement="bottom">
      <div class="right-menu-item hover-effect sync-wrapper" @click="showDrawer">
        <el-badge :value="failedCount" :hidden="failedCount === 0" :max="99" class="sync-badge">
          <el-icon :size="20">
            <Connection />
          </el-icon>
        </el-badge>
      </div>
    </el-tooltip>

    <el-drawer
      v-model="drawerVisible"
      title="设备云同步任务"
      direction="rtl"
      size="520px"
      :before-close="handleClose"
    >
      <div class="sync-toolbar">
        <el-tag size="small">订阅：/topic/sync/list</el-tag>
        <el-tag :type="wsConnected ? 'success' : 'info'" size="small">
          {{ wsConnected ? '已连接' : '未连接' }}
        </el-tag>
        <el-button size="small" :icon="Refresh" @click="handleManualRefresh">刷新</el-button>
      </div>

      <div class="sync-content">
        <el-empty v-if="records.length === 0" description="暂无同步任务" :image-size="80" />
        <div v-else class="sync-list">
          <div v-for="item in records" :key="item.key" class="sync-item" :class="`status-${(item.status || '').toLowerCase()}`">
            <div class="sync-item-header">
              <span class="sync-device-id" :title="item.deviceId">
                <el-icon><Cpu /></el-icon>
                {{ item.deviceId || '-' }}
              </span>
              <el-tag :type="getStatusType(item.status)" size="small">{{ getStatusText(item.status) }}</el-tag>
            </div>

            <div class="sync-item-body">
              <div class="sync-row">
                <span class="label">任务类型：</span>
                <el-tag size="small" type="info">{{ getTaskTypeText(item.taskType) }}</el-tag>
              </div>
              <div class="sync-row">
                <span class="label">同步 ID：</span>
                <span class="value mono" :title="item.syncId">{{ item.syncId || '-' }}</span>
              </div>
              <div v-if="item.retryCount !== undefined" class="sync-row">
                <span class="label">重试次数：</span>
                <span class="value">{{ item.retryCount }}</span>
              </div>
              <div v-if="item.message" class="sync-row">
                <span class="label">消息：</span>
                <span class="value">{{ item.message }}</span>
              </div>
              <div v-if="item.error" class="sync-row error-text">
                <span class="label">错误：</span>
                <span class="value">{{ item.error }}</span>
              </div>
              <div class="sync-row">
                <span class="label">时间：</span>
                <span class="value">{{ item.time || '-' }}</span>
              </div>
            </div>

            <div class="sync-item-footer">
              <el-button
                v-if="canRetry(item)"
                type="primary"
                size="small"
                :loading="retryingMap[item.syncId]"
                @click="handleRetry(item)"
              >
                手动重试
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup name="SyncTaskPanel">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Connection, Cpu, Refresh } from '@element-plus/icons-vue'
import { useSocket } from '@/utils/socketClient'
import { retrySyncTask } from '@/api/Website/machine'

const SYNC_TOPIC = '/topic/sync/list'

const { isConnected: wsConnected, subscribe, unsubscribe } = useSocket()

const drawerVisible = ref(false)

// 同步任务列表（统一格式）
const records = ref([])
// 正在重试中的任务 syncId 集合
const retryingMap = ref({})

let unsubscribeFn = null

/**
 * 任务状态 -> 标签类型
 * @param {string} status - 状态
 * @returns {string} - 标签类型
 */
function getStatusType(status) {
  if (!status) return 'info'
  const s = String(status).toUpperCase()
  if (s === 'SUCCESS') return 'success'
  if (s === 'FAILED') return 'danger'
  if (s === 'PENDING' || s === 'RUNNING') return 'warning'
  return 'info'
}

/**
 * 任务状态 -> 中文
 * @param {string} status - 状态
 * @returns {string} - 中文
 */
function getStatusText(status) {
  if (!status) return '未知'
  const s = String(status).toUpperCase()
  if (s === 'SUCCESS') return '成功'
  if (s === 'FAILED') return '失败'
  if (s === 'PENDING') return '等待中'
  if (s === 'RUNNING') return '进行中'
  return status
}

/**
 * 任务类型 -> 中文
 * @param {string} type - 类型
 * @returns {string} - 中文
 */
function getTaskTypeText(type) {
  if (!type) return '-'
  const t = String(type).toUpperCase()
  if (t === 'CREATE') return '创建设备'
  if (t === 'UPDATE') return '更新设备'
  if (t === 'DELETE') return '删除设备'
  return type
}

/**
 * 是否可重试
 * @param {Object} item - 任务项
 * @returns {boolean}
 */
function canRetry(item) {
  if (!item || !item.syncId) return false
  const s = String(item.status || '').toUpperCase()
  return s === 'FAILED'
}

/**
 * 标准化记录项（统一字段）
 * 初始订阅 SyncRecord: { id, syncId, deviceId, taskType, status, retryCount, createdAt }
 * 推送 SyncPushItem: { deviceId, status, message, syncId, error, timestamp }
 * @param {Object} raw - 原始数据
 * @returns {Object} - 标准化后的对象
 */
function normalizeRecord(raw) {
  if (!raw) return null
  return {
    key: raw.syncId || `${raw.deviceId || ''}-${raw.timestamp || raw.createdAt || Date.now()}-${Math.random()}`,
    syncId: raw.syncId || null,
    deviceId: raw.deviceId || '-',
    status: raw.status || 'PENDING',
    taskType: raw.taskType || '-',
    retryCount: raw.retryCount !== undefined ? raw.retryCount : undefined,
    message: raw.message || '',
    error: raw.error || '',
    time: raw.timestamp || raw.createdAt || new Date().toISOString()
  }
}

/**
 * 失败任务数（用于 badge）
 */
const failedCount = computed(() => {
  return records.value.filter(r => String(r.status || '').toUpperCase() === 'FAILED').length
})

/**
 * 打开抽屉
 */
function showDrawer() {
  drawerVisible.value = true
  // 如果尚未订阅，则补一次订阅
  if (!unsubscribeFn) {
    doSubscribe()
  }
}

/**
 * 关闭抽屉
 */
function handleClose() {
  drawerVisible.value = false
}

/**
 * 订阅同步列表
 * @description 后端推送两种数组格式，通过数组第一条是否有 id 字段区分：
 *   - 有 id → SyncRecord[]（初始列表数据，直接覆盖整个列表）
 *   - 无 id → SyncPushItem[]（状态更新推送，按 deviceId 匹配更新对应记录的状态）
 */
function doSubscribe() {
  if (unsubscribeFn) {
    try { unsubscribeFn() } catch (e) { /* noop */ }
    unsubscribeFn = null
  }
  try {
    unsubscribeFn = subscribe(SYNC_TOPIC, (data) => {
      if (!Array.isArray(data) || data.length === 0) return

      // 通过数组第一条是否有 id 字段判断数据格式
      if ('id' in data[0]) {
        // 初始订阅返回的 SyncRecord[]（完整记录列表），直接覆盖
        records.value = data.map(normalizeRecord).filter(Boolean)
      } else {
        // 推送的 SyncPushItem[]（仅状态更新），按 deviceId 匹配更新
        data.forEach(item => {
          if (!item.deviceId) return
          const idx = records.value.findIndex(r => r.deviceId === item.deviceId)
          if (idx > -1) {
            // 只更新状态相关字段，保留其他字段（如 taskType、retryCount 等）
            const existing = records.value[idx]
            records.value[idx] = {
              ...existing,
              status: item.status !== undefined ? item.status : existing.status,
              message: item.message !== undefined ? item.message : existing.message,
              error: item.error !== undefined ? item.error : existing.error,
              time: item.timestamp || existing.time
            }
          }
        })
      }
    })
  } catch (e) {
    console.error('订阅同步列表失败', e)
  }
}

/**
 * 手动刷新：重新订阅以重新拉取初始列表
 */
function handleManualRefresh() {
  doSubscribe()
}

/**
 * 手动重试同步任务
 * @param {Object} item - 任务项
 */
async function handleRetry(item) {
  if (!item || !item.syncId) {
    ElMessage.warning('缺少 syncId')
    return
  }
  try {
    await ElMessageBox.confirm(
      `确认要重试同步任务（${item.deviceId}）吗？`,
      '手动重试',
      { confirmButtonText: '确定重试', cancelButtonText: '取消', type: 'warning' }
    )
  } catch {
    return
  }
  retryingMap.value[item.syncId] = true
  try {
    const res = await retrySyncTask(item.syncId)
    if (res && res.code === 200) {
      ElMessage.success('已重新提交同步任务')
    } else {
      ElMessage.error((res && res.message) || '重试失败')
    }
  } catch (e) {
    console.error('重试失败:', e)
    ElMessage.error(e?.message || '重试失败')
  } finally {
    retryingMap.value[item.syncId] = false
  }
}

onMounted(() => {
  // 进入页面立即订阅，保持列表实时
  doSubscribe()
})

onBeforeUnmount(() => {
  if (unsubscribeFn) {
    try { unsubscribeFn() } catch (e) { /* noop */ }
    unsubscribeFn = null
  }
})
</script>

<style lang="scss" scoped>
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

  &.sync-wrapper {
    display: flex;
    align-items: center;
    position: relative;

    .sync-badge {
      display: flex;
      :deep(.el-badge__content) {
        top: 8px;
        right: 6px;
      }
    }
  }
}

.sync-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 0 12px 0;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 12px;
}

.sync-content {
  height: calc(100% - 60px);
  overflow-y: auto;
}

.sync-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sync-item {
  border: 1px solid #ebeef5;
  border-radius: 6px;
  padding: 10px 12px;
  background: #fff;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  &.status-failed {
    border-left: 3px solid #f56c6c;
    background: #fef0f0;
  }

  &.status-success {
    border-left: 3px solid #67c23a;
  }

  &.status-pending,
  &.status-running {
    border-left: 3px solid #e6a23c;
  }

  .sync-item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;

    .sync-device-id {
      font-weight: 600;
      color: #303133;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      max-width: 320px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .sync-item-body {
    font-size: 13px;
    color: #606266;
    line-height: 1.6;

    .sync-row {
      display: flex;
      gap: 4px;
      word-break: break-all;

      .label {
        color: #909399;
        flex-shrink: 0;
      }

      .value {
        color: #303133;
        flex: 1;
        word-break: break-all;
      }

      .value.mono {
        font-family: Consolas, Monaco, monospace;
        font-size: 12px;
      }

      &.error-text .value {
        color: #f56c6c;
      }
    }
  }

  .sync-item-footer {
    margin-top: 8px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
