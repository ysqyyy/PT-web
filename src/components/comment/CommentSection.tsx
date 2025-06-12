'use client';

import React, { useState, useEffect } from 'react';
import { 
  getSeedComments, 
  postComment, 
  replyToComment, 
  likeComment, 
} from '@/api/com';
import { Comment } from '@/types/comment';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import toast from 'react-hot-toast';

interface CommentSectionProps {
  seedId: number;
}

const CommentSection: React.FC<CommentSectionProps> = ({ seedId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<number[]>([]);

  // 加载评论
  useEffect(() => {
    if (!seedId) return;
    const fetchComments = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedComments = await getSeedComments(seedId);
        setComments(fetchedComments);
      } catch (err) {
        console.error('获取评论失败:', err);
        setError('评论加载失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [seedId]);

  // 发表评论
  const handlePostComment = async (content: string) => {
    if (!content.trim()) return;
    try {
      const newComment = await postComment(seedId, content);
      setComments(prevComments => [newComment, ...prevComments]);
      toast.success('评论发表成功');
    } catch (err) {
      console.error('发表评论失败:', err);
      toast.error('评论发表失败，请稍后重试');
    }
  };

  // 回复评论
  const handleReplyComment = async (commentId: number, content: string) => {
    if (!content.trim()) return;
    try {
      const newReply = await replyToComment(seedId,commentId, content);
      // 更新评论列表，添加新回复
      setComments(prevComments => 
        prevComments.map(comment => 
          comment.id === commentId 
            ? {
                ...comment,
                replies: [...comment.replies, newReply],
                replyCount: comment.replyCount + 1
              }
            : comment
        )
      );
      
      toast.success('回复发表成功');
    } catch (err) {
      console.error('回复评论失败:', err);
      toast.error('回复发表失败，请稍后重试');
    }
  };

  // 点赞评论
  const handleLikeComment = async (commentId: number, isReply: boolean = false, parentId?: number) => {
    try {
      const result = await likeComment(commentId);
      
      if (result.success) {
        // 更新评论列表中的点赞状态
        if (!isReply) {
          // 点赞一级评论
          setComments(prevComments => 
            prevComments.map(comment => 
              comment.id === commentId
                ? { ...comment, likes: result.likes, isLiked: !comment.isLiked }
                : comment
            )
          );
        } else if (parentId) {
          // 点赞二级评论/回复
          setComments(prevComments => 
            prevComments.map(comment => 
              comment.id === parentId
                ? {
                    ...comment,
                    replies: comment.replies.map(reply => 
                      reply.id === commentId
                        ? { ...reply, likes: result.likes, isLiked: !reply.isLiked }
                        : reply
                    )
                  }
                : comment
            )
          );
        }
      }
    } catch (err) {
      console.error('点赞失败:', err);
      toast.error('点赞失败，请稍后重试');
    }
  };

  // 加载更多回复
  const handleLoadReplies = async (commentId: number) => {
    // 如果已经展开，则折叠
    if (expandedComments.includes(commentId)) {
      setExpandedComments(expandedComments.filter(id => id !== commentId));
      return;
    }

    try {
      // 查找当前评论
      const comment = comments.find(c => c.id === commentId);
      
      // 如果评论已经加载了所有回复，直接标记为展开
      if (comment && comment.replies.length === comment.replyCount) {
        setExpandedComments([...expandedComments, commentId]);
        return;
      }
      
      // 标记为已展开
      setExpandedComments([...expandedComments, commentId]);
    } catch (err) {
      console.error('加载回复失败:', err);
      toast.error('加载回复失败，请稍后重试');
    }
  };

  // 评论计数 有接口？？？
  const totalCommentCount = comments.reduce(
    (sum, comment) => sum + 1 + comment.replyCount,
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
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-700"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">暂无评论，快来发表第一条评论吧！</div>
        ) : (
          comments.map(comment => (
            <CommentItem
              key={`comment-${comment.id}`}
              comment={comment}
              onReply={handleReplyComment}
              onLike={handleLikeComment}
              onLoadReplies={handleLoadReplies}
              isExpanded={expandedComments.includes(comment.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
