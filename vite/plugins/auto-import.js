import autoImport from 'unplugin-auto-import/vite'
import { VantResolver } from '@vant/auto-import-resolver'

/**
 * 自动按需引入依赖
 * - vue / vue-router / pinia：项目核心运行时 API（内置预设）
 * - vant：通过 VantResolver 让 Vant 函数式 API（showToast、showConfirmDialog 等）自动按需 import
 *   配合 Vite Tree Shaking 实现 JS 完全按需打包
 *   组件标签（如 <van-field>）由 unplugin-vue-components + VantResolver 接管，自动注册 + 自动按需引入样式
 * - Element Plus 已通过 main.js 全量注册，与 Vant 类名前缀（el- vs van-）和 CSS 变量前缀（--el- vs --van-）均无冲突
 */
export default function createAutoImport() {
    return autoImport({
        imports: [
            'vue',
            'vue-router',
            'pinia'
        ],
        resolvers: [VantResolver()],
        dts: false
    })
}