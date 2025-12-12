import { lazyReportBatch } from '../report'
export default function error() {
  // 捕获资源加载失败的错误：js，css，img
  window.addEventListener('error', function(e) {
    const target = e.target
    if (!target) return

    if (target.src || target.href) {
      const url = target.src || target.href
      const reportData = {
        type: 'error',
        subType: 'resource',
        url,
        html: target.outerHTML,
        pageUrl: window.location.href,
        paths: e.path // 资源具体路径
      }
      // todo 发送错误信息
      lazyReportBatch(reportData)
    }
  }, true)

  // 捕获js错误
  window.onerror = function(msg, url, lineNo, columnNo, error) {
    const reportData = {
      type: 'error',
      subType: 'js',
      msg,
      url,
      lineNo,
      columnNo,
      stack: error.stack,
      pageUrl: window.location.href,
      startTime: performance.now()
    }
    // todo 发送错误信息
    lazyReportBatch(reportData)
  }

  // 捕获promise错误 async await
  window.addEventListener('unhandledrejection', function(e) {
    const reportData = {
      type: 'error',
      subType: 'promise',
      msg: e.reason?.stack, // 错误栈
      pageUrl: window.location.href,
      startTime: e.timeStamp // performance.now()
    }
    // todo 发送错误信息
    lazyReportBatch(reportData)
  }, true)
}