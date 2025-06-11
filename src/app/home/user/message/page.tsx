'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import DashboardLayout from '@/components/DashboardLayout';
import Navbar from '@/components/Navbar';
import { getConversations, getConversationMessages, sendMessage } from '@/api/message';
import { useMessageService } from '@/services/messageService';
import { useMessageStore } from '@/store/messageStore';
import { Conversation, Message } from '@/types/message';
import { getUserProfile } from '@/api/user';

export default function MessagePage() {
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<{ id: number; username: string } | null>(null);
  
  // 消息和WebSocket服务
  const messageService = useMessageService();
  const { 
    conversations, 
    currentConversation, 
    messages, 
    setCurrentConversation, 
    upsertConversation, 
    addMessage, 
    handleMessageEvent 
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
          username: userProfile.username
        });
        
        // 连接WebSocket
        messageService.connect(userProfile.id.toString(), localStorage.getItem('token') || '');
        
        // 加载会话列表
        loadConversations();
      } catch (error) {
        console.error('获取用户信息失败:', error);
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
    
    window.addEventListener('ws_message_event', handleWebSocketMessage as EventListener);
    
    return () => {
      window.removeEventListener('ws_message_event', handleWebSocketMessage as EventListener);
    };
  }, [handleMessageEvent]);
  
  // 加载会话列表
  const loadConversations = async () => {
    setLoading(true);
    try {
      const data = await getConversations();
      // 更新会话列表
      data.forEach(conversation => {
        upsertConversation(conversation);
      });
      
      // 如果有会话，默认选择第一个
      if (data.length > 0 && !currentConversation) {
        setCurrentConversation(data[0].id);
        // 加载该会话的消息
        loadMessages(data[0].id);
      }
    } catch (error) {
      console.error('加载会话列表失败:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // 加载指定会话的消息
  const loadMessages = async (conversationId: string) => {
    try {
      const data = await getConversationMessages(conversationId);
      // 更新消息列表
      data.forEach(message => {
        addMessage(message);
      });
    } catch (error) {
      console.error('加载消息失败:', error);
    }
  };
  
  // 切换会话
  const handleSelectConversation = (conversationId: string) => {
    setCurrentConversation(conversationId);
    loadMessages(conversationId);
  };
  
  // 发送消息
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentConversation || !currentUser) return;
    
    setSending(true);
    try {
      // 获取当前对话的参与者ID
      const conversation = conversations.find(c => c.id === currentConversation);
      if (!conversation) return;
      
      const messageData = {
        content: newMessage.trim(),
        receiverId: conversation.participantId
      };
      
      // 通过API发送消息
      await sendMessage(messageData);
      
      // 清空输入框
      setNewMessage('');
    } catch (error) {
      console.error('发送消息失败:', error);
    } finally {
      setSending(false);
    }
  };
  
  // 滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentConversation]);
    // 渲染会话项
  const renderConversationItem = (conversation: Conversation) => {
    const isActive = currentConversation === conversation.id;
    return (
      <div 
        key={conversation.id}
        className={`flex items-center p-3 border-b cursor-pointer hover:bg-gray-100 ${isActive ? 'bg-gray-100' : ''}`}
        onClick={() => handleSelectConversation(conversation.id)}
      >
        <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white mr-3">
          {conversation.participantAvatar ? (
            <Image 
              src={conversation.participantAvatar} 
              alt={conversation.participantName} 
              width={40} 
              height={40} 
              className="rounded-full"
            />
          ) : (
              <span>{conversation.participantName ? conversation.participantName.charAt(0).toUpperCase() : ''}</span>
          )}
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
          {conversation.lastMessage && (
            <p className="text-sm text-gray-500 truncate">{conversation.lastMessage.content}</p>
          )}
        </div>
      </div>
    );
  };
  
  // 渲染消息气泡
  const renderMessage = (message: Message) => {
    const isSender = currentUser && message.senderId === currentUser.id.toString();
    return (
      <div 
        key={message.id}
        className={`flex mb-4 ${isSender ? 'justify-end' : 'justify-start'}`}
      >
        {!isSender && (
          <div className="w-8 h-8 rounded-full bg-gray-300 mr-2 flex items-center justify-center">
            {conversations.find(c => c.id === currentConversation)?.participantName?.charAt(0).toUpperCase() || ''}
          </div>
        )}
        <div
          className={`max-w-[70%] p-3 rounded-lg ${
            isSender ? 'bg-teal-500 text-white' : 'bg-gray-200'
          }`}
        >
          {message.content}
          <div className={`text-xs mt-1 ${isSender ? 'text-teal-100' : 'text-gray-500'}`}>
            {new Date(message.timestamp).toLocaleString()}
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
  
  const currentMessages = currentConversation ? (messages[currentConversation] || []) : [];
  const selectedConversation = conversations.find(c => c.id === currentConversation);

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
                  <h2 className="text-lg font-semibold">{selectedConversation.participantName}</h2>
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
                    {currentMessages.map(renderMessage)}
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
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="输入消息..."
                    className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    disabled={sending}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={sending || !newMessage.trim()}
                    className="bg-teal-500 text-white px-4 py-2 rounded-r-lg hover:bg-teal-600 disabled:bg-gray-300"
                  >
                    {sending ? '发送中...' : '发送'}
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