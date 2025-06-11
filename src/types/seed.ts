import {Comment} from "./comment";
//new type ok
export interface SeedDetail{
    id: number;                // 对应后端的 torrentId
    name: string;             // 对应后端的 torrentName    
    description: string;      // 描述
    imgUrl?: string;          // 图片URL

    publisherId?: number;      // 发布者ID，对应后端的 uploaderId
    publisherName?: string;        // 发布者名称，对应后端的 uploaderName
    publisherLevel?: string;   // 发布者等级，对应后端的 uploaderLevel
    publisherAvatar?: string; // 发布者头像URL，对应后端的 uploaderAvatar

    size?: string;              // 文件大小，对应后端的 torrentSize
    publishTime?: string;       // 发布时间，对应后端的 uploadTime
    downloadCount?: number;         // 下载次数，对应后端的 downloadCount
    status?: string;           // 种子状态，对应后端的 torrentStatus
    price?: number;            // 价格，对应后端的 originPrice
    downloadLimit?: number;    // 下载限制，对应后端的 downloadLimit

    score?: number;           // 评分，对应后端的 score
    scoreCount?: number;      // 评分数量，对应后端的 markingCount

    categoryId?: number;       // 分类ID，对应后端的 categoryId 无数据
    tags?: string[];           // 标签列表

    comments?: Comment[];        // 评论列表 !!!
}
//ok
export interface publishSeedData {
    name: string;            // 种子标题
    description: string;     // 种子描述
    file: File;              // 种子文件
    imgUrl?: string;         // 种子图片URL
    tags?: string[];         // 标签列表
    price?: number;         // 种子价格
    category?: string;        // 种子分类
}
// 列表页使用的种子简要信息
export interface SeedListItem {
    id: number;               // 种子ID
    name: string;            // 种子名称
    description?: string;    // 种子描述
    size: string;             // 大小
    category: string;         // 分类
    tags?: string[];        // 标签列表
    price: number;            // 价格
    status: string;           // 状态
    downloadCount?: number;   // 下载次数
    score?: number;           // 评分
}