import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import createVitePlugins from './vite/plugins'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'
import importToCDN from 'vite-plugin-cdn-import'

const baseUrl = 'http://localhost:8080' // 后端接口

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd())
  const { VITE_APP_ENV } = env

  const isProd = command === 'build'

  return {
    base: VITE_APP_ENV === 'production' ? '/' : '/',
    plugins: [
      createVitePlugins(env, command === 'build'),

      // 打包体积分析
      // isProd &&
      //   visualizer({
      //     filename: 'stats.html',
      //     open: false,
      //     gzipSize: true,
      //     brotliSize: true
      //   }),

      // gzip 压缩
      viteCompression({
        algorithm: 'gzip',
        ext: '.gz',
        deleteOriginFile: false // 保留源文件，Nginx 自动选择 gzip
      }),
      // brotli 压缩
      viteCompression({
        algorithm: 'brotliCompress',
        ext: '.br',
        deleteOriginFile: false
      })
    ],
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './'),
        '@': path.resolve(__dirname, './src')
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    build: {
      sourcemap: command === 'build' ? false : 'inline',
      outDir: 'dist',
      assetsDir: 'assets',
      chunkSizeWarningLimit: 2000,
      reportCompressedSize: true,
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
          // 🔑 关键：拆包
          manualChunks: {
            vue: ['vue', 'vue-router', 'pinia'],
            echarts: ['echarts'],
            utils: ['axios', 'lodash-es', 'js-cookie']
          }
        }
      }
    },
    server: {
      port: 8080,
      host: true,
      open: true,
      proxy: {
        '/dev-api': {
          target: baseUrl,
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/dev-api/, '')
        },
        '^/v3/api-docs/(.*)': {
          target: baseUrl,
          changeOrigin: true
        }
      }
    },
    css: {
      postcss: {
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === 'charset') {
                  atRule.remove()
                }
              }
            }
          }
        ]
      }
    }
  }
})
