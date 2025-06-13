// 消息服务 Hook
import { create } from 'zustand';
import * as messageService from './messageService';

// 消息服务状态存储
interface MessageServiceState {
  connected: boolean;
  connect: (userId: string, token: string) => void;
  disconnect: () => void;
  markAsRead: (messageId: string) => void;
}

// 创建消息服务状态存储
export const useMessageService = create<MessageServiceState>((set) => ({
  connected: false,
  
  // 连接 WebSocket
  connect: (userId: string, _token: string) => {
    // 自定义事件处理函数，用于将 WebSocket 消息分发到应用程序
    const handleMessage = (data: unknown) => {
      // 创建自定义事件并分发
      const event = new CustomEvent('ws_message_event', { detail: data });
      window.dispatchEvent(event);
    };
    
    // 调用实际的连接函数
    messageService.connect(userId, handleMessage);
    set({ connected: true });
  },
  
  // 断开 WebSocket 连接
  disconnect: () => {
    //messageService.disconnect();
    set({ connected: false });
  },
  
  // 标记消息已读
  markAsRead: (messageId: string) => {
    // 这里调用实际的 markAsRead API
    // 可以在后续实现
    console.log('标记消息已读:', messageId);
  }
}));

export default useMessageService;
