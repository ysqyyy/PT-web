import request from "@/utils/request";
import { Message, Conversation } from "@/types/message";

/**
 * 获取用户所有对话列表
 * @returns Promise<Conversation[]> 对话列表
 */
export async function getConversations(): Promise<Conversation[]> {
  try {
    const response = await request.get(
        "/api/messages/conversations"
    ).promise;
    // 打印返回内容，调试用
    console.log("getConversations返回：", response);

    // 兼容各种返回结构
    const arr = response?.data?.data || response?.data || [];
    if (!Array.isArray(arr)) {
      return [];
    }
    const res: Conversation[] = arr.map((item: any) => ({
      id: item.id?.toString?.() || "",
      participantId: item.user2Id?.toString?.() || "",
      participantName: item.user2Name || "",
      participantAvatar: item.user2Avatar || "",
      lastMessage: item.lastMessage
          ? {
            id: "",
            content: item.lastMessage,
            senderId: item.user1Id?.toString?.() || "",
            receiverId: item.user2Id?.toString?.() || "",
            senderName: item.user1Name || "",
            receiverName: item.user2Name || "",
            senderAvatar: item.user1Avatar || "",
            receiverAvatar: item.user2Avatar || "",
            timestamp: item.lastMessageTime
                ? new Date(item.lastMessageTime.join("-")).getTime()
                : undefined,
            read: true,
          }
          : undefined,
      unreadCount: item.unreadCountUser1 || 0,
    }));
    return res;
  } catch (error) {
    console.error("获取对话列表失败:", error);
    throw error;
  }
}
// ... existing code ...
export async function getConversationMessages(
    conversationId: string
): Promise<Message[]> {
  try {
    const response = await request.get(
        `/api/messages/conversations/${conversationId}`
    ).promise;
    console.log("getConversationMessages返回：", response);

    const arr = response?.data?.data || response?.data || [];
    if (!Array.isArray(arr)) {
      return [];
    }
    const messages: Message[] = arr.map((item: any) => ({
      id: item.id?.toString?.() || "",
      content: item.content || "",
      senderId: item.fromUserId?.toString?.() || "",
      receiverId: item.toUserId?.toString?.() || "",
      senderName: item.fromUserName || "",
      receiverName: item.toUserName || "",
      senderAvatar: item.fromUserAvatar || "",
      receiverAvatar: item.toUserAvatar || "",
      timestamp: item.sentAt
          ? new Date(Array.isArray(item.sentAt) ? item.sentAt.join("-") : item.sentAt).getTime()
          : undefined,
      read: item.isRead,
      conversationId: item.conversationId?.toString?.() || "", // 确保这里也映射
    }));
    return messages;
  } catch (error) {
    console.error("获取对话消息失败:", error);
    throw error;
  }
}
// ... existing code ...
/**
 * 发送新消息（HTTP方式，保留）
 * @param message 消息内容
 * @returns Promise<Message> 已发送的消息
 */
export async function sendMessage(message: {
  content: string;
  receiverId: string;
}): Promise<Message> {
  try {
    const response = await request.post(
        "/api/messages/send",
        { data: message }
    ).promise;
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
    await request.put(`/api/messages/${messageId}/read`).promise;
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
        "/api/messages/conversations",
        {
          data: { participantId: userId },
        }
    ).promise;
    return response.data;
  } catch (error) {
    console.error("创建对话失败:", error);
    throw error;
  }
}