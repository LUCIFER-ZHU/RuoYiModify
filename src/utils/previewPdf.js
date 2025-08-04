// 通用PDF预览方法
// getPdfFunc: (row) => Promise<arraybuffer|string>
// row: 当前表格行
import { ElMessage } from 'element-plus';

export async function handlePreviewPdf(row, getPdfFunc) {
  try {
    const res = await getPdfFunc(row);
    // 检查返回的数据类型
    let blob;
    if (res instanceof ArrayBuffer) {
      blob = new Blob([res], { type: 'application/pdf' });
    } else if (typeof res === 'string') {
      const uint8 = new TextEncoder().encode(res);
      blob = new Blob([uint8], { type: 'application/pdf' });
    } else {
      blob = new Blob([res], { type: 'application/pdf' });
    }
    const url = window.URL.createObjectURL(blob);
    // 新窗口打开
    const previewWindow = window.open(url, '_blank');
    if (!previewWindow) {
      ElMessage.warning('浏览器阻止了弹出窗口，请允许弹出窗口后重试');
      return;
    }
    // 30秒后释放资源
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 30000);
  } catch (error) {
    console.error('PDF预览错误:', error);
    ElMessage.error(error?.response?.message || error?.message || '合同预览失败');
  }
} 