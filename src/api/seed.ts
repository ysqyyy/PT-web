import request from "../utils/request";

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
  console.log("Fetching seed detail for ID:", id);
  const res = await request.get(`/api/request/seed/detail/${id}`);
  console.log("Seed detail response:", res);
  return res;
}
// 评分种子
export async function rateSeed(seedId: number, rating: number) {
  return request.post("/api/request/seed/rate", { seedId, rating });
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

  return request.post("/api/request/seed/publish", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

// // 获取种子发布预设选项
// export async function getPublishPresets() {
//     return request.get("/api/request/seed/publish-presets");
// }

// 感谢种子发布者
export async function thankPublisher(seedId: number) {
  return request.post("/api/request/seed/thank", { seedId });
}
