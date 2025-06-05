import request from "@/utils/request";
import type { ReviewItem } from "@/types/review";

// 获取待审核资源列表
export const getPendingReviews = async (): Promise<ReviewItem[]> => {
  try {
    // 真实的后端API调用
    const response = await request.get('/api/request/review/pending');
    return response;
  } catch (error) {
    console.error("获取待审核资源失败:", error);
    throw new Error("获取待审核资源失败");
  }
};

// 批准资源
export const approveResource = async (id: number): Promise<{ success: boolean }> => {
  try {
    const response = await request.post(`/api/request/review/${id}/approve`);
    return response;
  } catch (error) {
    console.error("批准资源失败:", error);
    throw new Error("批准资源失败");
  }
};

// 拒绝资源
export const rejectResource = async (id: number, reason: string): Promise<{ success: boolean }> => {
  try {
    const response = await request.post(`/api/request/review/${id}/reject`, { reason });
    return response;
  } catch (error) {
    console.error("拒绝资源失败:", error);
    throw new Error("拒绝资源失败");
  }
};