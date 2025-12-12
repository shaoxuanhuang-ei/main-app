import { lazyReportBatch } from "../report"
import { XMLHttpRequest } from 'xmlhttprequest' //fixme
// 重写ajax:ajax底层是xhr实现的，拿到xhr的原型，重写open和send方法
export const originalProto = XMLHttpRequest.prototype
export const originalSend = originalProto.send // 保存原生方法，以防后续要用
export const originalOpen = originalProto.open

function overwriteOpenAndSend() {
  originalProto.open = function newOpen(...args) {
    this.url = args[1]
    this.method = args[0]
    originalOpen.apply(this, args)
  }
  originalProto.send = function newSend(...args) {
    this.startTime = Date.now() //记录ajax开始发送时间
    const onLoaded = () => {
      this.endTime = Date.now() // 记录结束时间
      this.duration = this.endTime - this.startTime
      const { url, method, startTime, endTime, duration, status } = this // status: ajax响应状态
      const reportData = {
        status,
        duration,
        startTime,
        endTime,
        url,
        method: method.toUpperCase(),
        type: 'performance',
        success: status >= 200 && status < 300,
        subType: 'xhr'
      }
      // todo 发送数据
      lazyReportBatch(reportData)
      this.removeEventListener('load', onLoaded, true)
    }
    this.addEventListener('load', onLoaded, true)
    originalSend.apply(this, args)
  }
}

export default function xhr() {
  overwriteOpenAndSend()
}