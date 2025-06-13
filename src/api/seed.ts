import request from "../utils/request";
import type { publishSeedData, SeedDetail } from "@/types/seed";
// 获取认证token
import auth from "../utils/auth"; // 确保有此文件并导出 getToken 方法
import {
  getCategoryIdByName,
  getCategoryNameById,
} from "@/constants/categories";
import { getTagIdByName, getTagNameById } from "@/constants/tags";
// 获取种子列表 new
export async function getSeedList(params: {
  category: string;
  tags?: string[];
  keywords?: string;
  page?: number;
  pageSize?: number;
}) {
  // 转换分类名称为分类ID（如果传入的是分类名称而非ID）
  const categoryParam = params.category.match(/^\d+$/)
    ? params.category
    : getCategoryIdByName(params.category);

  // 转换标签名称为标签ID（如果有标签参数）
  const tagIds = params.tags
    ?.map((tag) => {
      // 如果标签已经是数字ID，则直接使用，否则尝试将名称转换为ID
      return tag.match(/^\d+$/) ? tag : getTagIdByName(tag);
    })
    .filter((id) => id !== undefined) as string[] | undefined;

  const requestParams = {
    ...params,
    category: categoryParam,
    tags: tagIds,
  };

  const res = await request.post("/api/request/seed/list", requestParams);
  console.log("Seed list response:", res);
  return res;
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

// 发布种子 todo
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
  return axios.post(apiUrl, formData, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
}
