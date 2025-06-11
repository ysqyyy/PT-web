import request from '../utils/request';
import { Comment, CommentReply } from '../types/comment';


// 获取种子评论（带二级评论）
export async function getSeedComments(seedId: number): Promise<Comment[]> {

    const response = await request.get(`/api/request/comment/list/${seedId}`);
    return response.data || [];
}

// 发表一级评论
export async function postComment(seedId: number, content: string): Promise<Comment> {
    const response = await request.post('/api/request/comment/create', { 
      seedId, 
      content 
    });
    return response.data;
}

// 回复评论（二级评论）
export async function replyToComment(commentId: number, content: string): Promise<CommentReply> {
    const response = await request.post('/api/request/comment/reply', { 
      commentId, 
      content 
    });
    return response.data
}

// 点赞评论
export async function likeComment(commentId: number): Promise<{ success: boolean, likes: number }> {
    return request.post('/api/request/comment/like', { commentId });
}

// 获取评论的回复列表
export async function getCommentReplies(commentId: number): Promise<CommentReply[]> {
    const response = await request.get(`/api/request/comment/replies/${commentId}`);
    return response.data || [];
}