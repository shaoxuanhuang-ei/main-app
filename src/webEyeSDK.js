// 统一的SDK入口
import { setConfig } from "./config"
import { lazyReportBatch } from "./report"
import performance from "./performance/index"
import behavior from "./behavior/index"
import error from "./error/index"

window.__webEyeSDK__ = {
  version: '0.0.1'
}

export function install(Vue, options) {
  if (__webEyeSDK__.vue) return // 说明已经注册过了
  __webEyeSDK__.vue = true
  setConfig(options)
  const handler = Vue.config.errorHandler
  // vue项目中 通过Vue.config.errorHandler 捕获错误
  Vue.config.errorHandler = function (err, vm, info) {
    // todo 上报错误信息

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

    if (handler) {
      handler.call(this, err, vm, info)
    }
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
  // error()
  // performance()
  behavior()
}

export default {
  install,
  errorBoundary,
  init,
  performance,
  behavior,
  error
}