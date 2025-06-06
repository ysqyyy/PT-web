import request from '../utils/request';

// 获取种子列表
export async function getSeedList(params: {
    category?: string;
    regions?: string[];
    years?: string[];
    genres?: string[];
    searchTerm?: string;
    page?: number;
    pageSize?: number;
}) {
    return request.post("/api/request/seed/list", params);
}

// 获取种子详情
export async function getSeedDetail(id: number) {
    return request.get(`/api/request/seed/detail/${id}`);
}

// 发布种子
export async function publishSeed(data: {
    category: string;
    name: string;
    size: string;
    description?: string;
    tags?: string[];
    // 其他发布所需字段
}) {
    return request.post("/api/request/seed/publish", data);
}

// 感谢种子发布者
export async function thankPublisher(seedId: number) {
    return request.post("/api/request/seed/thank", { seedId });
}