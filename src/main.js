import { createApp } from 'vue'
import { registerMicroApps, start, initGlobalState } from 'qiankun'
import './style.css'
import App from './App.vue'
import router from './router'

import {
  onCLS,
  onINP,
  onLCP,
} from 'https://unpkg.com/web-vitals@5/dist/web-vitals.attribution.js?module';
onCLS(console.log);
onINP(console.log);
onLCP(console.log);

// 初始化全局状态
const globalActions = initGlobalState({
  refreshView: false, //是否刷新路由视图
  is404: false, //是否是404页面
  isMenuSelected: '', //当前左侧菜单选中
})

// 供主应用修改全局状态
globalActions.onGlobalStateChange = (newState) => {
  globalActions.setGlobalState(newState)
}

// 注册子应用
const microApps = [
  {
    name: 'vue-sub-app',
    entry: 'http://localhost:3001', //子应用入口
    container: '#micro-app-container', //子应用挂载节点
    activeRule: '/vue-app', //子应用激活路径
    props: {
      globalActions,
      mainAppName: 'Vue3MainApp' // 主应用向子应用传递的参数
    },
  },
  {
    name: 'react-app',
    entry: 'http://localhost:3000', //子应用入口
    container: '#micro-app-container', //子应用挂载节点
    activeRule: '/react-app', //子应用激活路径
    props: {
      globalActions,
      mainAppName: 'Vue3MainApp' // 主应用向子应用传递的参数
    },
  }
]
registerMicroApps(microApps)

// 启动qiankun
start({
  errorHandler: (err) => {
    console.error('子应用加载异常：', err);
    alert(`子应用加载失败，请刷新重试\n错误信息：${err.message}`);
  }
})
createApp(App)
  .use(router)
  .provide('globalActions', globalActions) //提供全局状态
  .mount('#app')