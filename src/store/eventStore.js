import { defineStore } from 'pinia';
import * as rrweb from 'rrweb';
import rrwebPlayer from 'rrweb-player';
import 'rrweb-player/dist/style.css';
import config from '../config';

// 创建一个简单的状态管理类，不依赖 Vue 的响应式系统
class EventState {
  constructor() {
    this.events = [];
    this.stopFn = null;
    this.player = null; // rrweb-player 实例
    this.wasRecording = false; // 标记页面隐藏前是否在录制
    this.visibilityHandler = null; // 页面可见性事件处理器
  }

  get eventCount() {
    return this.events.length;
  }

  get latestEvent() {
    return this.events[this.events.length - 1];
  }

  clearEvents() {
    this.events = [];
  }

  // 设置页面可见性监听器
  setupVisibilityListener() {
    if (this.visibilityHandler) return; // 已经设置过了

    this.visibilityHandler = () => {
      if (document.hidden) {
        // 页面变为不可见
        this.wasRecording = !!this.stopFn; // 记录当前录制状态
        if (this.wasRecording) {
          this.stopRecording();
        }
      } else {
        // 页面变为可见
        if (this.wasRecording) {
          // 恢复录制
          this.startRecording();
        }
      }
    };

    document.addEventListener('visibilitychange', this.visibilityHandler);
  }

  startRecording() {
    this.stopFn = rrweb.record({
      emit: (event) => {
        if (this.events.length > config.rrwebSize) {
          this.events.shift();
        }
        this.events.push(event);
      },
      recordCanvas: true,
      blockClass: 'rr-block',
      ignoreClass: 'rr-ignore',
      maskTextClass: 'rr-mask',
      maskAllInputs: true,
      // 更频繁的全量快照
      checkoutEveryNth: 5,
    });

    // 开始录制时设置页面可见性监听器（如果还没有设置）
    if (!this.visibilityHandler) {
      this.setupVisibilityListener();
    }
  }

  stopRecording() {
    if (!this.stopFn) return;
    this.stopFn();
    this.stopFn = null;
  }

  playRecording() {
    // 检查是否有录制的事件
    if (!this.events || this.events.length === 0) {
      alert('没有可播放的录制数据，请先进行录制操作。');
      return;
    }

    // 创建播放弹窗
    this.createPlayerModal();
  }

  // 创建播放弹窗
  createPlayerModal() {
    // this.stopRecording();
    // 创建遮罩层
    const modal = document.createElement('div');
    modal.id = 'rrweb-player-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(5px);
    `;

    // 创建弹窗内容
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      max-width: 90vw;
      max-height: 90vh;
      overflow: hidden;
      position: relative;
    `;

    // 创建头部
    const modalHeader = document.createElement('div');
    modalHeader.style.cssText = `
      padding: 15px 20px;
      background: #f5f5f5;
      border-bottom: 1px solid #ddd;
      display: flex;
      justify-content: space-between;
      align-items: center;
    `;

    const title = document.createElement('h3');
    title.textContent = '录制回放';
    title.style.cssText = 'margin: 0; color: #333;';

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = `
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: #666;
      padding: 0;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    closeBtn.onmouseover = () => (closeBtn.style.backgroundColor = '#f0f0f0');
    closeBtn.onmouseout = () =>
      (closeBtn.style.backgroundColor = 'transparent');
    closeBtn.onclick = () => this.closePlayerModal();

    modalHeader.appendChild(title);
    modalHeader.appendChild(closeBtn);

    // 创建播放器容器
    const playerContainer = document.createElement('div');
    playerContainer.id = 'rrweb-player-container';
    playerContainer.style.cssText = `
      width: 800px;
      height: 600px;
      background: #f9f9f9;
    `;

    modalContent.appendChild(modalHeader);
    modalContent.appendChild(playerContainer);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // 点击遮罩层关闭弹窗
    modal.onclick = (e) => {
      if (e.target === modal) {
        this.closePlayerModal();
      }
    };

    // ESC 键关闭弹窗
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        this.closePlayerModal();
        document.removeEventListener('keydown', handleEsc);
      }
    };
    document.addEventListener('keydown', handleEsc);

    // 创建 rrweb-player 实例
    try {
      this.player = new rrwebPlayer({
        target: playerContainer,
        props: {
          events: this.events,
          width: 800,
          height: 600,
          speed: 1,
          autoPlay: true,
        },
      });
    } catch (error) {
      alert('播放录制内容时出现错误，请重试。');
      this.closePlayerModal();
    }
  }

  // 关闭播放弹窗
  closePlayerModal() {
    const modal = document.getElementById('rrweb-player-modal');
    if (modal) {
      // 销毁播放器实例
      if (this.player) {
        try {
          if (this.player.$destroy) {
            this.player.$destroy();
          }
        } catch (e) {
          console.warn('销毁播放器时出错:', e);
        }
        this.player = null;
      }

      document.body.removeChild(modal);
      // this.startRecording();
    }
  }
}

// 创建单例实例
const eventState = new EventState();

export const useEventStore = defineStore('eventStore', {
  state: () => ({
    // 这里可以放一些需要响应式的状态（如果将来需要在 Vue 中使用）
    // 但核心状态由 eventState 管理
  }),

  getters: {
    // 代理到 eventState 的 getter
    eventCount: () => eventState.eventCount,
    latestEvent: () => eventState.latestEvent,
    events: () => eventState.events,
  },

  actions: {
    // 代理到 eventState 的方法
    clearEvents() {
      eventState.clearEvents();
    },

    startRecording() {
      eventState.startRecording();
    },

    stopRecording() {
      eventState.stopRecording();
    },

    playRecording() {
      eventState.playRecording();
    },
  },
});

// 导出直接的状态管理实例（用于非 Vue 环境）
export const eventStoreInstance = eventState;

/*
使用示例：

// 在 Vue 组件中：
import { useEventStore } from '@/stores/eventStore';
const eventStore = useEventStore();

// 在纯 JavaScript/SDK 环境中：
import { eventStoreInstance } from '@/stores/eventStore';

// 开始录制
eventStoreInstance.startRecording();

// 获取事件数量
console.log('事件数量:', eventStoreInstance.eventCount);

// 获取最新事件
console.log('最新事件:', eventStoreInstance.latestEvent);

// 停止录制
eventStoreInstance.stopRecording();

// 清空事件
eventStoreInstance.clearEvents();
*/
