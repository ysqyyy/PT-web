import request from '../utils/request';

// 评分种子
export async function rateSeed(seedId: number, rating: number) {
    return request.post("/api/request/seed/rate", { seedId, rating });
}