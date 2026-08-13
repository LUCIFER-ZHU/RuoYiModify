import Components from 'unplugin-vue-components/vite'
import { VantResolver } from '@vant/auto-import-resolver'

/**
 * Vue 组件按需注册 + 样式按需引入
 * - VantResolver 会扫描模板中的 <van-xxx> 标签
 * - 自动 import 对应的 Vant 组件并完成局部注册
 * - 自动 import 对应的 Vant 组件 CSS（vant/es/<component>/style）
 * - 与 Element Plus 共存：VantResolver 只处理 vant 前缀的组件，Element Plus 不受影响
 *
 * 注意：不要配置 dirs 扫描项目业务组件目录
 * 项目业务组件（如 FormDialog / DetailDialog）重名极多，扫描它们只会产生大量冲突告警
 * 业务组件本就该在 <script setup> 中显式 import，无需插件代劳
 * - dts 关闭：避免在项目根目录生成 components.d.ts
 */
export default function createVueComponents() {
    return Components({
        resolvers: [VantResolver()],
        dts: false
    })
}