import request from '../utils/request';
import { ArbitrationBounty } from '@/types/bounty';

// 获取仲裁列表 ok
export async function getArbitrationBounties(): Promise<ArbitrationBounty[]> {
  try {
    const response = await request.get("/bounty/arbitration/all");
    console.log("获取仲裁悬赏列表成功:", response.data);
    const res =  response.data.map((item: any) => ({
        submissionId: item.submission.submissionId,//驳回同意用
        torrentId: item.submission?.torrentId,// 下载用
        name: item.bounty.bountyTitle,
        description: item.bounty.bountyDescription,
        status: item.bounty.bountyStatus,
        publisher: item.creatorName,
        reason: item.submission?.refuseReason,
      }))
  
    return res;
  } catch (error) {
    console.error("获取仲裁悬赏列表失败:", error);
    throw error;
  }
}

// 驳回仲裁 ok idok
export async function rejectArbitration(submissionId: number) {
  return request.post(`/bounty/arbitration/reject`, { submissionId: submissionId });
}

// 同意仲裁 ok idok
export async function approveArbitration(submissionId: number) {
  return request.post(`/bounty/arbitration/approve`, { submissionId: submissionId });
}

