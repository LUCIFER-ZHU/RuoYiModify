/**
 * 统一错误捕获与日志上报模块
 * @author Claude 3.5 Sonnet
 * @version 3.5
 * @date 2024
 */

import { ElMessage, ElNotification } from 'element-plus';
import useUserStore from '@/store/modules/user'

/**
 * 错误类型枚举
 */
const ERROR_TYPES = {
  VUE_ERROR: 'vue_error',           // Vue组件错误
  VUE_WARN: 'vue_warn',             // Vue警告
  PROMISE_REJECTION: 'promise_rejection', // Promise未捕获错误
  RESOURCE_ERROR: 'resource_error', // 资源加载错误
  SCRIPT_ERROR: 'script_error',     // 脚本错误
  NETWORK_ERROR: 'network_error',   // 网络错误
  CUSTOM_ERROR: 'custom_error'      // 自定义错误
};

/**
 * 错误严重程度
 */
const ERROR_LEVELS = {
  LOW: 'low',       // 低级错误，不影响主要功能
  MEDIUM: 'medium', // 中级错误，影响部分功能
  HIGH: 'high',     // 高级错误，影响核心功能
  CRITICAL: 'critical' // 严重错误，系统无法正常运行
};

/**
 * 错误信息收集器
 */
class ErrorCollector {
  constructor() {
    this.errorQueue = [];
    this.maxQueueSize = 100;
    this.reportUrl = '/api/error/report'; // 错误上报接口
    this.enableConsoleLog = true; // 是否启用控制台日志
    this.enableNotification = true; // 是否启用用户通知
  }

  /**
   * 收集错误信息
   * @param {Object} errorInfo - 错误信息对象
   */
  collect(errorInfo) {
    const error = this.formatError(errorInfo);
    
    // 添加到错误队列
    this.addToQueue(error);
    
    // 输出控制台日志
    if (this.enableConsoleLog) {
      this.logToConsole(error);
    }
    
    // 显示用户通知
    if (this.enableNotification) {
      this.showUserNotification(error);
    }
    
    // 上报错误（暂时注释掉）
    // this.reportError(error);
  }

  /**
   * 格式化错误信息
   * @param {Object} errorInfo - 原始错误信息
   * @returns {Object} 格式化后的错误信息
   */
  formatError(errorInfo) {
    const timestamp = new Date().toISOString();
    const userAgent = navigator.userAgent;
    const url = window.location.href;
    
    return {
      // 基础信息
      timestamp,
      url,
      userAgent,
      
      // 错误信息
      type: errorInfo.type || ERROR_TYPES.CUSTOM_ERROR,
      level: errorInfo.level || ERROR_LEVELS.MEDIUM,
      message: errorInfo.message || '未知错误',
      stack: errorInfo.stack || '',
      
      // 组件信息（Vue错误特有）
      componentName: errorInfo.componentName || '',
      propsData: errorInfo.propsData || null,
      
      // 网络错误信息
      status: errorInfo.status || null,
      statusText: errorInfo.statusText || '',
      
      // 用户信息
      userId: this.getUserId(),
      sessionId: this.getSessionId(),
      
      // 设备信息
      device: this.getDeviceInfo(),
      
      // 额外信息
      extra: errorInfo.extra || {}
    };
  }

