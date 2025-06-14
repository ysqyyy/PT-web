"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import DashboardLayout from "@/components/DashboardLayout";
import Navbar from "@/components/Navbar";
import {
  getConversations,
  getConversationMessages,
  markMessageAsRead,
} from "@/api/message";
import { useMessageService } from "@/services/useMessageService";
import { useMessageStore } from "@/store/messageStore";
import { Conversation, Message } from "@/types/message";
import { getUserProfile } from "@/api/user";
import { sendMessageWS } from "@/services/messageService";

export default function MessagePage() {
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<{
    id: number;
    username: string;
    avatarUrl?: string;
  } | null>(null);

  // 消息和WebSocket服务
  const messageService = useMessageService();
  const {
    conversations,
    currentConversation,
    messages,
    setCurrentConversation,
    upsertConversation,
    addMessage,
    handleMessageEvent,
    setMessagesForConversation,
  } = useMessageStore();

  // 滚动到底部的ref
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 获取用户信息并连接WebSocket
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userProfile = await getUserProfile();
        setCurrentUser({
          id: userProfile.id,
          username: userProfile.username,
          avatarUrl: userProfile.avatarUrl,
        });

        // 连接WebSocket
        messageService.connect(
            userProfile.id.toString(),
            localStorage.getItem("token") || ""
        );

        // 加载会话列表
        loadConversations();
      } catch (error) {
        console.error("获取用户信息失败:", error);
      }
    };

    fetchUserProfile();

    // 组件卸载时断开WebSocket连接
    return () => {
      messageService.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 监听WebSocket消息事件
  useEffect(() => {
    const handleWebSocketMessage = (event: CustomEvent) => {
      handleMessageEvent(event.detail);
    };

    window.addEventListener(
        "ws_message_event",
        handleWebSocketMessage as EventListener
    );

    return () => {
      window.removeEventListener(
          "ws_message_event",
          handleWebSocketMessage as EventListener
      );
    };
  }, [handleMessageEvent]);

  // 加载会话列表
  const loadConversations = async () => {
    setLoading(true);
    try {
      const data = await getConversations();
      // 更新会话列表
      data.forEach((conversation) => {
        upsertConversation(conversation);
      });

      // 如果有会话，默认选择第一个
      if (data.length > 0 && !currentConversation) {
        setCurrentConversation(data[0].id);
        // 加载该会话的消息
        loadMessages(data[0].id);
      }
    } catch (error) {
      console.error("加载会话列表失败:", error);
    } finally {
      setLoading(false);
    }
  };


// 在 loadMessages 函数中修改排序
  const loadMessages = async (conversationId: string) => {
    setMessagesForConversation(conversationId, []); // 先清空
    try {
      const data = await getConversationMessages(conversationId);
      // 按时间降序排序
      data.sort((a, b) => {
        const t1 = a.timestamp ?? (a as any).sentAt
            ? new Date(Array.isArray((a as any).sentAt) ? (a as any).sentAt.join("-") : (a as any).sentAt).getTime()
            : 0;
        const t2 = b.timestamp ?? (b as any).sentAt
            ? new Date(Array.isArray((b as any).sentAt) ? (b as any).sentAt.join("-") : (b as any).sentAt).getTime()
            : 0;
        return t2 - t1;  // 改为降序排序
      });
      data.forEach((message) => {
        addMessage(message);
      });
    } catch (error) {
      console.error("加载消息失败:", error);
    }
  };
  // 监听WebSocket消息事件
  useEffect(() => {
    const handleWebSocketMessage = (event: CustomEvent) => {
      // 适配后端返回格式
      const msg = event.detail;
      // sentAt 解析为时间戳
      let timestamp = msg.timestamp;
      if (!timestamp && msg.sentAt) {
        timestamp = new Date(msg.sentAt).getTime();
      }
      // 组装成 Message 类型
      const message: Message = {
        id: msg.id?.toString?.() || "",
        content: msg.content,
        senderId: msg.fromUserId?.toString?.() || "",
        receiverId: msg.toUserId?.toString?.() || "",
        senderName: msg.fromUserName,
        receiverName: msg.toUserName,
        senderAvatar: msg.fromUserAvatar,
        receiverAvatar: msg.toUserAvatar,
        timestamp,
        read: msg.isRead,
      };
      addMessage(message);
    };

    window.addEventListener(
        "ws_message_event",
        handleWebSocketMessage as EventListener
    );

    return () => {
      window.removeEventListener(
          "ws_message_event",
          handleWebSocketMessage as EventListener
      );
    };
  }, [addMessage]);

  // 切换会话
  const handleSelectConversation = (conversationId: string) => {
    setCurrentConversation(conversationId);
    loadMessages(conversationId);
  };

  // 发送消息（WebSocket）
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentConversation || !currentUser) return;
    setSending(true);
    try {
      const conversation = conversations.find(
          (c) => c.id === currentConversation
      );
      if (!conversation) return;

      // 构造本地消息对象
      const message = {
        id: Date.now().toString(), // 临时ID
        content: newMessage.trim(),
        senderId: currentUser.id.toString(),
        receiverId: conversation.participantId,
        senderName: currentUser.username,
        receiverName: conversation.participantName,
        senderAvatar: currentUser.avatarUrl,
        receiverAvatar: conversation.participantAvatar,
        timestamp: Date.now(),
        read: false,
        conversationId: currentConversation,
      };

      // 本地先 addMessage
      addMessage(message);

      // 通过WebSocket发送
      sendMessageWS(
          currentUser.id.toString(),
          conversation.participantId,
          newMessage.trim()
      );
      setNewMessage("");
    } catch (error) {
      console.error("发送消息失败:", error);
    } finally {
      setSending(false);
    }
  };

  // 标记消息已读
  const [marking, setMarking] = useState<string | null>(null);
  const handleMarkAsRead = async (messageId: string) => {
    setMarking(messageId);
    try {
      await markMessageAsRead(messageId);
      // 本地同步已读状态
      loadMessages(currentConversation!);
    } catch (error) {
      console.error("标记消息已读失败:", error);
    } finally {
      setMarking(null);
    }
  };

  // 滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentConversation]);

  // 渲染会话项
  const renderConversationItem = (conversation: Conversation) => {
    const isActive = currentConversation === conversation.id;
    return (
        <div
            key={conversation.id}
            className={`flex items-center p-3 border-b cursor-pointer hover:bg-gray-100 ${
                isActive ? "bg-gray-100" : ""
            }`}
            onClick={() => handleSelectConversation(conversation.id)}
        >
          <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white mr-3">

                <span>
              {conversation.participantName
                  ? conversation.participantName.charAt(0).toUpperCase()
                  : ""}
            </span>

          </div>
          <div className="flex-1">
            <div className="flex justify-between">
              <h3 className="font-medium">{conversation.participantName}</h3>
              {conversation.unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {conversation.unreadCount}
              </span>
              )}
            </div>
            {/* 新增：最后一条消息和时间 */}
            {conversation.lastMessage && (
                <div className="text-xs text-gray-500">
                  <div>
                    {conversation.lastMessage.content}
                  </div>
                  <div>
                    {conversation.lastMessage.timestamp
                        ? new Date(conversation.lastMessage.timestamp).toLocaleString()
                        : ""}
                  </div>
                </div>
            )}
          </div>
        </div>
    );
  };

  // 渲染消息气泡，key 唯一
  const renderMessage = (message: Message, index: number) => {
    if (!currentUser) return null;
    const isSender = message.senderId === currentUser.id.toString();
    // 兼容 sentAt 字段
    let time = message.timestamp;
    if (!time && (message as any).sentAt) {
      time = new Date(
          Array.isArray((message as any).sentAt)
              ? (message as any).sentAt.join("-")
              : (message as any).sentAt
      ).getTime();
    }
    return (
        <div
            key={message.id ? message.id : index}
            className={`flex mb-4 ${isSender ? "justify-end" : "justify-start"}`}
        >
          {!isSender && (
              <div className="w-8 h-8 rounded-full bg-gray-300 mr-2 flex items-center justify-center">

                    <span>
                {message.senderName
                    ? message.senderName.charAt(0).toUpperCase()
                    : ""}
              </span>
              </div>
          )}
          <div
              className={`max-w-[70%] p-3 rounded-lg shadow ${
                  isSender
                      ? "bg-teal-500 text-white rounded-br-none"
                      : "bg-gray-100 text-gray-900 rounded-bl-none"
              }`}
          >
            <div>{message.content}</div>
            <div className="flex items-center mt-1 text-xs">
            <span className={isSender ? "text-teal-100" : "text-gray-500"}>
              {time ? new Date(time).toLocaleString() : ""}
            </span>
              {isSender && (
                  <span className="ml-2">
                {message.read ? (
                    <span className="text-green-300">已读</span>
                ) : (
                    <span className="text-gray-300">未读</span>
                )}
              </span>
              )}
              {/* 标记已读按钮 */}
              {!message.read && !isSender && (
                  <button
                      className={`ml-2 px-2 py-1 rounded border text-xs transition-colors duration-150 ${
                          marking === message.id
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-blue-100 text-blue-600 hover:bg-blue-500 hover:text-white"
                      }`}
                      disabled={marking === message.id}
                      onClick={() => handleMarkAsRead(message.id)}
                      style={{ marginLeft: 8 }}
                  >
                    {marking === message.id ? "标记中..." : "标记已读"}
                  </button>
              )}
            </div>
          </div>
          {isSender && (
              <div className="w-8 h-8 rounded-full bg-teal-600 ml-2 flex items-center justify-center text-white">
                {currentUser?.username.charAt(0).toUpperCase()}
              </div>
          )}
        </div>
    );
  };
  const selectedConversation = conversations.find(
      (c) => c.id === currentConversation
  );

  // 在 currentMessages 的排序中也修改为降序
  const currentUserId = currentUser?.id?.toString?.() || '';
  const friendId = selectedConversation?.participantId?.toString?.() || '';
  console.log('currentUserId:', currentUserId, typeof currentUserId);
  console.log('friendId:', friendId, typeof friendId);

  const currentMessages = currentConversation
      ? (messages[currentConversation] || [])
          .filter(msg => {
            console.log('msg.senderId:', msg.senderId, 'msg.receiverId:', msg.receiverId);
            return (
                (msg.senderId === currentUserId && msg.receiverId === friendId) ||
                (msg.senderId === friendId && msg.receiverId === currentUserId)
            );
          })
          .sort((a, b) => {
        const t1 = a.timestamp ?? (a as any).sentAt
            ? new Date(Array.isArray((a as any).sentAt) ? (a as any).sentAt.join("-") : (a as any).sentAt).getTime()
            : 0;
        const t2 = b.timestamp ?? (b as any).sentAt
            ? new Date(Array.isArray((b as any).sentAt) ? (b as any).sentAt.join("-") : (b as any).sentAt).getTime()
            : 0;
        return t2 - t1;  // 改为降序排序
      })
      : [];
  useEffect(() => {
    if (currentConversation) {
      console.log('当前会话ID:', currentConversation);
      console.log('当前会话消息:', messages[currentConversation]);
    }
  }, [messages, currentConversation]);


  return (
      <Navbar name="个人中心">
        <DashboardLayout title="私信">
          <div className="bg-white rounded-lg shadow overflow-hidden h-[calc(100vh-180px)] flex">
            {/* 会话列表 */}
            <div className="w-1/4 border-r overflow-y-auto">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">对话列表</h2>
              </div>
              <div>
                {loading ? (
                    <div className="p-4 text-center text-gray-500">加载中...</div>
                ) : conversations.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">暂无对话</div>
                ) : (
                    conversations.map(renderConversationItem)
                )}
              </div>
            </div>

            {/* 消息区域 */}
            <div className="flex-1 flex flex-col">
              {/* 对话头部 */}
              <div className="p-4 border-b flex items-center">
                {selectedConversation ? (
                    <>
                      <h2 className="text-lg font-semibold">
                        {selectedConversation.participantName}
                      </h2>
                    </>
                ) : (
                    <h2 className="text-lg font-semibold">选择一个对话</h2>
                )}
              </div>

              {/* 消息列表 */}
              <div className="flex-1 overflow-y-auto p-4">
                {currentConversation ? (
                    currentMessages.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-gray-500">
                          暂无消息，发送一条消息开始对话吧
                        </div>
                    ) : (
                        <>
                          {currentMessages.map((message, index) =>
                              renderMessage(message, index)
                          )}
                          <div ref={messagesEndRef} />
                        </>
                    )
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">
                      请选择一个对话
                    </div>
                )}
              </div>

              {/* 消息输入区域 */}
              {currentConversation && (
                  <div className="p-4 border-t">
                    <div className="flex">
                      <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                          placeholder="输入消息..."
                          className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                          disabled={sending}
                      />
                      <button
                          onClick={handleSendMessage}
                          disabled={sending || !newMessage.trim()}
                          className="bg-teal-500 text-white px-4 py-2 rounded-r-lg hover:bg-teal-600 disabled:bg-gray-300"
                      >
                        {sending ? "发送中..." : "发送"}
                      </button>
                    </div>
                  </div>
              )}
            </div>
          </div>
        </DashboardLayout>
      </Navbar>
  );
}