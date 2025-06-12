// 评论类型定义  不需要有接口返回
export interface CommentReply {
  id: number;
  parentId: number;
  content: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
    level?: string;
  };
  createdAt: string;
  likes: number;
  isLiked: boolean;
}

export interface Comment {
  id: number;
  content: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
    level?: string;
  };
  createdAt: string;
  likes: number;
  isLiked: boolean;
  replies?: CommentReply[];
  replyCount: number;
}
// 评论响应类型
export interface CommentResponse {
  success: boolean;
  message: string;
  data: Comment[] | Comment;
}
