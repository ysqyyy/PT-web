// ... existing code ...
import React, { useState } from 'react';
import { Comment, CommentReply } from '@/types/comment';
import CommentForm from './CommentForm';
import TimeAgo from './TimeAgo';
import UserAvatar from '@/components/user/UserAvatar';
import toast from 'react-hot-toast'; // 导入 toast 提示


interface CommentItemProps {
  comment: Comment;
  onReply: (commentId: number, content: string) => Promise<void>;
  onLike: (commentId: number, isReply?: boolean, parentId?: number) => Promise<void>;
  onLoadReplies: (commentId: number) => Promise<void>;
  isExpanded: boolean;
  onReport: (commentId: number, reason: string) => Promise<void>; // 新增：举报回调
}

const CommentItem: React.FC<CommentItemProps> = ({
                                                   comment,
                                                   onReply,
                                                   onLike,
                                                   onLoadReplies,
                                                   isExpanded,
                                                   onReport // 接收举报回调
                                                 }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [showReportOptions, setShowReportOptions] = useState(false); // 控制举报选项显示
  const [reporting, setReporting] = useState(false); // 举报中状态

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

  // 处理举报
  const handleReportComment = async (reason: string) => {
    if (reporting) return;

    setReporting(true);
    try {
      await onReport(comment.id, reason); // 调用从父组件传入的举报回调
      toast.success('举报成功！');
      setShowReportOptions(false); // 举报成功后关闭选项
    } catch (error) {
      console.error('举报失败:', error);
      toast.error('举报失败，请稍后重试。');
    } finally {
      setReporting(false);
    }
  };

  return (
      <div className="border-b pb-6 last:border-b-0 last:pb-0">
        {/* 一级评论 */}
        <div className="flex">
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
            <div className="flex items-center text-sm text-gray-500 relative"> {/* 添加 relative 定位 */}
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
                {comment.likes >= 0 && <span>{comment.likes}</span>}
              </button>

              {/* 举报按钮 */}
              <button
                  className="ml-4 hover:text-red-600 cursor-pointer transition-colors"
                  onClick={() => setShowReportOptions(!showReportOptions)}
              >
                举报
              </button>

              {/* 举报理由选项 */}
              {showReportOptions && (
                  <div className="absolute top-full right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => handleReportComment('advertisement')}
                        disabled={reporting}
                    >
                      {reporting ? '提交中...' : '广告'}
                    </button>
                    <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => handleReportComment('abuse')}
                        disabled={reporting}
                    >
                      {reporting ? '提交中...' : '人身攻击'}
                    </button>
                    <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => handleReportComment('swear word')}
                        disabled={reporting}
                    >
                      {reporting ? '提交中...' : '不文明用语'}
                    </button>
                  </div>
              )}
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
        {isExpanded && comment.replies && comment.replies.length > 0 && (
            <div className="ml-12 mt-3 space-y-4">
              {comment.replies.map(reply => (
                  <ReplyItem
                      key={`reply-${reply.id}`}
                      reply={reply}
                      onLike={() => handleReplyLike(reply.id)}
                      onReport={(replyId, reason) => onReport(replyId, reason)} // 传递举报回调给 ReplyItem
                  />
              ))}
            </div>
        )}
      </div>
  );
};

// 回复项组件 (需要同样添加举报功能)
interface ReplyItemProps {
  reply: CommentReply;
  onLike: () => Promise<void>;
  onReport: (commentId: number, reason: string) => Promise<void>; // 新增：举报回调
}

const ReplyItem: React.FC<ReplyItemProps> = ({ reply, onLike, onReport }) => {
  const [isLiking, setIsLiking] = useState(false);
  const [showReportOptions, setShowReportOptions] = useState(false); // 控制举报选项显示
  const [reporting, setReporting] = useState(false); // 举报中状态


  const handleLike = async () => {
    if (isLiking) return;

    setIsLiking(true);
    try {
      await onLike();
    } finally {
      setIsLiking(false);
    }
  };

  // 处理举报回复
  const handleReportReply = async (reason: string) => {
    if (reporting) return;

    setReporting(true);
    try {
      await onReport(reply.id, reason); // 调用从父组件传入的举报回调
      toast.success('举报成功！');
      setShowReportOptions(false); // 举报成功后关闭选项
    } catch (error) {
      console.error('举报失败:', error);
      toast.error('举报失败，请稍后重试。');
    } finally {
      setReporting(false);
    }
  };

  return (
      <div className="flex">
        {/* 头像 */}
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

          <p className="text-gray-700 mb-2">@{reply.mentionedUsers && reply.mentionedUsers[0]?.username} {reply.content}</p> {/* 修正了这里，如果后端返回有 mentionedUsers, 那么在 content 前面展示 */}


          {/* 回复操作 */}
          <div className="flex items-center text-sm text-gray-500 relative"> {/* 添加 relative 定位 */}
            <button
                className={`flex items-center cursor-pointer hover:text-teal-600 transition-colors ${reply.isLiked ? 'text-teal-600' : ''}`}
                onClick={handleLike}
                disabled={isLiking}
            >
              <span className="mr-1">{reply.isLiked ? '♥' : '♡'}</span>
              {reply.likes >= 0 && <span>{reply.likes}</span>}
            </button>

            {/* 举报按钮 for ReplyItem */}
            <button
                className="ml-4 hover:text-red-600 cursor-pointer transition-colors"
                onClick={() => setShowReportOptions(!showReportOptions)}
            >
              举报
            </button>

            {/* 举报理由选项 for ReplyItem */}
            {showReportOptions && (
                <div className="absolute top-full right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => handleReportReply('advertisement')}
                      disabled={reporting}
                  >
                    {reporting ? '提交中...' : '广告'}
                  </button>
                  <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => handleReportReply('abuse')}
                      disabled={reporting}
                  >
                    {reporting ? '提交中...' : '人身攻击'}
                  </button>
                  <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => handleReportReply('swear word')}
                      disabled={reporting}
                  >
                    {reporting ? '提交中...' : '不文明用语'}
                  </button>
                </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default CommentItem;