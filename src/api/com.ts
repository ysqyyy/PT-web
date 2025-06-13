import request from "../utils/request";
import { Comment, CommentReply } from "../types/comment";

// 获取种子评论（带二级评论）  ok
export async function getSeedComments(seedId: number): Promise<Comment[]> {
    const response = await request.get(
        `http://localhost:8080/api/values/torrent/${seedId}/comments`
    );
    console.log("获取种子评论接口返回:", response);
    const comments: Comment[] = response.data.comments.map((item: any) => ({
        id: item.comment_id,
        content: item.content,
        author: {
            id: item.user_info.user_id,
            username: item.user_info.username,
            avatar: item.user_info.avatar_url,
            level: item.user_info.level || "", // 可能没有level字段
        },        createdAt: item.comment_createtime,
        likes: item.likes_count,
        isLiked: item.user_liked,
        replies: item.replies ? item.replies.map((reply: any) => ({
            id: reply.comment_id,
            parentId: reply.parent_id,
            content: reply.content,
            likes: reply.likes_count,
            isLiked: reply.user_liked,
            author: {
                id: reply.user_info.user_id,
                username: reply.user_info.username,
                avatar: reply.user_info.avatar_url,
                level: reply.user_info.level || "", // 可能没有level字段
            },            createdAt: reply.comment_createtime,
        })) : [],
        replyCount: item.replies ? item.replies.length : 0,
    }));
    console.log("获取种子评论:", comments);
    return comments || [];
}

// 发表一级评论  ok
export async function postComment(
    seedId: number,
    content: string
): Promise<Comment> {
    console.log("发表一级评论接口参数:", { seedId, content });
    const response = await request.post(
        " http://localhost:8080/api/values/comment",
        {
            torrent_id: seedId,
            comment_content: content,
        }
    );
    console.log("发表一级评论接口返回:", response);
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const res = response.data;
    const comment: Comment = {
        id: res.comment_id, // 一级评论ID;
        content: res.comment_content, // 一级评论内容;
        author: {
            id: userInfo.user_id, // 用户ID;
            username: userInfo.user_name, // 用户名;
            avatar: userInfo.avatar_url, // 用户头像;
            level: userInfo.user_level || "", // 用户等级;
        },
        createdAt: res.comment_createtime, // 一级评论创建时间;
        likes: 0,
        isLiked: false,
        replies: [],
        replyCount: 0, // 一级评论回复数量
    };
    return comment;
}
// 回复评论（二级评论） ok
export async function replyToComment(
    seedId: number,
    commentId: number,
    content: string
): Promise<CommentReply> {
    console.log("回复评论接口参数:", { seedId, commentId, content });
    const response = await request.post(
        "http://localhost:8080/api/values/comment",
        {
            torrent_id: seedId,
            comment_content: content,
            parent_id: commentId,
            mentioned_users: [],
        }
    );
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const commentReply: CommentReply = {
        id: response.data.comment_id,//
        parentId: response.data.parent_id,//
        content: response.data.comment_content,//
        likes: 0,
        isLiked: false,
        createdAt: response.data.comment_createtime,//
        author: {
            id: userInfo?.user_id, //
            username: userInfo?.user_name,//
            avatar: userInfo?.avatar_url,//
            level: userInfo?.user_level || "",//
        }
    };
    return commentReply;
}

// 点赞评论
export async function likeComment(
    commentId: number
): Promise<{ success: boolean; likes: number }> {
    const response=await request.post(`http://localhost:8080/api/values/comments/${commentId}/like`, { action: "like" });
    console.log("点赞评论接口返回:", response);
    return {
        success: response.status,
        likes: response.data.likes_count,
    };
}
// 取消点赞评论
export async function unlikeComment(
    commentId: number
): Promise<{ success: boolean; likes: number }> {
const response=await request.post(`http://localhost:8080/api/values/comments/${commentId}/like`, { action: "unlike" });
    console.log("取消点赞评论接口返回:", response);
    return {
        success: response.status,
        likes: response.data.likes_count,
    };
}

// 举报评论
export async function reportComment(commentId: number, reason: string): Promise<any> {
    console.log("举报评论接口参数:", { commentId, reason });
    const response = await request.post(
        `http://localhost:8080/api/values/comments/${commentId}/report`,
        {
            reason: reason,
        }
    );
    console.log("举报评论接口返回:", response);
    return response.data;
}



