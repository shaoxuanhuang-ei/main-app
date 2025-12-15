// 统一的SDK入口
import { setConfig } from "./config"
import { lazyReportBatch } from "./report"
import performance from "./performance/index"
import behavior from "./behavior/index"
import error from "./error/index"
import { eventStoreInstance } from './store/eventStore.js'

window.__webEyeSDK__ = {
  version: '0.0.1'
}

export function install(Vue, options) {
  if (__webEyeSDK__.vue) return // 说明已经注册过了
  __webEyeSDK__.vue = true
  setConfig(options)

  // 注册自定义指令v-eye-track 用于标记需要收集点击事件的元素
  Vue.directive('eye-track', {
    mounted(el, binding) {
      // 为元素添加标记
      el.dataset.eyeTrack = binding.value || 'click'
    },
    updated(el, binding) {
      // 更新标记
      el.dataset.eyeTrack = binding.value || 'click'
    },
    unmounted(el) {
      delete el.dataset.eyeTrack
    }
  })

  // 初始化所有监控功能
  error()
  performance()
  behavior()


  const handler = Vue.config.errorHandler
  // vue项目中 通过Vue.config.errorHandler 捕获错误
  Vue.config.errorHandler = function (err, vm, info) {
    const reportData = {
      info,
      error: err.stack,
      subType: 'vue',
      type: 'error',
      startTime: window.performance.now(),
      pageUrl: window.location.href
    }
    console.log('vue error');
    lazyReportBatch(reportData)
    if (handler) handler.call(this, err, vm, info)
  }
}

function errorBoundary(err, info) {
  if (__webEyeSDK__.react) return
  __webEyeSDK__.react = true
  // todo 上报错误信息
    const reportData = {
      info,
      error: err?.stack,
      subType: 'react',
      type: 'error',
      startTime: window.performance.now(),
      pageUrl: window.location.href
    }
    lazyReportBatch(reportData)
}

export function init(options) {
  setConfig(options)
  error()
  performance()
  behavior()
}

export default {
  install,
  errorBoundary,
  init,
  performance,
  behavior,
  error,
  store: eventStoreInstance,
}