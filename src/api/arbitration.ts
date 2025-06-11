import request from '../utils/request';
import { ArbitrationBounty } from '@/types/bounty';

// 获取仲裁列表 ok
export async function getArbitrationBounties(): Promise<ArbitrationBounty[]> {
  try {
    const response = await request.get("http://localhost:8080/bounty/arbitration/all");
    console.log("获取仲裁悬赏列表成功:", response.data);
    const res =  response.data.map((item: any) => ({
        id: item.submission.submissionId,
        name: item.bounty.bountyTitle,
        description: item.bounty.bountyDescription,
        status: item.bounty.bountyStatus,
        publisher: item.creatorName,
        reason: item.submission?.refuseReason,
        torrentId: item.submission?.torrentId,
      }))
  
    return res;
  } catch (error) {
    console.error("获取仲裁悬赏列表失败:", error);
    throw error;
  }
}

// 驳回仲裁 ok
export async function rejectArbitration(id: number) {
  return request.post(`http://localhost:8080/bounty/arbitration/reject`, { submissionId: id });
}

// 同意仲裁 ok
export async function approveArbitration(id: number) {
  return request.post(`http://localhost:8080/bounty/arbitration/approve`, { submissionId: id });
}

