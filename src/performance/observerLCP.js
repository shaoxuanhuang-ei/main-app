// export default function observeLCP() {
//     const entryHandler = (list) => {
//         if (observer) { //观察的第一个LCP不一定是最终的
//             observer.disconnect()
//         }
//         for (const entry of list.getEntries()) { 
//             let LCP = entry.startTime
//             console.log(LCP);
            
//             const json = entry.toJSON()
//             console.log(json)
//             const reportData = {
//                 ...json,
//                 type: 'performance',
//                 subType: entry.name,
//                 pageUrl: window.location.href
//             }
//         }
//     }

//     // 统计和计算fp的时间
//     const observer = new PerformanceObserver(entryHandler)
//     // buffered: true 确保观察到所有paint事件
//     observer.observe({ type: 'largest-contentful-paint', buffered: true })
// // }

// 优化版本
import { lazyReportBatch } from "../report"
export default function observerLCP() {
    // 兼容处理：判断浏览器是否支持
    if (!('PerformanceObserver' in window) || !('LargestContentfulPaint' in window)) {
        console.warn('LCP 监测不被当前浏览器支持');
        return;
    }

    let lcpReported = false; // 标记是否已上报最终LCP
    const observerOptions = {
        type: 'largest-contentful-paint',
        buffered: true
    };

    const entryHandler = (list) => {
        const entries = list.getEntries();
        if (entries.length === 0) return;

        // 获取最后一个entry（最终的LCP）
        const lastEntry = entries[entries.length - 1];
        
        // 避免重复上报
        if (lcpReported) return;

        // 如果是图片元素，等待加载完成再上报(加载完成才能正确捕获图片，否则可能只捕获到占位符)
        if (lastEntry.element && lastEntry.element.tagName === 'IMG' && !lastEntry.element.complete) {
            lastEntry.element.addEventListener('load', () => {
                reportLCP(lastEntry);
                lcpReported = true;
            }, { once: true });
            return;
        }

        // 非图片元素直接上报
        reportLCP(lastEntry);
        lcpReported = true;
    };

    // 上报LCP数据
    const reportLCP = (entry) => {
        const json = entry.toJSON();
        console.log('LCP 最终指标:', json);
        
        const reportData = {
            ...json,
            type: 'performance',
            subType: 'largest-contentful-paint',
            pageUrl: window.location.href,
            lcpValue: entry.value, // LCP时间（毫秒）
            lcpElement: entry.element?.tagName || 'unknown', // LCP元素类型
            lcpUrl: entry.url || '' // 图片/资源URL
        };

        // 这里可以替换为你的上报逻辑（如接口上报）
        // console.log('上报LCP数据:', reportData);
        lazyReportBatch(reportData)
    };

    // 创建观察者
    const observer = new PerformanceObserver(entryHandler);
    try {
        observer.observe(observerOptions);
    } catch (err) {
        console.error('LCP监测初始化失败:', err);
    }

    // 页面卸载时确保上报（避免遗漏）
    window.addEventListener('beforeunload', () => {
        if (!lcpReported) {
            const entries = performance.getEntriesByType('largest-contentful-paint');
            if (entries.length > 0) {
                reportLCP(entries[entries.length - 1]);
            }
        }
    }, { once: true });
}