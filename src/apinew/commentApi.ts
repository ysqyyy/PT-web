import request from "../utils/request";
import { Comment, CommentReply, CommentResponse } from "../types/comment";

// 响应类型定义
export interface CommentsResponse {
  code: number;
  message: string;
  data: {
    comments: Array<{
      comment_id: number;
      content: string;
      user_info: {
        user_id: string;
        username: string;
        avatar_url?: string;
        level?: string;
      };
      comment_createtime: string;
      likes_count: number;
      user_liked: boolean;
      replies?: Array<{
        comment_id: number;
        parent_id: number;
        content: string;
        likes_count: number;
        user_liked: boolean;
        user_info: {
          user_id: string;
          username: string;
          avatar_url?: string;
          level?: string;
        };
        comment_createtime: string;
      }>;
    }>;
  };
}

export interface CommentCreateResponse {
  code: number;
  message: string;
  data: {
    comment_id: number;
    comment_content: string;
    comment_createtime: string;
    parent_id?: number;
  };
}

export interface LikeResponse {
  code: number;
  message: string;
  data: {
    likes_count: number;
    status: boolean;
  };
}

export interface ReportResponse {
  code: number;
  message: string;
  data: {
    success: boolean;
  };
}

// API 层只负责与服务器通信，不处理业务逻辑
export const commentApi = {
  /**
   * 获取种子评论（带二级评论）
   * @param seedId 种子ID
   */
  getSeedComments: (seedId: number) => 
    request.get<CommentsResponse>(`/api/values/torrent/${seedId}/comments`),
  
  /**
   * 发表一级评论
   * @param seedId 种子ID
   * @param content 评论内容
   */
  postComment: (seedId: number, content: string) => 
    request.post<CommentCreateResponse>("/api/values/comment", {
      torrent_id: seedId,
      comment_content: content,
    }),
  
  /**
   * 回复评论（二级评论）
   * @param seedId 种子ID
   * @param commentId 被回复的评论ID
   * @param content 回复内容
   */
  replyToComment: (seedId: number, commentId: number, content: string) => 
    request.post<CommentCreateResponse>("/api/values/comment", {
      torrent_id: seedId,
      comment_content: content,
      parent_id: commentId,
      mentioned_users: [],
    }),
  
  /**
   * 点赞评论
   * @param commentId 评论ID
   */
  likeComment: (commentId: number) => 
    request.post<LikeResponse>(`/api/values/comments/${commentId}/like`, { 
      action: "like" 
    }),
  
  /**
   * 取消点赞评论
   * @param commentId 评论ID
   */
  unlikeComment: (commentId: number) => 
    request.post<LikeResponse>(`/api/values/comments/${commentId}/like`, { 
      action: "unlike" 
    }),
  
  /**
   * 举报评论
   * @param commentId 评论ID
   * @param reason 举报原因
   */
  reportComment: (commentId: number, reason: string) => 
    request.post<ReportResponse>(`/api/values/comments/${commentId}/report`, {
      reason: reason,
    }),
};



