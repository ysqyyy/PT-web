import request from '../utils/request';
import type { SeedDetail } from '@/types/seed';
// 获取种子列表
export async function getSeedList(params: {
    tags?: string[];
    keywords?: string;
    page?: number;
    pageSize?: number;
}) {
    const res= await request.post("/api/request/seed/list", params);
    console.log("Seed list response:", res);
    return res
}

// 获取种子详情
export async function getSeedDetail(id: number) {
    console.log("Fetching seed detail for ID:", id);
    const res= await request.get(`/api/request/seed/detail/${id}`);
    const seedDetail:SeedDetail ={
        id: res.id,
        name: res.title,
        description: res.description,
        imgUrl: res.imgUrl,

        publisherId: res.publisherId,
        publisherName: res.publisherName,
        publisherLevel: res.publisherLevel,
        publisherAvatar: res.publisherAvatar,

        size: res.torrentSize, // 假设返回的文件大小
        publishTime: res.uploadTime, // 假设返回的上传时间
        downloadCount: res.downloadCount, // 假设返回的下载次数
        status: res.torrentStatus, // 假设返回的种子状态
        price: res.originPrice, // 假设返回的价格
        downloadLimit: res.downloadLimit, // 假设返回的下载限制

        score: res.score, // 假设返回的评分
        scoreCount: res.markingCount, // 假设返回的评分数量
        categoryId: res.categoryId, // 假设返回的分类ID
        tags: res.tags, // 假设返回的标签列表
    }
    console.log("Seed detail response:", seedDetail);
    return seedDetail;
}
// 评分种子
export async function rateSeed(seedId: number, rating: number) {
    return request.post("/api/request/seed/rate", { seedId, rating });
}
// 发布种子
export async function publishSeed(data: {
    title: string;
    category: string;
    description: string;
    region: string;
    year: string;
    chineseName: string;
    englishName: string;
    actors: string;
    types: string[];
    releaseGroup: string;
    seedPrice: string;
    file: File;
}) {
    const formData = new FormData();

    // 添加表单数据
    formData.append('title', data.title);
    formData.append('category', data.category);
    formData.append('description', data.description);
    formData.append('region', data.region);
    formData.append('year', data.year);
    formData.append('chineseName', data.chineseName);
    formData.append('englishName', data.englishName);
    formData.append('actors', data.actors);
    formData.append('types', JSON.stringify(data.types));
    formData.append('releaseGroup', data.releaseGroup);
    formData.append('seedPrice', data.seedPrice);

    // 添加文件
    formData.append('file', data.file);

    return request.post("/api/request/seed/publish", formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

// 获取种子发布预设选项
export async function getPublishPresets() {
    return request.get("/api/request/seed/publish-presets");
}

// // 感谢种子发布者
// export async function thankPublisher(seedId: number) {
//     return request.post("/api/request/seed/thank", { seedId });
// }