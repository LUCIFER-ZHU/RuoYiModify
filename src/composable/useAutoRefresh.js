import { watch } from 'vue'
import { useRoute } from 'vue-router'
import usePermissionStore from '@/store/modules/permission'

/**
 * 自动刷新 Hook
 * 自动获取当前路由名称作为 menuId，监听 store 中的刷新信号
 * @param {Function} refreshCallback - 刷新回调函数
 */
export function useAutoRefresh(refreshCallback) {
  const route = useRoute()
  const permissionStore = usePermissionStore()

  console.log(`[AutoRefresh] 初始化: ${route.name}`)

  // 监听 store 中的刷新信号
  watch(
    () => permissionStore.refreshSignals[route.name],
    (newVal, oldVal) => {
      // 如果收到新的刷新信号（时间戳变化），则执行刷新
      if (newVal && newVal !== oldVal) {
        console.log(`[AutoRefresh] 收到刷新信号: ${route.name}`)
        if (refreshCallback && typeof refreshCallback === 'function') {
          setTimeout(() => {
            refreshCallback()
          }, 1000)
        }
      }
    }
  )
}
