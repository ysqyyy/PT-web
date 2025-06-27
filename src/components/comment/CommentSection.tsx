"use client";

import React, { useState } from "react";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import { useComment } from "@/hooks/useComment";

interface CommentSectionProps {
  seedId: number;
}

const CommentSection: React.FC<CommentSectionProps> = ({ seedId }) => {
  // 使用封装的评论hook
  const { 
    useSeedComments,
    postCommentMutation,
    replyCommentMutation,
    likeCommentMutation,
    likeReplyMutation,
    reportCommentMutation
  } = useComment();
  
  // 获取评论数据
  const { data: comments = [], isLoading, error } = useSeedComments(seedId);

  // 展开/折叠回复的状态
  const [expandedComments, setExpandedComments] = useState<number[]>([]);

  // 发表评论
  const handlePostComment = async (content: string) => {
    if (!content.trim()) return;
    await postCommentMutation.mutateAsync({ seedId, content });
  };

  // 回复评论
  const handleReplyComment = async (commentId: number, content: string) => {
    if (!content.trim()) return;
    await replyCommentMutation.mutateAsync({ seedId, commentId, content });
  };

  // 点赞评论
  const handleLikeComment = async (
    commentId: number,
    isReply: boolean = false,
    parentId?: number
  ) => {
    try {
      if (!isReply) {
        // 获取当前评论的点赞状态
        const comment = comments.find((c) => c.id === commentId);
        if (comment) {
          await likeCommentMutation.mutateAsync({
            commentId,
            isLiked: comment.isLiked,
            seedId,
          });
        }
      } else if (parentId) {
        // 获取当前回复的点赞状态
        const parentComment = comments.find((c) => c.id === parentId);
        const reply = parentComment?.replies?.find((r) => r.id === commentId);
        if (reply) {
          await likeReplyMutation.mutateAsync({
            replyId: commentId,
            isLiked: reply.isLiked,
            parentId,
            seedId,
          });
        }
      }
    } catch (err) {
      console.error("点赞操作失败:", err);
    }
  };

  // 举报评论
  const handleReportComment = async (commentId: number, reason: string) => {
    await reportCommentMutation.mutateAsync({ commentId, reason });
  };

  // 加载/折叠回复
  const handleLoadReplies = async (commentId: number) => {
    // 如果已经展开，则折叠
    if (expandedComments.includes(commentId)) {
      setExpandedComments(expandedComments.filter((id) => id !== commentId));
      return;
    }

    // 标记为已展开
    setExpandedComments([...expandedComments, commentId]);
  };

  // 评论计数
  const totalCommentCount = comments.reduce(
    (sum, comment) => sum + 1 + (comment.replyCount || 0),
    0
  );

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-6 flex items-center">
        评论区
        <span className="ml-2 text-sm font-normal text-gray-500">
          共 {totalCommentCount} 条评论
        </span>
      </h2>

      {/* 评论表单 */}
      <div className="mb-8">
        <CommentForm onSubmit={handlePostComment} buttonText="发表评论" />
      </div>

      {/* 评论列表 */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-700"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            评论加载失败，请稍后重试
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            暂无评论，快来发表第一条评论吧！
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={`comment-${comment.id}`}
              comment={comment}
              onReply={handleReplyComment}
              onLike={handleLikeComment}
              onLoadReplies={handleLoadReplies}
              isExpanded={expandedComments.includes(comment.id)}
              onReport={handleReportComment}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
