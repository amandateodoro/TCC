import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [vue()],
  resolve: {
    dedupe: ['vue', 'vue-router'],
    alias: {
      vue: path.resolve(rootDir, 'node_modules/vue/dist/vue.runtime.esm-bundler.js'),
      'vue-router': path.resolve(rootDir, 'node_modules/vue-router/dist/vue-router.mjs')
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173
  }
})