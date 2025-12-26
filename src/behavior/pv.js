import { lazyReportBatch } from '../report';
import { generateUniqueId } from '../utils';
// page view -- 页面被加载次数（路由切换或页面load时触发）
export default function pv() {
    const reportData = {
        type: 'behavior',
        subType: 'pv',
        startTime: performance.now(),
        pageUrl: window.location.href,
        referror: document.referrer,
        uuid: generateUniqueId(),
    }
    lazyReportBatch(reportData)
}