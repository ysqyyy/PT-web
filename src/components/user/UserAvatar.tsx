'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createConversation } from '@/api/message';

interface UserAvatarProps {
  userId: string;
  avatarUrl?: string;
  username?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * 可复用的用户头像组件
 * 
 * 当点击时显示一个带有"发送消息"按钮的弹出窗口
 * 点击发送消息按钮会导航到消息页面并创建新对话
 */
const UserAvatar: React.FC<UserAvatarProps> = ({ 
  userId, 
  avatarUrl, 
  username = '', 
  size = 'md',
  className = '' 
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  // 根据尺寸设置样式
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };
  
  // 关闭弹窗的处理函数
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPopup(false);
  };
  
  // 点击头像的处理函数
  const handleAvatarClick = () => {
    setShowPopup(true);
  };
    // 发送消息的处理函数
  const handleSendMessage = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (loading) return;
    
    try {
      setLoading(true);
      
      // 创建新对话或获取现有对话
      const conversation = await createConversation(userId);
      
      // 关闭弹窗
      setShowPopup(false);
      
      // 导航到消息页面并选择该对话
      router.push(`/home/user/message?conversation=${conversation.id}`);
    } catch (error) {
      console.error('创建对话失败:', error);
      // 如果创建失败，也导航到消息页面
      router.push('/home/user/message');
    } finally {
      setLoading(false);
    }
  };
  
  // 获取用户名首字母作为头像占位符
  const getInitial = () => {
    return username ? username.charAt(0).toUpperCase() : '?';
  };
  
  return (
    <div className="relative inline-block">
      {/* 头像 */}
      <div 
        className={`${sizeClasses[size]} rounded-full bg-teal-500 flex items-center justify-center text-white cursor-pointer ${className}`}
        onClick={handleAvatarClick}
      >
        {avatarUrl ? (
          <Image 
            src={avatarUrl} 
            alt={username || '用户头像'} 
            width={size === 'lg' ? 48 : size === 'md' ? 40 : 32}
            height={size === 'lg' ? 48 : size === 'md' ? 40 : 32}
            className="rounded-full object-cover"
            onError={(e) => {
              // 如果图片加载失败，显示用户名首字母
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.parentElement!.textContent = getInitial();
            }}
          />
        ) : (
          <span>{getInitial()}</span>
        )}
      </div>
      
      {/* 弹出窗口 */}
      {showPopup && (
        <>
          {/* 透明遮罩，点击关闭弹窗 */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={handleClose}
          />
          
          {/* 弹出内容 */}
          <div className="absolute z-20 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-2">
            <div className="flex flex-col">
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-teal-100 hover:text-teal-900 rounded-md transition-colors"
                onClick={handleSendMessage}
                disabled={loading}
              >
                {loading ? '处理中...' : '发送消息'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserAvatar;
