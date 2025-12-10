export function observerEvent() {
  const entryHandler = (list) => {
    const data = list.getEntries()
    for (let entry of data) {
      if (observer) {
        observer.disconnect() //暂停
      }
      const reportData = {
        name: entry.name, // 资源的名称
        type: 'performance', // 类型
        subType: entry.entryType, // 类型
        sourceType: entry.initiatorType, // 资源类型
        duration: entry.duration, // 加载时间
        dns: entry.domainLookupEnd - entry.domainLookupStart, // dns解析时间
        tcp: entry.connectEnd - entry.connectStart, // tcp加载时间
        redirect: entry.redirectEnd - entry.redirectStart, // 重定向时间
        ttfb: entry.responseEnd - entry.responseStart, // 服务器响应时间-首字节时间TTFB
        protocol: entry.nextHopProtocol, // 请求协议
        responseBodySize: entry.encodedBodySize, // 响应内容大小
        responseHeaderSize: entry.transferSize - entry.encodedBodySize, // 响应头部大小
        transferSize: entry.transferSize, // 请求内容大小
        resourceSize: entry.decodedBodySize, // 资源解压后大小
        startTime: performance.now()
      }
      console.log(entry);
      console.log('上报资源数据：', reportData);
          
    }
  }

  let observer = new PerformanceObserver(entryHandler)
  observer.observe({ type: ['resource'], buffered: true })
}