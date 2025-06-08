// 消息类型定义

// 单条消息
export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  timestamp: number;
  read: boolean;
}

// 对话信息
export interface Conversation {
  id: string;
  participantId: string; // 对话参与者ID（非当前用户）
  participantName: string; // 对话参与者名称
  participantAvatar?: string; // 对话参与者头像
  lastMessage?: Message; // 最后一条消息
  unreadCount: number; // 未读消息数
}

// WebSocket消息事件类型
export type MessageEvent = 
  | { type: 'NEW_MESSAGE'; payload: Message } 
  | { type: 'MESSAGE_READ'; payload: { messageId: string } }
  | { type: 'USER_ONLINE'; payload: { userId: string } }
  | { type: 'USER_OFFLINE'; payload: { userId: string } };