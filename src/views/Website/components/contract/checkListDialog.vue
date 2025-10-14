<template>
  <div>
    <!-- 审核历史弹窗 -->
    <el-dialog 
      :close-on-click-modal="false"
      v-model="dialogVisible" 
      title="审核历史" 
      width="41.6667vw" 
      :before-close="handleClose"
    >
      <!-- 审核历史时间轴 -->
      <div class="timeline-section" v-loading="loading" element-loading-text="加载中...">
        <el-timeline v-if="timelineData.length > 0 && !loading">
          <el-timeline-item
            v-for="(item, index) in timelineData"
            :key="index"
            :timestamp="item.time"
            placement="top"
            :type="getTimelineType(item.title)"
            :icon="getTimelineIcon(item.title)"
            size="large"
          >
            <el-card class="timeline-card">
              <div class="timeline-content">
                <span class="timeline-title">{{ item.title }}</span>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>

        <!-- 无数据提示 -->
        <el-empty 
          v-else-if="!loading" 
          description="暂无审核历史" 
          :image-size="100"
        />
      </div>

      <!-- 已收款金额展示 -->
      <div v-if="totalAmount" class="total-amount-section">
        <el-card class="amount-card">
          <div class="amount-content">
            <el-icon class="amount-icon"><Money /></el-icon>
            <span class="amount-text">{{ totalAmount }}</span>
          </div>
        </el-card>
      </div>

    </el-dialog>
  </div>
</template>

<script setup name="CheckListDialog">
import { ref, computed, watch } from 'vue';
import { Money, Check, Close, DocumentChecked, CircleCheck } from '@element-plus/icons-vue';
import { getCheckHistoryList } from '@/api/Website/contract';
import { ElMessage } from 'element-plus';

/**
 * 组件属性定义
 */
const props = defineProps({
  // 弹窗显示状态
  visible: {
    type: Boolean,
    default: false
  },
  // 合同ID
  contractId: {
    type: [String, Number],
    default: ''
  }
});

/**
 * 组件事件定义
 */
const emit = defineEmits(['update:visible']);

// 弹窗显示状态
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
});

// 时间轴数据（排除最后一条总金额数据）
const timelineData = ref([]);
// 已收款总金额
const totalAmount = ref('');
// 加载状态
const loading = ref(false);

/**
 * 监听弹窗显示状态变化，当弹窗打开时获取数据
 */
watch(() => props.visible, (newVisible) => {
  if (newVisible && props.contractId) {
    fetchCheckHistoryData();
  }
});

/**
 * 获取审核历史数据
 */
async function fetchCheckHistoryData() {
  if (!props.contractId) {
    ElMessage.error('合同ID不能为空');
    return;
  }
  
  loading.value = true;
  try {
    const response = await getCheckHistoryList(props.contractId);
    if (response.code === 200) {
      processCheckHistoryData(response.data || []);
    } else {
      ElMessage.error(response.msg || '获取审核历史失败');
      // 清空数据
      timelineData.value = [];
      totalAmount.value = '';
    }
  } catch (error) {
    console.error('获取审核历史失败:', error);
    ElMessage.error('获取审核历史失败，请稍后重试');
    // 清空数据
    timelineData.value = [];
    totalAmount.value = '';
  } finally {
    loading.value = false;
  }
}

/**
 * 处理审核历史数据，分离时间轴数据和总金额数据
 * @param {Array} data - 原始数据
 */
function processCheckHistoryData(data) {
  if (data && data.length > 0) {
    // 分离时间轴数据和总金额数据
    const historyItems = data.filter(item => !item.total && item.title);
    const totalItem = data.find(item => item.total);
    
    timelineData.value = historyItems;
    totalAmount.value = totalItem ? totalItem.total : '';
  } else {
    timelineData.value = [];
    totalAmount.value = '';
  }
}

/**
 * 根据标题内容获取时间轴节点类型
 * @param {string} title - 节点标题
 * @returns {string} 节点类型
 */
function getTimelineType(title) {
  if (title.includes('拒绝')) {
    return 'danger';
  } else if (title.includes('通过') || title.includes('成功') ) {
    return 'success';
  } else if (title.includes('发起')) {
    return 'primary';
  }
  return 'info';
}

/**
 * 根据标题内容获取时间轴节点图标
 * @param {string} title - 节点标题
 * @returns {Component} 图标组件
 */
function getTimelineIcon(title) {
  if (title.includes('拒绝')) {
    return Close;
  } else if (title.includes('通过') || title.includes('成功') ) {
    return CircleCheck;
  } else if (title.includes('发起')) {
    return DocumentChecked;
  }
  return Check;
}

/**
 * 关闭弹窗
 */
function handleClose() {
  dialogVisible.value = false;
}
</script>

<style lang="scss" scoped>
// 已收款金额区域样式
.total-amount-section {
  margin-top: 1.25vw;
  
  .amount-card {
    background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
    border: none;
    
    :deep(.el-card__body) {
      padding: .5208vw;
    }
    
    .amount-content {
      display: flex;
      align-items: center;
      justify-content: center;
      
      .amount-icon {
        font-size: .9375vw;
        color: #ffffff;
        margin-right: .625vw;
      }
      
      .amount-text {
        font-size: .9375vw;
        font-weight: bold;
        color: #ffffff;
      }
    }
  }
}

// 时间轴区域样式
.timeline-section {

  :deep(.el-timeline) {
    padding-left: 0;
    
    .el-timeline-item {
      padding-bottom: 1.25vw;
      
      &:last-child {
        padding-bottom: 0;
      }
    }
    
    .el-timeline-item__timestamp {
      font-size: .6771vw;
      color: #909399;
      font-weight: 500;
    }
    
    .el-timeline-item__node {
      width: .6771vw;
      height: .6771vw;
      
      &.is-primary {
        background-color: #409eff;
        border-color: #409eff;
      }
      
      &.is-success {
        background-color: #67c23a;
        border-color: #67c23a;
      }
      
      &.is-danger {
        background-color: #f56c6c;
        border-color: #f56c6c;
      }
      
      &.is-info {
        background-color: #909399;
        border-color: #909399;
      }
    }
    
    .el-timeline-item__tail {
      border-left: .1042vw solid #e4e7ed;
    }
  }
  
  .timeline-card {
    margin-left: .4167vw;
    border: .0521vw solid #e4e7ed;
    box-shadow: 0 .1042vw .2083vw rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    
    &:hover {
      box-shadow: 0 .2083vw .4167vw rgba(0, 0, 0, 0.1);
      transform: translateY(-0.0521vw);
    }
    
    :deep(.el-card__body) {
      padding: .8333vw;
    }
    
    .timeline-content {
      .timeline-title {
        font-size: .7292vw;
        color: #303133;
        line-height: 1.5;
        word-break: break-all;
      }
    }
  }
}
</style>
