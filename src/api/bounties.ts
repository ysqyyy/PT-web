import request from "../utils/request";
import type {
  BountyListItem,
  MyBounty,
  AppendedBounty,
  SubmittedBounty,
} from "../types/bounty";

// 获取我的悬赏列表 ok
export async function getMyBounties() {
  try {
    const data = await request.get("/bounty/mybounties");
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
    console.log("获取我的悬赏列表:", bounties);
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
      "/bounty/mycontributions"
    );
    console.log("获取我追加的悬赏列表:", data);
    const bounties: AppendedBounty[] = data.map((item: any) => ({
      //key改为contributionId，展示多条追加
      bountyId: item.bounty?.bountyId, //追加悬赏用 提交种子用
      torrentId: item.submission?.torrentId, //下载用
      submissionId: item.submission?.submissionId,
      name: item.bounty?.bountyTitle,
      description: item.bounty?.bountyDescription,
      status: item.bounty?.bountyStatus,
      contributedAmount: item.contribution?.contributedAmount,
      publisher: item?.creatorName,
    }));
    console.log("处理后的悬赏列表:", bounties);
    return bounties;
  } catch (error) {
    console.error("获取我追加的悬赏列表失败:", error);
    throw error;
  }
}
// 获取我提交的悬赏列表 ok
export async function getMySubmittedBounties(): Promise<SubmittedBounty[]> {
  try {
    const data = await request.get(
      "/bounty/mysubmissions"
    );
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
  } catch (error) {
    console.error("获取我提交的悬赏列表失败:", error);
    throw error;
  }
}

//追加悬赏 ok
export async function appendBounty(bountyId: number, amount: number) {
  try {
    const response = await request.post(
      "/bounty/addamount",
      { bountyId: bountyId, contributedAmount: amount }
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
    const response = await request.post("/bounty/cancel", {
      bountyId: bountyId,
    });
    return response;
  } catch (error) {
    console.error("取消悬赏失败:", error);
    throw error;
  }
}
//确认悬赏 ok
export async function confirmBounty(submissionId: number) {
  try {
    const response = await request.post(
      "/bounty/approve",
      { submissionId: submissionId }
    );
    console.log("确认悬赏成功:", response);
    return response;
  } catch (error) {
    console.error("确认悬赏失败:", error);
    throw error;
  }
}
//申请仲裁 ok
export async function arbitrateBounty(submissionId: number, reason: string) {
  return request.post(`/bounty/reject`, {
    reason: reason,
    submissionId: submissionId,
  });
}

// 获取悬赏列表 ok
export async function getBountyList(): Promise<BountyListItem[]> {
  try {
    const response = await request.get("/bounty/all");
    console.log("获取悬赏列表:", response);
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
import axios from "axios";
import { getTagIdByName } from "@/constants/tags";
import { getCategoryIdByName } from "@/constants/categories";
//发布悬赏  ok
export async function publishBounty(
  title: string,
  bounty: number,
  description: string,
  category: string,
  tags?: string[]
) {
  const categoryId = category.match(/^\d+$/)
    ? category
    : getCategoryIdByName(category);
  if (!categoryId) {
    return Promise.reject(new Error("无效的分类"));
  }
  // 如果tags是字符串数组，转换为数字ID数组
  const tagIds = tags
    ? tags.map((tag) => (tag.match(/^\d+$/) ? tag : getTagIdByName(tag)))
    : [];
  console.log("发布悬赏数据:", {
    title,
    bounty,
    description,
    categoryId,
    tagIds,
  });
  return request.post(`/bounty/publish`, {
    bountyTitle: title,
    rewardAmount: bounty,
    bountyDescription: description,
    categoryId: categoryId,
    tags: tagIds || [],
  });
}
import auth from "@/utils/auth"; // 确保导入auth模块
// 提交种子  ok
export async function submitSeed(bountyId: number, seedFile: File | null) {
  if (!seedFile) {
    return Promise.reject(new Error("请选择种子文件"));
  }
  const formData = new FormData();
  formData.append("file", seedFile);
  formData.append("bounty_id", bountyId.toString());
  const token = auth.getToken();
  console.log("提交种子数据:", seedFile, bountyId);
  const res = await axios.post(
    `/bounty/upload-file`,
    formData,
    {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    }
  );
  // console.log("提交种子响应:", res);
  const torrentId = Number(res.data.data);
  // console.log("下载种子文件成功，种子ID:", torrentId);
  await request.download(`/torrent/download/${torrentId}`);

  console.log("提交种子响应:", res);
  return res;
}
