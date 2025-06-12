'use client';

import React, { useState } from 'react';
import { Comment, CommentReply } from '@/types/comment';
import CommentForm from './CommentForm';
import TimeAgo from './TimeAgo';
import UserAvatar from '@/components/user/UserAvatar';

interface CommentItemProps {
  comment: Comment;
  onReply: (commentId: number, content: string) => Promise<void>;
  onLike: (commentId: number, isReply?: boolean, parentId?: number) => Promise<void>;
  onLoadReplies: (commentId: number) => Promise<void>;
  isExpanded: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({ 
  comment, 
  onReply, 
  onLike, 
  onLoadReplies,
  isExpanded
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  // 处理回复提交
  const handleReplySubmit = async (content: string) => {
    await onReply(comment.id, content);
    setIsReplying(false); // 提交后关闭回复框
  };

  // 处理点赞
  const handleLike = async () => {
    if (isLiking) return; // 防止重复点击
    
    setIsLiking(true);
    try {
      await onLike(comment.id);
    } finally {
      setIsLiking(false);
    }
  };

  // 处理回复的点赞
  const handleReplyLike = async (replyId: number) => {
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      await onLike(replyId, true, comment.id);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="border-b pb-6 last:border-b-0 last:pb-0">
      {/* 一级评论 */}      <div className="flex">
        {/* 头像 */}
        <div className="flex-shrink-0 mr-3">
          <UserAvatar 
            userId={comment.author?.id}
            avatarUrl={comment.author?.avatar}
            username={comment.author?.username}
          />
        </div>

        {/* 评论内容 */}
        <div className="flex-1">
          <div className="flex items-center mb-1">
            <h3 className="font-medium text-gray-800 mr-2">{comment.author?.username}</h3>
            {comment.author?.level && (
              <span className="text-xs px-1.5 py-0.5 bg-teal-100 text-teal-700 rounded">
                {comment.author?.level}
              </span>
            )}
            <span className="ml-2 text-xs text-gray-500">
              <TimeAgo timestamp={comment.createdAt} />
            </span>
          </div>
          
          <p className="text-gray-700 mb-2">{comment.content}</p>
          
          {/* 评论操作 */}
          <div className="flex items-center text-sm text-gray-500">
            <button 
              className="mr-4 hover:text-teal-600 cursor-pointer transition-colors"
              onClick={() => setIsReplying(!isReplying)}
            >
              回复
            </button>
            
            <button 
              className={`flex items-center cursor-pointer hover:text-teal-600 transition-colors ${comment.isLiked ? 'text-teal-600' : ''}`}
              onClick={handleLike}
              disabled={isLiking}
            >
              <span className="mr-1">{comment.isLiked ? '♥' : '♡'}</span>
              {comment.likes > 0 && <span>{comment.likes}</span>}
            </button>
          </div>
            {/* 回复表单 */}
          {isReplying && (
            <div className="mt-3">
              <CommentForm 
                onSubmit={handleReplySubmit} 
                buttonText="回复" 
                placeholder={`回复 ${comment.author?.username || '用户'}...`}
              />
            </div>
          )}
        </div>
      </div>

      {/* 显示回复按钮 */}
      {comment.replyCount > 0 && (
        <div className="ml-12 mt-3">
          <button 
            className="text-sm text-teal-600 hover:text-teal-800 transition-colors cursor-pointer"
            onClick={() => onLoadReplies(comment.id)}
          >
            {isExpanded 
              ? `收起 ${comment.replyCount} 条回复` 
              : `查看 ${comment.replyCount} 条回复`}
          </button>
        </div>
      )}

      {/* 回复列表 */}
      {isExpanded && comment.replies.length > 0 && (
        <div className="ml-12 mt-3 space-y-4">
          {comment.replies.map(reply => (
            <ReplyItem 
              key={`reply-${reply.id}`} 
              reply={reply} 
              onLike={() => handleReplyLike(reply.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// 回复项组件
interface ReplyItemProps {
  reply: CommentReply;
  onLike: () => Promise<void>;
}

const ReplyItem: React.FC<ReplyItemProps> = ({ reply, onLike }) => {
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      await onLike();
    } finally {
      setIsLiking(false);
    }
  };

  return (    <div className="flex">      {/* 头像 */}
      <div className="flex-shrink-0 mr-3">
        <UserAvatar 
          userId={reply.author?.id}
          avatarUrl={reply.author?.avatar}
          username={reply.author?.username}
          size="sm"
        />
      </div>

      {/* 回复内容 */}
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <h3 className="font-medium text-gray-800 mr-2">{reply.author?.username}</h3>
          {reply.author?.level && (
            <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded">
              {reply.author?.level}
            </span>
          )}
          <span className="ml-2 text-xs text-gray-500">
            <TimeAgo timestamp={reply.createdAt} />
          </span>
        </div>
        
        <p className="text-gray-700 mb-2">{reply.content}</p>
        
        {/* 回复操作 */}
        <div className="flex items-center text-sm text-gray-500">
          <button 
            className={`flex items-center hover:text-teal-600 transition-colors ${reply.isLiked ? 'text-teal-600' : ''}`}
            onClick={handleLike}
            disabled={isLiking}
          >
            <span className="mr-1">{reply.isLiked ? '♥' : '♡'}</span>
            {reply.likes > 0 && <span>{reply.likes}</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
