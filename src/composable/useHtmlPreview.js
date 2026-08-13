import { ref, onBeforeUnmount } from 'vue';
import { ElMessage, ElLoading } from 'element-plus';

/**
 * HTML预览Hook
 * @returns {Object} 预览相关状态和方法
 */
export function useHtmlPreview() {
  const previewVisible = ref(false);
  const previewUrl = ref('');
  const previewTitle = ref('预览');
  const previewFileName = ref('document.html');
  const previewLoading = ref(false);

  /**
   * 打开预览
   * @param {Function} apiFunc - API请求函数，返回Promise<Blob>
   * @param {string} title - 弹窗标题
   * @param {string} fileName - 下载文件名
   */
  const handleHtmlPreview = (apiFunc, title = '预览', fileName = 'document.html') => {
    const loadingInstance = ElLoading.service({
      lock: true,
      text: '正在生成预览...',
      background: 'rgba(0, 0, 0, 0.7)',
    });
    
    previewLoading.value = true;
    
    return apiFunc().then(response => {
      // 释放旧的URL
      if (previewUrl.value) {
        window.URL.revokeObjectURL(previewUrl.value);
      }
      
      const blob = new Blob([response], { type: 'text/html' });
      previewUrl.value = window.URL.createObjectURL(blob);
      previewTitle.value = title;
      previewFileName.value = fileName;
      previewVisible.value = true;
      return response;
    }).catch((error) => {
      console.error('预览失败:', error);
    }).finally(() => {
      loadingInstance.close();
      previewLoading.value = false;
    });
  };

  /**
   * 关闭预览时的清理
   */
  const closePreview = () => {
    previewVisible.value = false;
  };

  // 组件卸载时清理资源
  onBeforeUnmount(() => {
    if (previewUrl.value) {
      window.URL.revokeObjectURL(previewUrl.value);
    }
  });

  return {
    previewVisible,
    previewUrl,
    previewTitle,
    previewFileName,
    previewLoading,
    handleHtmlPreview,
    closePreview
  };
}
