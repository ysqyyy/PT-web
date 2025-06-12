import request from '../utils/request';
import { Comment, CommentReply } from '../types/comment';

// 获取种子评论（带二级评论）  没有的话就改成使用获取帖子详情接口
export async function getSeedComments(seedId: number): Promise<Comment[]> {
    const response = await request.get(`http://localhost:8080/api/values/torrent/${seedId}/comments`);
    console.log("获取种子评论接口返回:", response);
    const comments: Comment[] = response.data.comments.map((item: any) => ({
        id: item.comment_id,
        content: item.content,
        author: {
            id: item.user_info.user_id,
            username: item.user_info.username,
            avatar: item.user_info.avatar_url,
            level: item.user_info.level || '', // 可能没有level字段
        },
        createdAt: item.comment_createtime,
        likes: item.likes_count,
        isLiked: item.user_liked,
        replies: item.replies.map((reply: any) => ({
            id: reply.comment_id,
            parentId: reply.parent_id,
            content: reply.content,
            likes: reply.likes_count,
            isLiked: reply.user_liked,
            author: {
                id: reply.user_info.user_id,
                username: reply.user_info.username,
                avatar: reply.user_info.avatar_url,
                level: reply.user_info.level || '', // 可能没有level字段
            },
            createdAt: reply.comment_createtime,

        })),
        replyCount: item.replies.length,
    }));
    console.log("获取种子评论:", comments);
    return comments || [];
}

// 发表一级评论  1、2级评论可以调用一个接口？
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