import request from "../utils/request";
import type {
  publishSeedData,
  SeedDetail,
  getSeedListParams,
} from "@/types/seed";
import auth from "../utils/auth";
import {
  getCategoryIdByName,
  getCategoryNameById,
} from "@/constants/categories";
import { getTagIdByName, getTagNameById } from "@/constants/tags";

/// 获取推荐种子列表
export async function getRecommendSeeds(
  page?: number,
  pageSize?: number,
) {
  const response = await request.get("http://localhost:8080/torrent/recommend");
  console.log("获取推荐种子:", response);
  const res = response.data.records || [];  const seeds: getSeedListParams[] = res.map((item: any) => ({
    torrentId: item.torrentId,
    torrentName: item.torrentName,
    torrentDescription: item.torrentDescription,
    torrentSize: item.torrentSize,
    downloadCount: item.downloadCount,
    status: item.torrentStatus, // 使用torrentStatus赋值给status
    originPrice: item.originPrice,
    score: item.score,
    downloadLimit: item.downloadLimit || 0,
    uploadTime: item.uploadTime || [],
    tags: item.tagNames || null
  }));
  console.log("获取推荐种子:", seeds);
  return seeds;
}
// 获取种子列表 new
export async function getSeedList(params: {
  category: string;
  tags?: string[];
  keywords?: string;
  page?: number;
  pageSize?: number;
}) {
  //转换name和id
  const categoryId = params.category.match(/^\d+$/)
    ? params.category
    : getCategoryIdByName(params.category);
  const tagIds = params.tags
    ?.map((tag) => {
      return tag.match(/^\d+$/) ? tag : getTagIdByName(tag);
    })
    .filter((id) => id !== undefined) as string[] | undefined;

  let res: getSeedListParams[] = [];
  let byKeyResult: getSeedListParams[] = [];
  let categoryResult: getSeedListParams[] = [];

  // 关键词
  if (params.keywords && params.keywords.trim() !== "") {
    const bykey = await request.get("http://localhost:8080/torrent/search", {
      params: {
        keyword: params.keywords.trim(),
        page: 1,
        size: 1000,
      },
    });
    byKeyResult = bykey?.data?.items || []; //ok
    console.log("关键词搜索结果数:", byKeyResult.length, byKeyResult);
  }

  // 处理分类和标签筛选结果
  if (!tagIds || tagIds.length === 0) {
    const bycat = await request.get(
      "http://localhost:8080/torrent/by-category",
      {
        params: {
          category_id: categoryId,
          page: 1,
          size: 1000,
        },
      }
    );
    categoryResult = bycat?.data || []; //ok
    console.log("分类搜索结果数:", categoryResult.length, categoryResult);
  } else {
    const bytagandcat = await request.post(
      "http://localhost:8080/torrent/filter",
      {
        categoryId: categoryId,
        tags: params.tags,
        page: 1,
        size: 1000,
      }
    );
    categoryResult = bytagandcat?.data?.items || [];
    console.log("分类和标签搜索结果数:", categoryResult.length, categoryResult);
  }
  // 如果关键词搜索和分类/标签搜索都有结果，取并集而不是交集
  if (byKeyResult.length > 0 && categoryResult.length > 0) {
    // 创建一个Map来存储所有结果，并使用torrentId作为键来去重
    const allResults = new Map();
    
    // 添加分类/标签搜索结果
    categoryResult.forEach(item => {
      allResults.set(item.torrentId, item);
    });
    
    // 添加关键词搜索结果
    byKeyResult.forEach(item => {
      allResults.set(item.torrentId, item);
    });
    
    // 将Map转换回数组
    res = Array.from(allResults.values());
    console.log("并集结果数:", res.length);
  }
  // 如果只有关键词搜索有结果
  else if (byKeyResult.length > 0) {
    res = byKeyResult;
  }
  // 如果只有分类/标签搜索有结果
  else {
    res = categoryResult;
  }

  // 手动分页处理
  const page = params.page || 1;
  const pageSize = params.pageSize || 10;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedResults = res.slice(startIndex, endIndex);

  // 返回分页后的结果和总数
  return {
    success: true,
    message: "获取种子列表成功",
    data: {
      torrents: paginatedResults,
      total: res.length,
      page: page,
      size: pageSize,
      pages: Math.ceil(res.length / pageSize),
    },
  };
}

