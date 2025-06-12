import request from '../utils/request';
import type { SeedDetail } from '@/types/seed';
// 获取种子列表 new
export async function getSeedList(params: {
    category:string;
    tags?: string[];
    keywords?: string;
    page?: number;
    pageSize?: number;
}) {
    const res= await request.post("/api/request/seed/list", params);
    console.log("Seed list response:", res);
    return res
}

// 获取种子详情 ok
export async function getSeedDetail(id: number) {
    console.log("Fetching seed detail for ID:", id);
    const response= await request.get(`http://localhost:8080/torrent/info/${id}`);
    console.log("Seed detail response:", response);
    const res = response.data;
    const seedDetail:SeedDetail ={
        torrentId: res.torrentId,//
        name: res.torrentName,//
        description: res.torrentDescription,//
        imgUrl: res?.imgUrl,

        publisherId: res.uploaderId,//
        publisherName: res.uploaderName,//
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
        categoryName: res.categoryName, // 假设返回的分类名称  //
        tags: res.tagNames, // 假设返回的标签列表 //
    }
    console.log("Seed detail response:", seedDetail);
    return seedDetail;
}
// 评分种子 ok
export async function rateSeed(seedId: number, rating: number) {
    console.log("Rating seed with ID:", seedId, "Rating:", rating);
    return request.post(" http://localhost:8080/api/values/ratings", { torrent_id:seedId, rating:rating ,comment:"",weight_factor:1}); 
}

// 发布种子 todo
export async function publishSeed(data: {
  name: string; // 种子标题
  description: string; // 种子描述
  file: File; // 种子文件
  imgUrl?: string; // 种子图片URL
  tags?: string[]; // 标签列表
  price?: number; // 种子价格
  category?: string; // 种子分类
}) {
  const formData = new FormData();

  // 添加表单数据
  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("category", data.category || "");
  if (data.imgUrl) {
    formData.append("imgUrl", data.imgUrl);
  }
  if (data.tags && data.tags.length > 0) {
    formData.append("tags", JSON.stringify(data.tags));
  }
  if (data.price !== undefined) {
    formData.append("price", data.price.toString());
  } // 添加文件
  formData.append("file", data.file);
  // 添加可选字段
  if (data.imgUrl) {
    formData.append("imgUrl", data.imgUrl);
  }

  if (data.tags && data.tags.length > 0) {
    formData.append("tags", JSON.stringify(data.tags));
  }

  if (data.price !== undefined) {
    formData.append("price", data.price.toString());
  }

  return request.post("http://localhost:8080/torrent/upload-torrent", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}