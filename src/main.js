import { createApp } from 'vue'
import { registerMicroApps, start } from 'qiankun'
import './style.css'
import App from './App.vue'
import router from './router'

// 注册子应用
const microApps = [
  {
    name: 'react-app',
    entry: 'http://localhost:3000', //子应用入口
    container: '#micro-app-container', //子应用挂载节点
    activeRule: '/react-app', //子应用激活路径
    props: {
      token: 'main-app-token', // 主应用向子应用传递的参数
    },
  }
]
// 关键：打印实际注册的子应用配置，查看 entry 是否为空
console.log('注册的子应用配置：', microApps); 
registerMicroApps(microApps)
createApp(App).use(router).mount('#app')

// 启动qiankun
start()