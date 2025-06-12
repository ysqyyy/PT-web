import request from "../utils/request";
import type { BountyListItem, MyBounty, AppendedBounty,SubmittedBounty } from "../types/bounty";

// 获取我的悬赏列表 ok
export async function getMyBounties() {
  try {
    const data = await request.get("http://localhost:8080/bounty/mybounties");
    const bounties: MyBounty[] = data.map((item: any) => ({
      bountyId: item.bounty?.bountyId, //追加 取消悬赏用
      torrentId: item.submission?.torrentId, // 下载用
      submissionId: item.submission?.submissionId, // 申请仲裁用
      name: item.bounty?.bountyTitle,
      description: item.bounty?.bountyDescription,
      status: item.bounty?.bountyStatus,
      reward_amount: item.bounty?.rewardAmount,
      total_amount: item.bounty?.totalAmount,
    }));
    console.log('获取我的悬赏列表:', bounties);
    return bounties;
  } catch (error) {
    console.error("获取我的悬赏列表失败:", error);
    throw error;
  }
}
// 获取我追加的悬赏列表 ok 
export async function getMyAppendedBounties() {
  try {
    const data = await request.get(
      "http://localhost:8080/bounty/mycontributions"
    );
    console.log('获取我追加的悬赏列表:', data);
    const bounties: AppendedBounty[] = data.map((item: any) => ({
      //key改为contributionId，展示多条追加
      bountyId: item.bounty?.bountyId,  //追加悬赏用 提交种子用
      torrentId: item.submission?.torrentId,   //下载用
      submissionId: item.submission?.submissionId, 
      name: item.bounty?.bountyTitle,
      description: item.bounty?.bountyDescription,
      status: item.bounty?.bountyStatus,
      total_amount: item.bounty?.totalAmount, 
      publisher: item?.creatorName,
    }));
    console.log('处理后的悬赏列表:', bounties);
    return bounties;
  } catch (error) {
    console.error("获取我追加的悬赏列表失败:", error);
    throw error;
  }
}
// 获取我提交的悬赏列表 ok
export async function getMySubmittedBounties() : Promise<SubmittedBounty[]> {
  try{
    const data = await request.get("http://localhost:8080/bounty/mysubmissions");
    const bounties: SubmittedBounty[] = data.map((item: any) => ({
      bountyId: item.bounty.bountyId,
      torrentId: item.submission.torrentId, // 下载用
      submissionId: item.submission.submissionId, 
      name: item.bounty.bountyTitle,
      description: item.bounty.bountyDescription,
      status: item.bounty.bountyStatus,
      publisher: item.creatorName,
      total_amount: item.bounty.totalAmount,
    }));
    return bounties;
  }
  catch (error) {
    console.error("获取我提交的悬赏列表失败:", error);  
    throw error;
  }
}

//追加悬赏 ok
export async function appendBounty(bountyId: number, amount: number) {
  try {
    const response = await request.post(
      "http://localhost:8080/bounty/addamount",
      { bountyId: bountyId, contributedAmount:amount }
    );
    return response;
  } catch (error) {
    console.error("追加悬赏失败:", error);
    throw error;
  }
}
//取消悬赏 ok
export async function cancelBounty(bountyId: number) {
  try {
    const response = await request.post(
      "http://localhost:8080/bounty/cancel",
      { bountyId: bountyId }
    );
    return response;
  }
  catch (error) {
    console.error("取消悬赏失败:", error);
    throw error;
  }
}
//确认悬赏 ok
export async function confirmBounty(submissionId: number) {
  try {
    const response = await request.post(
      "http://localhost:8080/bounty/approve",
      { submissionId: submissionId }
    );
    console.log("确认悬赏成功:", response);
    return response;
  }
  catch (error) {
    console.error("确认悬赏失败:", error);
    throw error;
  }
}
//申请仲裁 ok
export async function arbitrateBounty(submissionId: number, reason: string) {
  return request.post(`http://localhost:8080/bounty/reject`, { reason: reason, submissionId: submissionId });
}

// 获取悬赏列表 ok
export async function getBountyList(): Promise<BountyListItem[]> {
  try {
    const response = await request.get("http://localhost:8080/bounty/all");
    console.log('获取悬赏列表:', response);
    const bounties: BountyListItem[] = response.map((item: any) => ({
      bountyId: item.bounty?.bountyId, // 追加悬赏用  提交种子用
      submissionId: item.submission?.submissionId, 
      torrentId: item.submission?.torrentId, // 下载用
      name: item.bounty.bountyTitle,
      description: item.bounty.bountyDescription,
      status: item.bounty.bountyStatus,
      total_amount: item.bounty.totalAmount,
      publisher: item.creatorName, 
    }));
    return bounties;
  } catch (error) {
    console.error("获取悬赏列表失败:", error);
    throw error;
  }
}

//发布悬赏
export async function publishBounty(
  title: string,
  bounty: number,
  description: string
) {
  return request.post(`/api/request/bounty`, {
    title,
    bounty,
    description,
    attachments: [],
  });
}
// 提交种子  return number seedId
export async function submitSeed(bountyId: number, seedFile: File | null) {
  if (!seedFile) {
    return Promise.reject(new Error("请选择种子文件"));
  }
  return request.upload(`/api/request/bounty/${bountyId}/seed`, seedFile);
}
