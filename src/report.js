import config from './config';
import { generateUniqueId } from './utils';
import { addCache, getCache, clearCache } from './cache';
export const originalProto = XMLHttpRequest.prototype;
export const originalOpen = XMLHttpRequest.prototype.open;
export const originalSend = XMLHttpRequest.prototype.send;

export function isSupportSendBeacon() {
  return 'sendBeacon' in navigator
}

export function report(data) {
  if (!config.url) {
    console.error('请设置上传url地址')
  }
  const reportData = JSON.stringify({
    id: generateUniqueId(),
    data
  })

  // 不同方式上报数据
  if (config.isImageUpload) {
    imgRequest(reportData)
  } else {
    // 优先使用sendBeacon
    if (isSupportSendBeacon()) {
      return beaconRequest(reportData)
    } else {
      xhrRequest(reportData)
    }
  }
}

// 批量上报数据
export function lazyReportBatch(data) {
  addCache(data)
  const dataCache = getCache()
  console.error('dataCache:', dataCache)
  if (dataCache.length && dataCache.length > config.batchSize) {
    report(dataCache)
    clearCache()
  }
}

// 图片发送数据
export function imgRequest(data) {
  const img = new Image()
  img.src = `${config.url}?data=${encodeURIComponent(JSON.stringify(data))}`
}
// 普通ajax发送数据
export function xhrRequest(data) {
  if (window.requestIdleCallback) {
    window.requestIdleCallback(
      () => {
        const xhr = new XMLHttpRequest()
        originalOpen.call(xhr, 'post', config.url)
        originalSend.call(xhr, JSON.stringify(data))
      },
      { timeout: 3000 }
    )
  } else {
    setTimeout(() => {
      const xhr = new XMLHttpRequest()
      originalOpen.call(xhr, 'post', config.url)
      originalSend.call(xhr, JSON.stringify(data))
    })
  }
}

export function beaconRequest(data) {
  if (window.requestIdleCallback) {
    window.requestIdleCallback(
      () => {
        window.navigator.sendBeacon(config.url, data)
      },
      { timeout: 3000 }
    )
  } else {
    setTimeout(() => {
      window.navigator.sendBeacon(config.url, data)
    })
  }
}
