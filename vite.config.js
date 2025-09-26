import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8081,
    headers: {
      'Access-Control-Allow-Origin': '*' // 允许子应用跨域
    }
  }
})