// 获取种子详情 ok
export async function getSeedDetail(id: number) {
  console.log("Fetching seed detail for ID:", id);
  const response = await request.get(
    `http://localhost:8080/torrent/info/${id}`
  );
  console.log("Seed detail response:", response);
  const res = response.data;
  const seedDetail: SeedDetail = {
    torrentId: res.torrentId, //
    name: res.torrentName, //
    description: res.torrentDescription, //
    imgUrl: res?.imgUrl,

    publisherId: res.uploaderId, //
    publisherName: res.uploaderName, //
    publisherLevel: res?.publisherLevel,
    publisherAvatar: res?.publisherAvatar,

    size: res.torrentSize, // 假设返回的文件大小  //
    publishTime: res.uploadTime.join("-"), // 假设返回的上传时间  //
    downloadCount: res.downloadCount, // 假设返回的下载次数   //
    status: res.torrentStatus, // 假设返回的种子状态 //
    price: res.originPrice, // 假设返回的价格  //
    downloadLimit: res.downloadLimit, // 假设返回的下载限制  //

    score: res.score, // 假设返回的评分   //
    scoreCount: res.markingCount, // 假设返回的评分数量  //
    categoryId: res.categoryId, // 假设返回的分类ID  //
    categoryName:
      res.categoryName || getCategoryNameById(res.categoryId || "0"), // 使用分类ID获取名称  //
    tags: res.tagIds
      ? res.tagIds.map((id: string) => getTagNameById(id))
      : res.tagNames || [], // 处理标签 - 优先使用ID转换为名称，否则直接使用名称 //
  };
  console.log("Seed detail response:", seedDetail);
  return seedDetail;
}
// 评分种子 ok
export async function rateSeed(seedId: number, rating: number) {
  console.log("Rating seed with ID:", seedId, "Rating:", rating);
  return request.post(" http://localhost:8080/api/values/ratings", {
    torrent_id: seedId,
    rating: rating,
    comment: "",
    weight_factor: 1,
  });
}
import axios from "axios";

// 发布种子 ok
export async function publishSeed(file: File, data: publishSeedData) {
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

  // 添加种子文件
  formData.append("torrent_file", file);

  // 添加其他字段
  formData.append("torrent_name", data.name);
  formData.append("category_id", categoryId || "0");
  formData.append("torrent_description", data.description);

  // 添加可选数据
  if (data.price !== undefined) {
    formData.append("origin_price", data.price.toString());
  }
  // formData.append("tag", '1');
  // formData.append("tag", '2');

  // if (tagIds && tagIds.length > 0) {
  //   formData.append("tag", JSON.stringify(tagIds));
  // }
  // 如果tagIds不为空，但长度为0，需要传递一个空数组而不是null
  if (tagIds) {
    // 对于每个标签ID，添加一个单独的tag参数
    tagIds.forEach((tagId) => {
      formData.append("tag", tagId.toString()); // 使用tag_ids[]表示这是一个数组
    });
  } else {
    // 如果没有标签，添加一个空字段
    formData.append("tag", "");
  }

  console.log("Publishing seed with data:", {
    torrent_name: data.name,
    category_id: categoryId || "0",
    torrent_description: data.description,
  });

  const token = auth.getToken();
  console.log("file:", file);
  console.log("instanceof File:", file instanceof File);
  console.log("file.name:", file.name);
  console.log("file.size:", file.size);

  // 判断是否使用代理 - 生产环境或指定环境不使用代理
  // const isBrowser = typeof window !== 'undefined';
  // const useProxy = isBrowser && process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_USE_PROXY !== 'false';

  // 处理API地址，如果需要代理则使用代理地址
  const apiUrl = "http://localhost:8080/torrent/upload-torrent";

  // if (useProxy) {
  //   // 将请求重定向到我们的代理
  //   apiUrl = `/api/proxy?url=${encodeURIComponent('torrent/upload-torrent')}`;
  // }

  // 使用axios发送FormData  
  const res = await axios.post(apiUrl, formData, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  const torrentId = Number(res.data.data); // 假设返回的响应中包含种子ID
  const success = await request.download(
    `http://localhost:8080/torrent/download/${torrentId}`
  );
  return success;
}
