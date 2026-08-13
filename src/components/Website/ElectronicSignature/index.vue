<template>
  <div class="electronic-signature-container">
    <div class="signature-header">
      <h3 class="signature-title">电子签名</h3>
      <p class="signature-tip">请在下方区域进行签名</p>
      <p class="signature-tip-red">（移动端请横屏获取最佳体验）</p>
    </div>

    <div class="signature-wrapper" ref="signatureWrapper">
      <Vue3Signature
        ref="signaturePad"
        class="signature-pad"
        :sigOption="signatureOptions"
        :w="canvasWidth"
        :h="canvasHeight"
        @ready="onSignatureReady"
        @beginStroke="onSignatureBegin"
        @endStroke="onSignatureEnd"
      />
      <div v-if="showRotateTip" class="rotate-overlay">
        <div class="rotate-icon">📱</div>
        <p class="rotate-text">请旋转90°</p>
      </div>
    </div>

    <div class="signature-actions">
      <button class="action-btn clear-btn" @click="clearSignature">
        <span class="btn-icon">🗑️</span>
        <span class="btn-text">清除</span>
      </button>
      <button class="action-btn undo-btn" @click="undoSignature" :disabled="!hasSignature">
        <span class="btn-icon">↩️</span>
        <span class="btn-text">撤销</span>
      </button>
      <button class="action-btn save-btn" @click="saveSignature" :disabled="!hasSignature || showRotateTip">
        <span class="btn-icon">💾</span>
        <span class="btn-text">保存</span>
      </button>
      <!-- 暂时注释还原、下载 -->
      <!-- <button class="action-btn restore-btn" @click="restoreSignature" :disabled="!hasSavedSignature">
        <span class="btn-icon">📥</span>
        <span class="btn-text">还原</span>
      </button> -->
      <!-- <button class="action-btn download-btn" @click="downloadSignature" :disabled="!hasSignature">
        <span class="btn-icon">⬇️</span>
        <span class="btn-text">下载</span>
      </button> -->
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import Vue3Signature from 'vue3-signature';
import { ElMessage } from 'element-plus';
import { saveSignature as saveSignatureApi, getSignatureDetail } from '@/api/Website/electronicSignature';

const signaturePad = ref(null);
const signatureWrapper = ref(null);
const savedSignature = ref('');
const hasSignature = ref(false);
const hasSavedSignature = ref(false);
const showRotateTip = ref(false);
const canvasWidth = ref('100%');
const canvasHeight = ref('400rpx');

/**
 * 签名板配置选项
 * @type {Object}
 */
const signatureOptions = reactive({
// 核心体验配置
  minWidth: 0.6,
  maxWidth: 3.5,
  penColor: 'rgb(0, 0, 0)',
  // 背景配置
  backgroundColor: 'rgba(255, 255, 255, 0)',
  // 算法平滑配置
  throttle: 16,         
  minDistance: 5,
  velocityFilterWeight: 0.7,
});

/**
 * 清除签名
 * 清空签名板上的所有内容
 */
const clearSignature = () => {
  if (signaturePad.value) {
    signaturePad.value.clear();
    hasSignature.value = false;
    savedSignature.value = '';
  }
};

/**
 * 撤销上一步签名操作
 * 移除最后绘制的一笔
 */
const undoSignature = () => {
  if (signaturePad.value) {
    signaturePad.value.undo();
    hasSignature.value = !signaturePad.value.isEmpty();
  }
};

/**
 * 签名开始事件处理
 * 当用户开始在签名板上绘制时触发
 */
const onSignatureBegin = () => {
  hasSignature.value = true;
};

/**
 * 签名结束事件处理
 * 当用户完成一笔绘制时触发
 */
const onSignatureEnd = () => {
  if (signaturePad.value) {
    hasSignature.value = !signaturePad.value.isEmpty();
  }
};

/**
 * 签名板准备就绪事件处理
 * 当签名板初始化完成并准备就绪时触发
 */
const onSignatureReady = () => {
  console.log('签名板已准备就绪');
};