  /**
   * 添加错误到队列
   * @param {Object} error - 错误对象
   */
  addToQueue(error) {
    this.errorQueue.push(error);
    
    // 限制队列大小
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift();
    }
  }

  /**
   * 输出控制台日志
   * @param {Object} error - 错误对象
   */
  logToConsole(error) {
    const logMethod = this.getConsoleMethod(error.level);
    const prefix = `[${error.type.toUpperCase()}]`;
    
    console.group(`${prefix} ${error.timestamp}`);
    console[logMethod]('错误信息:', error.message);
    
    if (error.stack) {
      console[logMethod]('错误堆栈:', error.stack);
    }
    
    if (error.componentName) {
      console[logMethod]('组件名称:', error.componentName);
    }
    
    console[logMethod]('完整错误对象:', error);
    console.groupEnd();
  }

  /**
   * 获取控制台输出方法
   * @param {String} level - 错误级别
   * @returns {String} 控制台方法名
   */
  getConsoleMethod(level) {
    switch (level) {
      case ERROR_LEVELS.LOW:
        return 'info';
      case ERROR_LEVELS.MEDIUM:
        return 'warn';
      case ERROR_LEVELS.HIGH:
      case ERROR_LEVELS.CRITICAL:
        return 'error';
      default:
        return 'log';
    }
  }

  /**
   * 显示用户通知
   * @param {Object} error - 错误对象
   */
  showUserNotification(error) {
    // 若标记为跳过用户通知（例如在 Promise 拒绝处已主动提示），则不再弹出
    if (error?.extra?.skipUserNotification) {
      return;
    }
    // 只对中高级错误显示通知，避免过度打扰用户
    if (error.level === ERROR_LEVELS.LOW) {
      return;
    }

    const config = {
      title: this.getNotificationTitle(error.type),
      message: this.getNotificationMessage(error),
      type: this.getNotificationType(error.level),
      duration: this.getNotificationDuration(error.level),
      showClose: true
    };

    // 严重错误使用通知，其他使用消息
    if (error.level === ERROR_LEVELS.CRITICAL) {
      ElNotification(config);
    } else {
      ElMessage({
        message: config.message,
        type: config.type,
        duration: config.duration,
        showClose: true
      });
    }
  }

  /**
   * 获取通知标题
   * @param {String} errorType - 错误类型
   * @returns {String} 通知标题
   */
  getNotificationTitle(errorType) {
    const titles = {
      [ERROR_TYPES.VUE_ERROR]: '组件错误',
      [ERROR_TYPES.VUE_WARN]: '组件警告',
      [ERROR_TYPES.PROMISE_REJECTION]: '异步操作错误',
      [ERROR_TYPES.RESOURCE_ERROR]: '资源加载错误',
      [ERROR_TYPES.SCRIPT_ERROR]: '脚本错误',
      [ERROR_TYPES.NETWORK_ERROR]: '网络错误',
      [ERROR_TYPES.CUSTOM_ERROR]: '系统错误'
    };
    
    return titles[errorType] || '未知错误';
  }

  /**
   * 获取通知消息
   * @param {Object} error - 错误对象
   * @returns {String} 通知消息
   */
  getNotificationMessage(error) {
    // 对用户显示友好的错误消息
    const friendlyMessages = {
      [ERROR_TYPES.NETWORK_ERROR]: '网络连接异常，请检查网络设置',
      [ERROR_TYPES.RESOURCE_ERROR]: '资源加载失败，请刷新页面重试',
      [ERROR_TYPES.VUE_ERROR]: '页面组件出现异常，请刷新页面',
      [ERROR_TYPES.PROMISE_REJECTION]: '操作执行失败，请重试'
    };

    return friendlyMessages[error.type] || '系统出现异常，请联系管理员';
  }

  /**
   * 获取通知类型
   * @param {String} level - 错误级别
   * @returns {String} 通知类型
   */
  getNotificationType(level) {
    switch (level) {
      case ERROR_LEVELS.LOW:
        return 'info';
      case ERROR_LEVELS.MEDIUM:
        return 'warning';
      case ERROR_LEVELS.HIGH:
      case ERROR_LEVELS.CRITICAL:
        return 'error';
      default:
        return 'warning';
    }
  }

  /**
   * 获取通知持续时间
   * @param {String} level - 错误级别
   * @returns {Number} 持续时间（毫秒）
   */
  getNotificationDuration(level) {
    switch (level) {
      case ERROR_LEVELS.LOW:
        return 3000;
      case ERROR_LEVELS.MEDIUM:
        return 5000;
      case ERROR_LEVELS.HIGH:
        return 8000;
      case ERROR_LEVELS.CRITICAL:
        return 0; // 不自动关闭
      default:
        return 5000;
    }
  }

  /**
   * 上报错误到服务器
   * @param {Object} error - 错误对象
   */
  async reportError(error) {
    try {
      // 只上报中高级错误，减少服务器压力
      if (error.level === ERROR_LEVELS.LOW) {
        return;
      }

      const response = await fetch(this.reportUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(error)
      });

      if (!response.ok) {
        console.warn('错误上报失败:', response.status, response.statusText);
      }
    } catch (reportError) {
      console.warn('错误上报异常:', reportError);
    }
  }

  /**
   * 获取用户ID
   * @returns {String} 用户ID
   */
  getUserId() {
    try {
      // 从localStorage或store中获取用户ID
      const userId = useUserStore().name      
      return userId || 'anonymous';
    } catch (e) {
      return 'anonymous';
    }
  }

  /**
   * 获取会话ID
   * @returns {String} 会话ID
   */
  getSessionId() {
    try {
      // 从sessionStorage中获取会话ID
      let sessionId = sessionStorage.getItem('sessionId');
      if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('sessionId', sessionId);
      }
      return sessionId;
    } catch (e) {
      return 'unknown_session';
    }
  }

  /**
   * 获取设备信息
   * @returns {Object} 设备信息
   */
  getDeviceInfo() {
    return {
      screen: `${screen.width}x${screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine
    };
  }

  /**
   * 获取错误队列
   * @returns {Array} 错误队列
   */
  getErrorQueue() {
    return [...this.errorQueue];
  }

  /**
   * 清空错误队列
   */
  clearErrorQueue() {
    this.errorQueue = [];
  }
}

// 创建错误收集器实例
const errorCollector = new ErrorCollector();

/**
 * 错误处理器主类
 */
class ErrorHandler {
  /**
   * 初始化错误处理器
   * @param {Object} app - Vue应用实例
   * @param {Object} options - 配置选项
   */
  static init(app, options = {}) {
    // 合并配置
    Object.assign(errorCollector, options);

    // 注册各种错误处理器
    // this.registerVueErrorHandler(app);
    this.registerGlobalErrorHandler();
    this.registerPromiseRejectionHandler();
    // this.registerResourceErrorHandler();

    console.info('错误处理器已初始化');
  }

  /**
   * 注册Vue错误处理器
   * @param {Object} app - Vue应用实例
   */
  static registerVueErrorHandler(app) {
    // Vue组件错误处理
    app.config.errorHandler = (error, instance, info) => {
      errorCollector.collect({
        type: ERROR_TYPES.VUE_ERROR,
        level: ERROR_LEVELS.HIGH,
        message: error.message,
        stack: error.stack,
        componentName: instance?.$options?.name || instance?.$options?.__name || 'Unknown',
        propsData: instance?.$props,
        extra: {
          errorInfo: info,
          componentData: instance?.$data
        }
      });
    };

    // Vue警告处理
    app.config.warnHandler = (msg, instance, trace) => {
      errorCollector.collect({
        type: ERROR_TYPES.VUE_WARN,
        level: ERROR_LEVELS.LOW,
        message: msg,
        stack: trace,
        componentName: instance?.$options?.name || instance?.$options?.__name || 'Unknown',
        propsData: instance?.$props
      });
    };
  }

  /**
   * 注册全局错误处理器
   */
  static registerGlobalErrorHandler() {
    window.addEventListener('error', (event) => {
      // 脚本错误
      if (event.filename) {
        errorCollector.collect({
          type: ERROR_TYPES.SCRIPT_ERROR,
          level: ERROR_LEVELS.HIGH,
          message: event.message,
          stack: `at ${event.filename}:${event.lineno}:${event.colno}`,
          extra: {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
          }
        });
      } else {
        // 资源加载错误
        const target = event.target || event.srcElement;
        if (target && target !== window) {
          errorCollector.collect({
            type: ERROR_TYPES.RESOURCE_ERROR,
            level: ERROR_LEVELS.MEDIUM,
            message: `资源加载失败: ${target.src || target.href || 'unknown'}`,
            extra: {
              tagName: target.tagName,
              src: target.src,
              href: target.href
            }
          });
        }
      }
    });
  }

  /**
   * 注册Promise拒绝处理器
   */
  static registerPromiseRejectionHandler() {
    window.addEventListener('unhandledrejection', (event) => {
      // 阻止浏览器默认未处理 Promise 的控制台噪声，交由自定义处理
      try { event.preventDefault && event.preventDefault(); } catch (_) {}
      const reason = event.reason;
      
      let errorInfo = {
        type: ERROR_TYPES.PROMISE_REJECTION,
        level: ERROR_LEVELS.MEDIUM,
        message: '未捕获的Promise拒绝'
      };

      if (reason instanceof Error) {
        errorInfo.message = reason.message;
        errorInfo.stack = reason.stack;
      } else if (typeof reason === 'string') {
        errorInfo.message = reason;
      } else if (reason && reason.message) {
        errorInfo.message = reason.message;
        errorInfo.stack = reason.stack;
      }

      // 检查是否为网络错误
      if (reason && (reason.code === 'NETWORK_ERROR' || reason.status)) {
        errorInfo.type = ERROR_TYPES.NETWORK_ERROR;
        errorInfo.status = reason.status;
        errorInfo.statusText = reason.statusText;
      }

      // 提取更友好的提示语，优先从常见的响应结构中读取
      // 兼容 axios 错误结构：response.data.message / response.message
      const userMessage = (
        reason?.response?.data?.message ||
        reason?.response?.message ||
        reason?.message ||
        (typeof reason === 'string' ? reason : '') ||
        '操作执行失败，请重试'
      );

      // 立即弹出错误原因提示，避免只显示通用文案
      ElMessage({ message: userMessage, type: 'error', showClose: true, duration: 5000 });

      // 避免重复弹窗：标记本条错误跳过通知中心的二次提示
      errorInfo.extra = Object.assign({}, errorInfo.extra, { skipUserNotification: true });

      errorCollector.collect(errorInfo);
    });
  }

  /**
   * 注册资源加载错误处理器
   */
  static registerResourceErrorHandler() {
    // 监听资源加载错误（图片、脚本、样式等）
    window.addEventListener('error', (event) => {
      const target = event.target;
      if (target && target !== window && (target.tagName === 'IMG' || target.tagName === 'SCRIPT' || target.tagName === 'LINK')) {
        errorCollector.collect({
          type: ERROR_TYPES.RESOURCE_ERROR,
          level: ERROR_LEVELS.MEDIUM,
          message: `${target.tagName}资源加载失败`,
          extra: {
            tagName: target.tagName,
            src: target.src || target.href,
            outerHTML: target.outerHTML
          }
        });
      }
    }, true);
  }

  /**
   * 手动上报错误
   * @param {Error|String} error - 错误对象或错误消息
   * @param {Object} extra - 额外信息
   * @param {String} level - 错误级别
   */
  static reportError(error, extra = {}, level = ERROR_LEVELS.MEDIUM) {
    let errorInfo = {
      type: ERROR_TYPES.CUSTOM_ERROR,
      level,
      extra
    };

    if (error instanceof Error) {
      errorInfo.message = error.message;
      errorInfo.stack = error.stack;
    } else {
      errorInfo.message = String(error);
    }

    errorCollector.collect(errorInfo);
  }

  /**
   * 获取错误统计信息
   * @returns {Object} 统计信息
   */
  static getErrorStats() {
    const errors = errorCollector.getErrorQueue();
    const stats = {
      total: errors.length,
      byType: {},
      byLevel: {},
      recentErrors: errors.slice(-10)
    };

    errors.forEach(error => {
      stats.byType[error.type] = (stats.byType[error.type] || 0) + 1;
      stats.byLevel[error.level] = (stats.byLevel[error.level] || 0) + 1;
    });

    return stats;
  }

  /**
   * 清除错误记录
   */
  static clearErrors() {
    errorCollector.clearErrorQueue();
  }
}

// 导出错误类型和级别常量
export { ERROR_TYPES, ERROR_LEVELS };

// 导出错误处理器
export default ErrorHandler;
