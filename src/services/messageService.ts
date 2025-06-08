// WebSocket消息服务
import { io, Socket } from 'socket.io-client';
import { Message, MessageEvent } from '@/types/message';
import { create } from 'zustand';

// WebSocket连接状态
type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';

// 消息服务状态
interface MessageState {
  socket: Socket | null;
  status: ConnectionStatus;
  connect: (userId: string, token: string) => void;
  disconnect: () => void;
  sendMessage: (message: Omit<Message, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (messageId: string) => void;
}

// WebSocket服务URL，生产环境请修改为实际URL
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

// 创建消息服务状态管理
export const useMessageService = create<MessageState>((set, get) => ({
  socket: null,
  status: 'disconnected',
  
  // 连接WebSocket
  connect: (userId: string, token: string) => {
    if (get().status === 'connected') return;
    
    set({ status: 'connecting' });
    
    const socket = io(SOCKET_URL, {
      auth: {
        token,
        userId
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    });
      socket.on('connect', () => {
      console.log('WebSocket连接成功');
      set({ status: 'connected' });
    });
    
    socket.on('disconnect', () => {
      console.log('WebSocket断开连接');
      set({ status: 'disconnected' });
    });
    
    socket.on('connect_error', (err) => {
      console.error('WebSocket连接错误:', err);
      set({ status: 'disconnected' });
    });
    
    // 监听消息事件
    socket.on('message', (data: MessageEvent) => {
      // 这里可以通过导入messageStore来处理消息
      // 或者通过自定义事件触发页面中的处理函数
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('ws_message_event', { detail: data }));
      }
    });
    
    set({ socket });
  },
  
  // 断开WebSocket连接
  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, status: 'disconnected' });
    }
  },
  
  // 发送消息
  sendMessage: (message) => {
    const { socket } = get();
    if (socket && get().status === 'connected') {
      socket.emit('send_message', message);
    } else {
      console.error('无法发送消息，WebSocket未连接');
    }
  },
  
  // 标记消息已读
  markAsRead: (messageId: string) => {
    const { socket } = get();
    if (socket && get().status === 'connected') {
      socket.emit('mark_as_read', { messageId });
    } else {
      console.error('无法标记消息已读，WebSocket未连接');
    }
  },
}));
