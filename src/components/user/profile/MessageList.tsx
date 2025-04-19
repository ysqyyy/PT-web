"use client";
import React, { useState, useEffect } from "react";

// 定义消息类型
interface Message {
  id: number;
  content: string;
}

const sampleMessages: Message[] = [
  { id: 1, content: "系统维护通知：今晚 12 点进行系统维护，预计持续 1 小时。" },
  { id: 2, content: "新的版本已发布，欢迎体验我们的新功能！" },
  { id: 3, content: "您有一条新消息，点击查看。" },
  { id: 4, content: "您的账户已成功更新，感谢您的使用！" },
  { id: 5, content: "系统通知：即将进行服务器升级，请提前做好准备。" }
];

const MessageList: React.FC = () => {
  // 显式指定类型为 Message[]
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 模拟从API加载消息
  useEffect(() => {
    // 模拟网络请求延迟
    setTimeout(() => {
      setMessages(sampleMessages); // 不会报错了
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-2xl mx-auto mt-8">
      <h2 className="text-xl font-semibold mb-4">系统消息</h2>

      {/* 加载状态 */}
      {isLoading ? (
        <div>加载中...</div>
      ) : (
        <ul className="space-y-4">
          {messages.length > 0 ? (
            messages.map((message) => (
              <li key={message.id} className="bg-gray-100 p-4 rounded-lg shadow">
                <p className="text-gray-700">{message.content}</p>
              </li>
            ))
          ) : (
            <div>没有系统消息。</div>
          )}
        </ul>
      )}
    </div>
  );
};

export default MessageList;

