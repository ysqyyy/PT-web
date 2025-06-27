import request from '../utils/request';
import auth from '../utils/auth';
import axios from 'axios';
import {
  getCategoryIdByName,
} from "@/constants/categories";
import { getTagIdByName } from "@/constants/tags";
import type {
  publishSeedData,
  SeedDetail,
  getSeedListParams,
} from "@/types/seed";

// 响应类型定义
export interface SeedListResponse {
  success: boolean;
  message: string;
  data: {
    torrents: getSeedListParams[];
    total: number;
    page: number;
    size: number;
    pages: number;
  };
}

export interface SeedDetailResponse {
  success: boolean;
  message: string;
  data: SeedDetail;
}

export interface RateSeedResponse {
  status: string;
  message: string;
}

export interface PublishSeedResponse {
  success: boolean;
  message: string;
  data: number; // torrentId
}

// Seed API 接口定义
export const seedApi = {
  // 获取推荐种子列表
  getRecommendSeeds: (page: number , size: number ) => 
    request.get("/torrent/recommend", {
      params: { page, size }
    }),
  
  // 按关键词搜索种子
  getSeedListBySearch: (keyword: string, page: number , size: number ) =>
    request.get("/torrent/search", {
      params: {
        keyword: keyword.trim(),
        page,
        size,
      }
    }),
  
  // 获取种子列表（带分类和标签筛选）
  getSeedList: (params: {
    category: string;
    tags?: string[];
    keywords?: string;
    page?: number;
    pageSize?: number;
  }) => {
    const categoryId = params.category.match(/^\d+$/)
      ? params.category
      : getCategoryIdByName(params.category);
    
    const tagIds = params.tags
      ?.map((tag) => tag.match(/^\d+$/) ? tag : getTagIdByName(tag))
      .filter((id) => id !== undefined) as string[] | undefined;
    
    if (!tagIds || tagIds.length === 0) {
      return request.get("/torrent/by-category", {
        params: {
          category_id: categoryId,
          page: params.page || 1,
          size: params.pageSize || 12,
        }
      });
    } else {
      return request.post("/torrent/filter", {
        categoryId: categoryId,
        tags: params.tags,
        page: params.page || 1,
        size: params.pageSize || 12,
      });
    }
  },
  
  // 获取种子详情
  getSeedDetail: (id: number) => 
    request.get(`/torrent/info/${id}`),
  
  // 获取磁力链接
  getMagnetLink: (seedId: number) =>
    request.get(`/torrent/download/${seedId}`),

  // 评分种子
  rateSeed: (seedId: number, rating: number) => 
    request.post("/api/values/ratings", {
      torrent_id: seedId,
      rating: rating,
      comment: "",
      weight_factor: 1,
    }),
  
  // 发布种子
  publishSeed: async (file: File, data: publishSeedData) => {
   const categoryId = getCategoryIdByName(data.category || ""); // 使用导入的函数获取分类ID
   
     // 处理标签 - 将标签名称转换为ID
     const tagIds = data.tags
       ?.map((tag) => {
         // 如果标签已经是数字ID，则直接使用，否则尝试将名称转换为ID
         return tag.match(/^\d+$/) ? tag : getTagIdByName(tag);
       })
       .filter((id) => id !== undefined);
     console.log("tagIds:", tagIds);
   
     // 创建FormData对象
     const formData = new FormData();
     formData.append("torrent_name", data.name);
     formData.append("category_id", categoryId || "0");
     formData.append("torrent_description", data.description);
   
     // 添加可选数据
     if (data.price !== undefined) {
       formData.append("origin_price", data.price.toString());
     }

     // 如果tagIds不为空，但长度为0，需要传递一个空数组而不是null
     if (tagIds) {
       // 对于每个标签ID，添加一个单独的tag参数
       tagIds.forEach((tagId) => {
         formData.append("tag", tagId.toString()); // 使用tag_ids[]表示这是一个数组
       });
     } else {
       formData.append("tag", "");
     }
   
     console.log("Publishing seed with data:", {
       torrent_name: data.name,
       category_id: categoryId || "0",
       torrent_description: data.description,
     });
   
     const token = auth.getToken();
     let apiUrl = "";
     // 判断是否使用代理 - 生产环境或指定环境不使用代理
     // const isBrowser = typeof window !== 'undefined';
     // const useProxy = isBrowser && process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_USE_PROXY !== 'false';
     // 处理API地址，如果需要代理则使用代理地址
     if (data.fileType === "normal") {
       apiUrl = "/torrent/upload-file";
       formData.append("file", file); // 添加文件类型，默认为"normal"
   
       console.log("API URL for normal file:", apiUrl);
     } else if (data.fileType === "torrent") {
       apiUrl = "/torrent/upload-torrent";
        // 添加种子文件
     formData.append("torrent_file", file);
       console.log("API URL for torrent file:", apiUrl);
     }
     // 使用axios发送FormData
     const res = await axios.post('http://localhost:8080'+apiUrl, formData, {
       headers: {
         Authorization: token ? `Bearer ${token}` : "",
       },
     });
     const torrentId = Number(res.data.data); // 假设返回的响应中包含种子ID
     const response = await request.get(
       `/torrent/download/${torrentId}`
     ).promise;
     const downloadUrl = response.data.downloadUrl; // 假设返回的响应中包含下载链接
     const success = await request.download(
       downloadUrl  
        ).promise;
     return success;
  }
};
