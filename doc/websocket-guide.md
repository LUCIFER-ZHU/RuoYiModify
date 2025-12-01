# WebSocket 实时通信开发指南

## 📦 依赖

```bash
npm install sockjs-client@1.6.1 @stomp/stompjs@7.0.0 --save
```

## ⚙️ 配置

在 `.env` 文件中配置：

```env
# WebSocket 服务器地址
VITE_WS_URL=http://localhost:8080/ws

# 是否启用 WebSocket（可选，默认启用）
# 设置为 'false' 时禁用
VITE_ENABLE_WEBSOCKET=false
```

## 🚀 快速使用

### 方式一：组合式钩子（推荐）

```vue
<script setup>
import { useUserChannelSubscription } from '@/utils/socketClient'

// 订阅用户个人消息（自动取消订阅）
useUserChannelSubscription((data) => {
  console.log('收到消息:', data)
})
</script>
```

### 方式二：工具类

```javascript
import socketClient from '@/utils/socketClient'

// 订阅主题
const unsubscribe = socketClient.subscribe('/topic/test', (data) => {
  console.log('收到消息:', data)
})

// 取消订阅
onUnmounted(() => {
  unsubscribe()
})
```

## 📡 常用 API

### useSocket()

```javascript
import { useSocket } from '@/utils/socketClient'

const { 
  isConnected,        // 是否已连接
  status,             // 连接状态
  subscribedTopics,   // 已订阅主题
  subscribe,          // 订阅方法
  send                // 发送消息
} = useSocket()
```

### 订阅钩子

```javascript
// 订阅用户个人频道
useUserChannelSubscription(callback)

// 订阅系统广播频道
useSystemChannelSubscription(callback)

// 订阅自定义主题（自动取消订阅）
useTopicSubscription('/topic/test', callback)
```

### socketClient 工具类

```javascript
import socketClient from '@/utils/socketClient'

// 订阅主题
socketClient.subscribe(topic, callback)

// 取消订阅
socketClient.unsubscribe(topic)

// 发送消息
socketClient.send(destination, body)

// 检查连接状态
socketClient.isConnected()
```

## 🎨 常用主题

| 主题 | 说明 |
|------|------|
| `/topic/system` | 系统广播 |
| `/user/{userId}/queue/notifications` | 用户个人消息 |
| `/topic/order-updates` | 订单更新 |

## 💡 使用示例

### 通知小铃铛

```vue
<template>
  <el-badge :value="count">
    <el-icon><Bell /></el-icon>
  </el-badge>
</template>

<script setup>
import { ref } from 'vue'
import { useUserChannelSubscription } from '@/utils/socketClient'

const count = ref(0)
useUserChannelSubscription(() => { count.value++ })
</script>
```

### 实时刷新列表

```vue
<script setup>
import { ref } from 'vue'
import { useTopicSubscription } from '@/utils/socketClient'

const list = ref([])

useTopicSubscription('/topic/order-updates', (data) => {
  if (data.action === 'create') {
    list.value.unshift(data.order)
  }
})
</script>
```

### 系统广播

```vue
<script setup>
import { useSystemChannelSubscription } from '@/utils/socketClient'
import { ElNotification } from 'element-plus'

useSystemChannelSubscription((data) => {
  ElNotification({
    title: '系统公告',
    message: data.message
  })
})
</script>
```

## 🔧 功能开关

### 禁用 WebSocket

在 `.env` 文件中设置：

```env
VITE_ENABLE_WEBSOCKET=false
```

### 启用 WebSocket（默认）

不设置或设置为其他值都表示启用：

```env
# 方式1: 不设置该变量（默认启用）
# 方式2: 明确设置为 true
VITE_ENABLE_WEBSOCKET=true
```

### 禁用后的行为

- ✅ 不会建立 WebSocket 连接
- ✅ 订阅操作会被忽略（不会报错）
- ✅ 不影响系统其他功能
- ✅ 控制台输出提示：`⚠️ WebSocket 功能已禁用`

## 🐛 调试

### 查看连接状态

```javascript
import { useSocket } from '@/utils/socketClient'
const { status, isConnected, subscribedTopics } = useSocket()

console.log('状态:', status.value)
console.log('已连接:', isConnected.value)
console.log('订阅列表:', subscribedTopics.value)
```

### 查看日志

开发环境会自动输出详细日志：

```
✅ WebSocket 连接成功
📢 订阅主题: /topic/system
📨 收到消息 [/topic/system]: {...}
```

## ⚠️ 注意事项

1. **自动连接**: 登录后自动连接，退出后自动断开，无需手动管理
2. **自动重连**: 网络断开会自动重连（最多5次）
3. **取消订阅**: 使用钩子会自动取消订阅，使用工具类需手动取消
4. **消息格式**: 服务器推送的消息必须是 JSON 格式

## 📞 后端配置（Spring Boot）

```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOrigins("*")
                .withSockJS();
    }
    
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue");
        config.setApplicationDestinationPrefixes("/app");
        config.setUserDestinationPrefix("/user");
    }
}
```

### 消息推送

```java
@Autowired
private SimpMessagingTemplate messagingTemplate;

// 发送给特定用户
messagingTemplate.convertAndSendToUser(
    userId, 
    "/queue/notifications", 
    message
);

// 广播
messagingTemplate.convertAndSend("/topic/system", message);
```

---

**示例组件**: `src/components/Website/WebSocketExample/index.vue`

