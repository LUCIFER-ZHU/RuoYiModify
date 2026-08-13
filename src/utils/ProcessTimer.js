/**
 * 工序计时器工具类
 * @description 用于工序作业的计时管理，支持开始、暂停、恢复、停止等操作
 * @example
 * const timer = new ProcessTimer()
 * timer.start((formattedTime) => { displayTime.value = formattedTime })
 * timer.pause()
 * const duration = timer.stop() // 返回总工时(ms)并重置
 */
class ProcessTimer {
  constructor() {
    this.startTime = 0
    this.accumulatedTime = 0
    this.running = false
    this.timer = null
    this.onTickCallback = null
  }

  /**
   * 获取当前计时器状态快照
   * @returns {{ startTime: number, accumulatedTime: number, running: boolean }}
   */
  get state() {
    return {
      startTime: this.startTime,
      accumulatedTime: this.accumulatedTime,
      running: this.running
    }
  }

  /**
   * 开始计时
   * @param {(formattedTime: string) => void} [onTick] - 每秒回调，传入格式化时间字符串 hh:mm:ss
   */
  start(onTick) {
    if (this.running) return
    if (onTick) this.onTickCallback = onTick

    this.startTime = Date.now()
    this.running = true
    this._resumeLoop()
  }

  /**
   * 恢复计时（用于页面唤醒、切后台返回等场景）
   */
  resume() {
    if (this.running) {
      this._resumeLoop()
    }
  }

  /**
   * 暂停计时
   */
  pause() {
    if (!this.running) return

    this.accumulatedTime += Date.now() - this.startTime
    this.running = false
    this._triggerTick()
    this._stopLoop()
  }

  /**
   * 停止计时并完全重置
   * @returns {number} 本次工序的最终总工时毫秒数
   */
  stop() {
    const duration = this.getElapsedTime()

    this.startTime = 0
    this.accumulatedTime = 0
    this.running = false
    this._triggerTick()
    this._stopLoop()

    return duration
  }

  /**
   * 获取当前累计流逝毫秒数
   * @returns {number}
   */
  getElapsedTime() {
    if (this.running) {
      return this.accumulatedTime + (Date.now() - this.startTime)
    }
    return this.accumulatedTime
  }

  /**
   * 格式化输出 hh:mm:ss
   * @returns {string}
   */
  getFormattedTime() {
    const totalSeconds = Math.floor(this.getElapsedTime() / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    return [
      String(hours).padStart(2, '0'),
      String(minutes).padStart(2, '0'),
      String(seconds).padStart(2, '0')
    ].join(':')
  }

  /**
   * 是否正在计时
   * @returns {boolean}
   */
  isRunning() {
    return this.running
  }

  /**
   * 从缓存恢复计时器状态
   * @param {{ startTime: number, accumulatedTime: number, running: boolean }} data - 状态数据
   * @param {(formattedTime: string) => void} [onTick] - 每秒回调
   */
  restore(data, onTick) {
    this.startTime = data.startTime || 0
    this.accumulatedTime = data.accumulatedTime || 0
    this.running = data.running || false

    if (onTick) this.onTickCallback = onTick

    if (this.running) {
      this._resumeLoop()
    } else {
      this._triggerTick()
    }
  }

  /**
   * 销毁计时器，清理定时器
   */
  destroy() {
    this._stopLoop()
    this.onTickCallback = null
  }

  /**
   * 恢复定时器轮询
   * @private
   */
  _resumeLoop() {
    this._stopLoop()
    this._triggerTick()

    this.timer = setInterval(() => {
      this._triggerTick()
    }, 1000)
  }

  /**
   * 触发回调刷新UI
   * @private
   */
  _triggerTick() {
    if (this.onTickCallback) {
      this.onTickCallback(this.getFormattedTime())
    }
  }

  /**
   * 停止定时器轮询
   * @private
   */
  _stopLoop() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }
}

export default ProcessTimer