/**
 * 保存签名
 * 将签名转换为base64格式的图片数据并通过API保存到后端
 * @returns {Promise<Object>} 包含isEmpty和data的对象
 */
const saveSignature = async () => {
  try {
    if (signaturePad.value) {
      const data = signaturePad.value.save('image/png');
      if (data) {
        savedSignature.value = data;
        hasSignature.value = true;
        await saveSignatureApi({ url: data });
        hasSavedSignature.value = true;
        ElMessage.success('签名保存成功');
        return { isEmpty: false, data };
      }
    }
    return { isEmpty: true, data: '' };
  } catch (error) {
    console.error('保存签名失败:', error);
    ElMessage.error('签名保存失败，请重试');
    return { isEmpty: true, data: '' };
  }
};

/**
 * 还原签名
 * 从后端API获取保存的签名并加载到签名板
 */
const restoreSignature = async () => {
  try {
    const response = await getSignatureDetail();
    if (response && response.data && response.data.url && signaturePad.value) {
      await signaturePad.value.fromDataURL(response.data.url);
      hasSignature.value = true;
      savedSignature.value = response.data.url;
      hasSavedSignature.value = true;
    }
  } catch (error) {
    ElMessage.error('还原签名失败');
    console.error('还原签名失败:', error);
  }
};

/**
 * 下载签名图片
 * 直接从签名板获取数据并下载为PNG格式图片
 */
