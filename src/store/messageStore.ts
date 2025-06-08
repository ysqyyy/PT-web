// 消息状态管理
import { create } from 'zustand';
import { Message, Conversation, MessageEvent } from '@/types/message';
import { useMessageService } from '@/services/messageService';

interface MessageStore {
  conversations: Conversation[];
  currentConversation: string | null; // 当前选中的对话ID
  messages: Record<string, Message[]>; // 按对话ID存储消息列表
  
  // 添加或更新对话
  upsertConversation: (conversation: Conversation) => void;
  
  // 添加消息
  addMessage: (message: Message) => void;
  
  // 设置当前对话
  setCurrentConversation: (conversationId: string | null) => void;
  
  // 标记对话已读
  markConversationAsRead: (conversationId: string) => void;
  
  // 处理WebSocket消息事件
  handleMessageEvent: (event: MessageEvent) => void;
}

export const useMessageStore = create<MessageStore>((set, get) => ({
  conversations: [],
  currentConversation: null,
  messages: {},
  
  upsertConversation: (conversation) => {
    set((state) => {
      const index = state.conversations.findIndex(c => c.id === conversation.id);
      if (index > -1) {
        // 更新已有对话
        const updatedConversations = [...state.conversations];
        updatedConversations[index] = {
          ...updatedConversations[index],
          ...conversation
        };
        return { conversations: updatedConversations };
      } else {
        // 添加新对话
        return { 
          conversations: [...state.conversations, conversation],
          messages: {
            ...state.messages,
            [conversation.id]: []
          }
        };
      }
    });
  },
    addMessage: (message) => {
    set((state) => {
      const currentUserId = getCurrentUserId();
      
      // 确定消息所属的对话ID
      // 查找对话时，我们需要考虑当前用户是发送者还是接收者
      const conversation = state.conversations.find(c => 
        c.participantId === (message.senderId === currentUserId ? message.receiverId : message.senderId)
      );
      
      const conversationId = conversation?.id;
      
      if (!conversationId) return state; // 如果找不到对应的对话，不处理
      
      // 更新消息列表
      const conversationMessages = state.messages[conversationId] || [];
      const updatedMessages = {
        ...state.messages,
        [conversationId]: [...conversationMessages, message]
      };
      
      // 更新对话中的最新消息和未读数
      const updatedConversations = state.conversations.map(conv => {
        if (conv.id === conversationId) {
          const isUnread = message.senderId !== currentUserId && !message.read;
          return {
            ...conv,
            lastMessage: message,
            unreadCount: isUnread ? conv.unreadCount + 1 : conv.unreadCount
          };
        }
        return conv;
      });
      
      return {
        messages: updatedMessages,
        conversations: updatedConversations
      };
    });
  },
  
  setCurrentConversation: (conversationId) => {
    set({ currentConversation: conversationId });
    
    // 如果选择了对话，标记该对话中的消息为已读
    if (conversationId) {
      get().markConversationAsRead(conversationId);
    }
  },
  
  markConversationAsRead: (conversationId) => {
    set((state) => {
      // 更新对话的未读数
      const updatedConversations = state.conversations.map(conv => {
        if (conv.id === conversationId) {
          return { ...conv, unreadCount: 0 };
        }
        return conv;
      });
      
      // 更新消息为已读状态
      const conversationMessages = state.messages[conversationId] || [];
      const messageService = useMessageService.getState();
      
      const updatedMessages = conversationMessages.map(msg => {
        if (!msg.read && msg.senderId !== getCurrentUserId()) {
          // 向服务器发送已读通知
          messageService.markAsRead(msg.id);
          return { ...msg, read: true };
        }
        return msg;
      });
      
      return {
        conversations: updatedConversations,
        messages: {
          ...state.messages,
          [conversationId]: updatedMessages
        }
      };
    });
  },
  
  handleMessageEvent: (event) => {
    switch (event.type) {
      case 'NEW_MESSAGE':
        get().addMessage(event.payload);
        break;
      case 'MESSAGE_READ':
        // 处理消息已读事件
        set((state) => {
          const { messageId } = event.payload;
          // 查找消息并更新状态
          for (const [conversationId, messages] of Object.entries(state.messages)) {
            const messageIndex = messages.findIndex(m => m.id === messageId);
            if (messageIndex > -1) {
              const updatedMessages = [...messages];
              updatedMessages[messageIndex] = {
                ...updatedMessages[messageIndex],
                read: true
              };
              return {
                messages: {
                  ...state.messages,
                  [conversationId]: updatedMessages
                }
              };
            }
          }
          return state;
        });
        break;
      // 其他事件类型处理...
      default:
        console.log('未处理的消息事件类型:', event);
    }
  }
}));

// 获取当前用户ID的辅助函数，需要根据实际认证方式实现
function getCurrentUserId(): string {
  if (typeof window !== 'undefined') {
    // 从localStorage中获取用户信息
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        return user.id.toString();
      } catch (e) {
        console.error('解析用户信息失败', e);
      }
    }
  }
  return ''; 
}
