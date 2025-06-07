import request from '../utils/request';
// 评论接口返回类型
export interface Comment {
    id: number;
    username: string;
    avatar: string;
    level: string;
    content: string;
    time: string;
    likes: number;
    isLiked: boolean;
}
// 获取种子评论
export async function getSeedComments(seedId: number) {
    return request.get(`/api/request/comment/list/${seedId}`);
}

// 发表评论
export async function postComment(seedId: number, content: string) {
    return request.post("/api/request/comment/create", { seedId, content });
}

// 点赞评论
export async function likeComment(commentId: number) {
    return request.post("/api/request/comment/like", { commentId });
}

// 评分种子
export async function rateSeed(seedId: number, rating: number) {
    return request.post("/api/request/seed/rate", { seedId, rating });
}