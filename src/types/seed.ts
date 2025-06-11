export interface ori {
    id: number;                // 对应后端的 torrentId
    title: string;             // 对应后端的 torrentName
    // originalTitle: string;     // 英文原名或副标题
    // year: string;              // 发行年份
    // region: string;            // 地区
    // actors: string[];          // 演员列表
    // genres: string[];          // 类型列表
    // quality: string;           // 质量
    // resolution: string;        // 分辨率
    // subtitles: string;         // 字幕信息
    publisher: string;         // 发布者名称，对应后端的上传者信息
    publisherLevel: string;    // 发布者等级
    size: string;              // 文件大小，对应后端的 torrentSize 
    // repliesViews: string;      // 回复/查看次数
    publishTime: string;       // 发布时间，对应后端的 uploadTime
    // lastSeedTime: string;      // 最后做种时间
    // seedId: string;            // 种子ID，对应后端的 torrentId
    // files: number;             // 文件数量
    // seeds: number;             // 做种人数
    downloads: number;         // 下载次数，对应后端的 downloadCount
    // completions: number;       // 完成数量
    // attachments: number;       // 附件数量
    description?: string;      // 描述，对应后端的 torrentDescription
    // otherVersions?: string[];  // 其他版本
    rating?: number;           // 评分，对应后端的 score
    ratingCount?: number;      // 评分数量，对应后端的 markingCount
    status?: string;           // 种子状态，对应后端的 torrentStatus
    price?: number;            // 价格，对应后端的 originPrice
    downloadLimit?: number;    // 下载限制，对应后端的 downloadLimit
    categoryId?: number;       // 分类ID，对应后端的 categoryId
    // torrentPath?: string | null; // 种子文件路径，对应后端的 torrentPath
}
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



// 后端返回的种子数据格式
export interface BackendTorrent {
    torrentId: number;           // 种子ID
    torrentName: string;         // 种子名称
    uploaderId: number;          // 上传者ID
    categoryId: number;          // 分类ID
    torrentDescription: string;  // 种子描述
    torrentSize: number;         // 种子大小(KB)
    uploadTime: number[];        // 上传时间 [年,月,日,时,分,秒]
    torrentStatus: string;       // 种子状态
    originPrice: number;         // 原始价格
    downloadCount: number;       // 下载次数
    downloadLimit: number;       // 下载限制
    score: number;               // 评分
    markingCount: number;        // 评分数量
    torrentPath: string | null;  // 种子文件路径
}

// 列表页使用的种子简要信息
export interface SeedListItem {
    id: number;               // 种子ID
    title: string;            // 种子名称
    size: string;             // 大小
    category: string;         // 分类
    publishTime: string;      // 发布时间
    downloads: number;        // 下载次数
    rating: number;           // 评分
    price: number;            // 价格
    status: string;           // 状态
}

// /**
//  * 将后端返回的种子数据转换为前端使用的格式
//  * @param backendTorrent 后端返回的种子数据
//  * @returns 前端使用的种子详情格式
//  */
// export function convertBackendTorrentToSeedDetail(backendTorrent: BackendTorrent): Partial<SeedDetail> {
//     // 格式化上传时间
//     const [year, month, day, hour, minute] = backendTorrent.uploadTime;
//     const publishTime = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    
//     // 格式化文件大小
//     const sizeInKB = backendTorrent.torrentSize;
//     let formattedSize: string;
    
//     if (sizeInKB < 1024) {
//         formattedSize = `${sizeInKB} KB`;
//     } else if (sizeInKB < 1024 * 1024) {
//         formattedSize = `${(sizeInKB / 1024).toFixed(2)} MB`;
//     } else {
//         formattedSize = `${(sizeInKB / (1024 * 1024)).toFixed(2)} GB`;
//     }

//     return {
//         id: backendTorrent.torrentId,
//         name: backendTorrent.torrentName,
//         description: backendTorrent.torrentDescription,
//         size: formattedSize,
//         publishTime: publishTime,
//         seedId: backendTorrent.torrentId.toString(),
//         downloads: backendTorrent.downloadCount,
//         rating: backendTorrent.score,
//         ratingCount: backendTorrent.markingCount,
//         status: backendTorrent.torrentStatus,
//         price: backendTorrent.originPrice,
//         downloadLimit: backendTorrent.downloadLimit,
//         categoryId: backendTorrent.categoryId,
//         torrentPath: backendTorrent.torrentPath
//     };
// }