const downloadSignature = () => {
  if (signaturePad.value && !signaturePad.value.isEmpty()) {
    const data = signaturePad.value.save('image/png');
    if (data) {
      const byteCharacters = atob(data.split(',')[1]);
      const byteArrays = [];
      const sliceSize = 512;
      
      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);
        
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      
      const blob = new Blob(byteArrays, { type: 'image/png' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `signature_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }
};

/**
 * 获取签名数据
 * @returns {Object} 包含isEmpty和data的对象
 */
const getSignatureData = () => {
  if (signaturePad.value) {
    const data = signaturePad.value.save('image/png');
    const isEmpty = signaturePad.value.isEmpty();
    return { isEmpty, data };
  }
  return { isEmpty: true, data: '' };
};

/**
 * 从数据URL加载签名
 * @param {string} dataUrl - 签名的base64数据
 * @param {Object} options - 加载选项
 */
const loadSignature = async (dataUrl, options = {}) => {
  try {
    if (signaturePad.value) {
      await signaturePad.value.fromDataURL(dataUrl, options);
      hasSignature.value = true;
    }
  } catch (error) {
    console.error('加载签名失败:', error);
  }
};

/**
 * 检查签名是否为空
 * @returns {boolean} 签名是否为空
 */
const isSignatureEmpty = () => {
  return signaturePad.value ? signaturePad.value.isEmpty() : true;
};

/**
 * 调整签名板尺寸以适应屏幕
 * 根据设备类型和屏幕尺寸自动调整签名板大小
 */
const adjustSignaturePadSize = () => {
  const wrapper = signatureWrapper.value;
  if (wrapper) {
    const isMobile = window.innerWidth <= 768;
    const isPortrait = window.innerHeight > window.innerWidth;
    
    if (isMobile && isPortrait) {
      showRotateTip.value = true;
      canvasHeight.value = '280rpx';
    } else {
      showRotateTip.value = false;
      if (isMobile) {
        canvasHeight.value = '280rpx';
      } else {
        canvasHeight.value = '280rpx';
      }
    }
  }
};

/**
 * 窗口大小改变事件处理
 * 当窗口大小改变时调整签名板尺寸
 */
const handleResize = () => {
  adjustSignaturePadSize();
};

/**
 * 初始化签名板
 * 确保签名板正确加载并显示从后端获取的签名
 */
const initSignaturePad = async () => {
  try {
    adjustSignaturePadSize();
    setTimeout(async () => {
      try {
        const response = await getSignatureDetail();
        if (response && response.data && response.data.url && signaturePad.value) {
          await signaturePad.value.fromDataURL(response.data.url);
          hasSignature.value = true;
          savedSignature.value = response.data.url;
          hasSavedSignature.value = true;
        }
      } catch (error) {
        console.error('加载签名数据失败:', error);
      }
    }, 100);
  } catch (error) {
    console.error('初始化签名板失败:', error);
  }
};

/**
 * 组件挂载时初始化
 * 设置窗口大小监听器并调整签名板尺寸
 */
onMounted(() => {
  window.addEventListener('resize', handleResize);
  initSignaturePad().catch(error => {
    console.error('组件初始化失败:', error);
  });
});

/**
 * 组件卸载前清理
 * 移除窗口大小监听器
 */
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});

defineExpose({
  clearSignature,
  undoSignature,
  saveSignature,
  restoreSignature,
  initSignaturePad,
  getSignatureData,
  loadSignature,
  isSignatureEmpty
});
</script>

<style scoped>
.electronic-signature-container {
  width: 100%;
  max-width: 800rpx;
  margin: 0 auto;
  padding: 20rpx;
  background: #fff;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}

.signature-header {
  text-align: center;
  margin-bottom: 20rpx;
}

.signature-title {
  font-size: 18rpx;
  font-weight: 600;
  color: #333;
  margin: 0 0 8rpx 0;
}

.signature-tip {
  font-size: 12rpx;
  color: #666;
  margin: 0;
}

.signature-tip-red {
  font-size: 12rpx;
  color: #f44336;
  margin-top: 4rpx;
}

.signature-wrapper {
  width: 100%;
  border: 2rpx dashed #ddd;
  border-radius: 8rpx;
  overflow: hidden;
  background: #fafafa;
  position: relative;
  touch-action: none;
}

.signature-pad {
  width: 100%;
  height: 100%;
}

.rotate-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.rotate-icon {
  font-size: 48rpx;
  animation: rotatePhone 2s ease-in-out infinite;
  margin-bottom: 16rpx;
}

.rotate-text {
  color: #fff;
  font-size: 18rpx;
  font-weight: 600;
  margin: 0;
  text-align: center;
}

@keyframes rotatePhone {
  0%, 100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(90deg);
  }
}

.signature-actions {
  display: flex;
  justify-content: center;
  gap: 12rpx;
  margin-top: 20rpx;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6rpx;
  padding: 10rpx 20rpx;
  border: none;
  border-radius: 6rpx;
  font-size: 14rpx;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 100rpx;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.clear-btn {
  background: #f5f5f5;
  color: #666;
}

.clear-btn:hover:not(:disabled) {
  background: #e0e0e0;
}

.undo-btn {
  background: #e3f2fd;
  color: #1976d2;
}

.undo-btn:hover:not(:disabled) {
  background: #bbdefb;
}

.restore-btn {
  background: #fff3e0;
  color: #e65100;
}

.restore-btn:hover:not(:disabled) {
  background: #ffe0b2;
}

.save-btn {
  background: #4caf50;
  color: white;
}

.save-btn:hover:not(:disabled) {
  background: #45a049;
}

.btn-icon {
  font-size: 16rpx;
}

.btn-text {
  font-size: 14rpx;
}

.download-btn {
  background: #2196f3;
  color: white;
}

.download-btn:hover:not(:disabled) {
  background: #1976d2;
}

@media (max-width: 768rpx) {
  .electronic-signature-container {
    padding: 12rpx;
    border-radius: 8rpx;
  }

  .signature-title {
    font-size: 16rpx;
  }

  .signature-tip {
    font-size: 12rpx;
  }

  .signature-actions {
    gap: 8rpx;
  }

  .action-btn {
    padding: 8rpx 16rpx;
    min-width: 80rpx;
    font-size: 13rpx;
  }

  .btn-icon {
    font-size: 14rpx;
  }

  .btn-text {
    font-size: 13rpx;
  }
}

@media (max-width: 480rpx) {
  .electronic-signature-container {
    padding: 4rpx;
  }

  .signature-title {
    font-size: 14rpx;
  }

  .signature-actions {
    gap: 6rpx;
  }

  .action-btn {
    padding: 8rpx 12rpx;
    min-width: 70rpx;
  }
}
</style>
