import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { isHttp, isEmpty } from "@/utils/validate"
import defAva from '@/assets/logo/minnuo-logo.png'
// 引入 WebSocket 客户端
import socketClient from '@/utils/socketClient'

const useUserStore = defineStore(
  'user',
  {
    state: () => ({
      token: getToken(),
      id: '',
      name: '',
      avatar: '',
      roles: [],
      permissions: []
    }),
    actions: {
      // 登录
      login(userInfo) {
        const username = userInfo.username.trim()
        const password = userInfo.password
        const code = userInfo.code
        const uuid = userInfo.uuid
        return new Promise((resolve, reject) => {
          login(username, password, code, uuid).then(res => {
            setToken(res.token)
            this.token = res.token
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      },
      // 获取用户信息
      getInfo() {
        return new Promise((resolve, reject) => {
          getInfo().then(async res => {
            const user = res.user
            let avatar = user.avatar || ""
            if (!isHttp(avatar)) {
              avatar = (isEmpty(avatar)) ? defAva : import.meta.env.VITE_APP_BASE_API + avatar
            }
            if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
              this.roles = res.roles
              this.permissions = res.permissions
            } else {
              this.roles = ['ROLE_DEFAULT']
            }
            this.id = user.userId
            this.name = user.userName
            this.avatar = avatar
            
            // 初始化 WebSocket 连接
            try {
              await this.initWebSocket()
            } catch (error) {
              console.error('WebSocket 初始化失败:', error)
              // WebSocket 连接失败不影响用户登录流程
            }
            
            resolve(res)
          }).catch(error => {
            reject(error)
          })
        })
      },
      // 退出系统
      logOut() {
        return new Promise((resolve, reject) => {
          logout(this.token).then(async () => {
            // 断开 WebSocket 连接
            try {
              await socketClient.disconnect()
            } catch (error) {
              console.error('WebSocket 断开连接失败:', error)
            }
            
            this.token = ''
            this.roles = []
            this.permissions = []
            removeToken()
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      },
      
      /**
       * 初始化 WebSocket 连接
       * @description 在用户登录后自动建立 WebSocket 连接
       * @returns {Promise<void>}
       */
      async initWebSocket() {
        try {
          // 检查是否启用 WebSocket 功能（默认启用，设置为 'false' 时禁用）
          if (import.meta.env.VITE_ENABLE_WEBSOCKET === 'false') {
            console.log('⚠️ WebSocket 功能已禁用')
            return
          }

          // 检查是否已经连接
          if (socketClient.isConnected()) {
            console.log('WebSocket 已连接，跳过初始化')
            return
          }

          // 获取 WebSocket 服务器地址（从环境变量读取或使用默认值）
          const wsUrl = import.meta.env.VITE_WS_URL || `${import.meta.env.VITE_APP_BASE_API}/ws`
          
          // 建立连接
          await socketClient.connect({
            wsUrl,
            userId: this.id,
            token: this.token
          })

          console.log('✅ WebSocket 连接初始化成功')
        } catch (error) {
          console.error('❌ WebSocket 连接初始化失败:', error)
          throw error
        }
      }
    }
  })

export default useUserStore
