// src/store/messageStore.ts
import { create } from 'zustand';
import { Message, Conversation, MessageEvent } from '@/types/message';
import { useMessageService } from '@/services/useMessageService';

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

  // 清空并设置某会话的消息
  setMessagesForConversation: (conversationId: string, messages: Message[]) => void;
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
      // 直接使用消息自带的 conversationId 进行归属
      const conversationId = message.conversationId;

      if (!conversationId) {
        console.warn("Message missing conversationId, cannot add to store:", message);
        return state;
      }

      // 理论上，在调用 loadMessages 之前，loadConversations 已经保证了 conversationId 对应的会话存在于 state.conversations 中。
      // 所以这里不需要再通过 participantId 查找会话。

      // 检查是否已存在该消息，避免重复添加
      const conversationMessages = state.messages[conversationId] || [];
      if (conversationMessages.some(m => m.id === message.id)) {
        return state;
      }

      // 将消息添加到对应的会话消息列表中
      const updatedMessages = {
        ...state.messages,
        [conversationId]: [...conversationMessages, message]
      };

      // 更新会话列表中的最新消息和未读数
      const currentUserId = getCurrentUserId();
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
    if (conversationId) {
      get().markConversationAsRead(conversationId);
    }
  },

  markConversationAsRead: (conversationId) => {
    set((state) => {
      const updatedConversations = state.conversations.map(conv => {
        if (conv.id === conversationId) {
          return { ...conv, unreadCount: 0 };
        }
        return conv;
      });

      const conversationMessages = state.messages[conversationId] || [];
      const messageService = useMessageService.getState();

      const updatedMessages = conversationMessages.map(msg => {
        if (!msg.read && msg.senderId !== getCurrentUserId()) {
          // 向服务器发送已读通知
          if (messageService && messageService.markAsRead) {
            messageService.markAsRead(msg.id);
          }
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
        set((state) => {
          const { messageId } = event.payload;
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
      default:
        console.log('未处理的消息事件类型:', event);
    }
  },

  setMessagesForConversation: (conversationId, messages) => set((state) => ({
    messages: {
      ...state.messages,
      [conversationId]: messages
    }
  })),
}));

// 健壮的用户ID获取
function getCurrentUserId(): string {
  if (typeof window !== 'undefined') {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        if (user && user.id !== undefined && user.id !== null) {
          return user.id.toString();
        }
      } catch (e) {
        console.error('解析用户信息失败', e);
      }
    }
  }
  return '';
}