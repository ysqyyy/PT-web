import request from '@/utils/request';
import { Message, Conversation } from '@/types/message';

/**
 * 获取用户所有对话列表
 * @returns Promise<Conversation[]> 对话列表
 */
export async function getConversations(): Promise<Conversation[]> {
  try {
    const response = await request.get('http://localhost:8080/api/messages/conversations');
    return response.data;
  } catch (error) {
    console.error('获取对话列表失败:', error);
    throw error;
  }
}

/**
 * 获取指定对话的消息历史
 * @param conversationId 对话ID
 * @returns Promise<Message[]> 消息列表
 */
export async function getConversationMessages(conversationId: string): Promise<Message[]> {
  try {
    const response = await request.get(`http://localhost:8080/api/messages/conversations/${conversationId}`);
    return response.data;
  } catch (error) {
    console.error('获取对话消息失败:', error);
    throw error;
  }
}

/**
 * 发送新消息
 * @param message 消息内容
 * @returns Promise<Message> 已发送的消息
 */
export async function sendMessage(message: {
  content: string;
  receiverId: string;
}): Promise<Message> {
  try {
    const response = await request.post('http://localhost:8080/api/messages/send', { data: message });
    return response.data;
  } catch (error) {
    console.error('发送消息失败:', error);
    throw error;
  }
}

/**
 * 标记消息为已读
 * @param messageId 消息ID
 * @returns Promise<{success: boolean}> 操作结果
 */
export async function markMessageAsRead(messageId: string): Promise<{success: boolean}> {
  try {
     await request.put(`http://localhost:8080/api/messages/${messageId}/read`);
    return { success: true };
  } catch (error) {
    console.error('标记消息已读失败:', error);
    throw error;
  }
}

/**
 * 创建新对话
 * @param userId 要对话的用户ID
 * @returns Promise<Conversation> 创建的对话
 */
export async function createConversation(userId: string): Promise<Conversation> {
  try {
    const response = await request.post('http://localhost:8080/api/messages/conversations', {
      data: { participantId: userId }
    });
    return response.data;
  } catch (error) {
    console.error('创建对话失败:', error);
    throw error;
  }
}