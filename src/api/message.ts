import request from "@/utils/request";
import { Message, Conversation } from "@/types/message";

/**
 * 获取用户所有对话列表
 * @returns Promise<Conversation[]> 对话列表
 */
export async function getConversations(): Promise<Conversation[]> {
  try {
    const response = await request.get(
      "http://localhost:8080/api/messages/conversations"
    );

    const res: Conversation[] = response.data.map((item: any) => ({
      id: item.id, // 会话ID
      participantId: item.user2Id, // 对话参与者ID（非当前用户）
      participantName: item.user2Name, // 对话参与者名称
      participantAvatar: item.user2Avatar, // 对话参与者头像
      lastMessage: item.lastMessageTime, // 最后一条消息//todo: 需要格式化时间
      unreadCount: item.unreadCountUser1, // 未读消息数
    }));
    return res;
  } catch (error) {
    console.error("获取对话列表失败:", error);
    throw error;
  }
}

/**
 * 获取指定对话的消息历史
 * @param conversationId 对话ID
 * @returns Promise<Message[]> 消息列表
 */
export async function getConversationMessages(
  conversationId: string
): Promise<Message[]> {
  try {
    const response = await request.get(
      `http://localhost:8080/api/messages/conversations/${conversationId}`
    );
    const messages: Message[] = response.data.map((item: any) => ({
      id: item.id,
      content: item.content,
      senderId: item.fromUserId,
      receiverId: item.toUserId,
      senderName: item.fromUserName,
      receiverName: item.toUserName,
      senderAvatar: item.fromUserAvatar,
      receiverAvatar: item.toUserAvatar,
      timestamp: new Date(item.sentAt).getTime(),
      read: item.isRead,
    }));
    console.log("获取对话消息:", messages);
    return messages;
  } catch (error) {
    console.error("获取对话消息失败:", error);
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
    const response = await request.post(
      "http://localhost:8080/api/messages/send",
      { data: message }
    );
    return response.data;
  } catch (error) {
    console.error("发送消息失败:", error);
    throw error;
  }
}

/**
 * 标记消息为已读
 * @param messageId 消息ID
 * @returns Promise<{success: boolean}> 操作结果
 */
export async function markMessageAsRead(
  messageId: string
): Promise<{ success: boolean }> {
  try {
    await request.put(`http://localhost:8080/api/messages/${messageId}/read`);
    return { success: true };
  } catch (error) {
    console.error("标记消息已读失败:", error);
    throw error;
  }
}

/**
 * 创建新对话
 * @param userId 要对话的用户ID
 * @returns Promise<Conversation> 创建的对话
 */
export async function createConversation(
  userId: string
): Promise<Conversation> {
  try {
    const response = await request.post(
      "http://localhost:8080/api/messages/conversations",
      {
        data: { participantId: userId },
      }
    );
    return response.data;
  } catch (error) {
    console.error("创建对话失败:", error);
    throw error;
  }
}
