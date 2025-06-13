// 消息类型定义

// 单条消息
export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  senderName: string; // 发送者名称
  receiverName: string; // 接收者名称
  senderAvatar?: string; // 发送者头像
  receiverAvatar?: string; // 接收者头像
  timestamp?: number; // 统一用时间戳
  read: boolean;
  conversationId?: string; // 新增：消息所属的对话ID
}

// 对话信息
export interface Conversation {
  id: string;
  currentUserId:string;
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