import request from "@/utils/request";
import type { ReviewItem } from "@/types/review";

// 获取待审核资源列表 ok
export const getPendingReviews = async (): Promise<ReviewItem[]> => {
  try {
    // 真实的后端API调用
    const response = await request.get(' http://localhost:8080/api/admin/torrents/pending');
    const reviews: ReviewItem[] = response.data.list.map((item: any) => ({
      id: item.torrentId,
      name: item.torrentName,
      description: item.torrentDescription,
      uploader: item.uploaderName,
      date: item.uploadTime,
    }));
    console.log("获取待审核资源:", reviews);
    
    return reviews;
  } catch (error) {
    console.error("获取待审核资源失败:", error);
    throw new Error("获取待审核资源失败");
  }
};

// 批准资源 ok
export const approveResource = async (id: number): Promise<{ success: boolean }> => {
  try {
    const response = await request.post(`http://localhost:8080/api/admin/review`,{torrentId:id,action:"approve"});
    return response;
  } catch (error) {
    console.error("批准资源失败:", error);
    throw new Error("批准资源失败");
  }
};

// 拒绝资源   request字段？
export const rejectResource = async (id: number, reason: string): Promise<{ success: boolean }> => {
  try {
    const response = await request.post(`http://localhost:8080/api/admin/review`,{torrentId:id,action:"",reason:reason});
    return response;
  } catch (error) {
    console.error("拒绝资源失败:", error);
    throw new Error("拒绝资源失败");
  }
};