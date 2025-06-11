import request from "../utils/request";
import type { BountyListItem, MyBounty, AppendedBounty } from "../types/bounty";

// 获取我的悬赏列表 ok
export async function getMyBounties() {
  try {
    const data = await request.get("http://localhost:8080/bounty/mybounties");
    const bounties: MyBounty[] = data.map((item: any) => ({
      id: item.bounty.bountyId,
      name: item.bounty.bountyTitle,
      description: item.bounty.bountyDescription,
      status: item.bounty.bountyStatus,
      reward_amount: item.bounty.rewardAmount,
      total_amount: item.bounty.totalAmount,
    }));
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
    // console.log('获取我追加的悬赏列表:', data);
    const bounties: AppendedBounty[] = data.map((item: any) => ({
      //key改为contributionId，展示多条追加
      id: item.bounty.bountyId, //
      name: item.bounty.bountyTitle,//
      description: item.bounty.bountyDescription,//
      status: item.bounty.bountyStatus,//
      total_amount: item.amount, //
      publisher: item.bounty.creatorId,//name
    }));
    return bounties;
  } catch (error) {
    console.error("获取我追加的悬赏列表失败:", error);
    throw error;
  }
}
// 获取我提交的悬赏列表
export async function getMySubmittedBounties() {
  return request.get("/api/request/bounty/getMySubmittedBounties");
}

//追加悬赏 ok
export async function appendBounty(id: number, amount: number) {
  try {
    const response = await request.post(
      "http://localhost:8080/bounty/addamount",
      { bountyId: id, contributedAmount:amount }
    );
    return response;
  } catch (error) {
    console.error("追加悬赏失败:", error);
    throw error;
  }
}
//取消悬赏 ok
export async function cancelBounty(id: number) {
  try {
    const response = await request.post(
      "http://localhost:8080/bounty/cancel",
      { bountyId: id }
    );
    return response;
  }
  catch (error) {
    console.error("取消悬赏失败:", error);
    throw error;
  }
}
//确认悬赏
export async function confirmBounty(id: number) {
  return request.post(`/api/request/bounty/${id}/confirm`);
}
//申请仲裁
export async function arbitrateBounty(id: number, reason: string) {
  return request.post(`/api/request/bounty/${id}/arbitrate`, { reason });
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
// 获取悬赏列表 ok
export async function getBountyList(): Promise<BountyListItem[]> {
  try {
    const response = await request.get("http://localhost:8080/bounty/all");
    // console.log('获取悬赏列表:', response);
    const bounties: BountyListItem[] = response.map((item: any) => ({
      id: item.bounty.bountyId,
      name: item.bounty.bountyTitle,
      description: item.bounty.bountyDescription,
      status: item.bounty.bountyStatus,
      total_amount: item.bounty.totalAmount,
      publisher: item.bounty.creatorId, // 后面改成名字
    }));
    return bounties;
  } catch (error) {
    console.error("获取悬赏列表失败:", error);
    throw error;
  }
}

// 提交种子  return number seedId
export async function submitSeed(id: number, seedFile: File | null) {
  if (!seedFile) {
    return Promise.reject(new Error("请选择种子文件"));
  }
  return request.upload(`/api/request/bounty/${id}/seed`, seedFile);
}
