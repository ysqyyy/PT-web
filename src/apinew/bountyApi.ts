import request from "../utils/request";
import type {
  BountyListItem,
  MyBounty,
  AppendedBounty,
  SubmittedBounty,
} from "../types/bounty";
import axios from "axios";
import { getTagIdByName } from "@/constants/tags";
import { getCategoryIdByName } from "@/constants/categories";
import auth from "@/utils/auth";

// 通用响应类型定义
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 悬赏相关响应类型
export interface BountyResponse {
  code: number;
  message: string;
  data: {
    success: boolean;
    bountyId?: number;
  };
}

export interface UploadResponse {
  code: number;
  message: string;
  data: number; // torrentId
}

export interface DownloadUrlResponse {
  code: number;
  message: string;
  data: {
    downloadUrl: string;
  };
}

// API 对象，负责与服务器通信
export const bountyApi = {
  /**
   * 获取我的悬赏列表
   */
  getMyBounties: () => 
    request.get<any>("/bounty/mybounties"),
  
  /**
   * 获取我追加的悬赏列表
   */
  getMyAppendedBounties: () => 
    request.get<any>("/bounty/mycontributions"),
  
  /**
   * 获取我提交的悬赏列表
   */
  getMySubmittedBounties: () => 
    request.get<any>("/bounty/mysubmissions"),
  
  /**
   * 追加悬赏
   * @param bountyId 悬赏ID
   * @param amount 追加金额
   */
  appendBounty: (bountyId: number, amount: number) => 
    request.post<BountyResponse>("/bounty/addamount", { 
      bountyId: bountyId, 
      contributedAmount: amount 
    }),
  
  /**
   * 取消悬赏
   * @param bountyId 悬赏ID
   */
  cancelBounty: (bountyId: number) => 
    request.post<BountyResponse>("/bounty/cancel", {
      bountyId: bountyId,
    }),
  
  /**
   * 确认悬赏
   * @param submissionId 提交ID
   */
  confirmBounty: (submissionId: number) => 
    request.post<BountyResponse>("/bounty/approve", { 
      submissionId: submissionId 
    }),
  
  /**
   * 申请仲裁
   * @param submissionId 提交ID
   * @param reason 原因
   */
  arbitrateBounty: (submissionId: number, reason: string) => 
    request.post<BountyResponse>("/bounty/reject", {
      reason: reason,
      submissionId: submissionId,
    }),
  
  /**
   * 获取悬赏列表
   */
  getBountyList: () => 
    request.get<any>("/bounty/all"),
  
  /**
   * 发布悬赏
   * @param title 标题
   * @param bounty 悬赏金额
   * @param description 描述
   * @param category 分类
   * @param tags 标签
   */
  publishBounty: (
    title: string,
    bounty: number,
    description: string,
    category: string,
    tags?: string[]
  ) => {
    const categoryId = category.match(/^\d+$/)
      ? category
      : getCategoryIdByName(category);
    if (!categoryId) {
      return {
        promise: Promise.reject(new Error("无效的分类")),
      };
    }
    
    // 如果tags是字符串数组，转换为数字ID数组
    const tagIds = tags
      ? tags.map((tag) => (tag.match(/^\d+$/) ? tag : getTagIdByName(tag)))
      : [];
    
    return request.post<BountyResponse>("/bounty/publish", {
      bountyTitle: title,
      rewardAmount: bounty,
      bountyDescription: description,
      categoryId: categoryId,
      tags: tagIds || [],
    });
  },
  
  /**
   * 提交种子
   * @param bountyId 悬赏ID
   * @param seedFile 种子文件
   */
  submitSeed: async (bountyId: number, seedFile: File | null) => {
    if (!seedFile) {
      return Promise.reject(new Error("请选择种子文件"));
    }
    
    const formData = new FormData();
    formData.append("file", seedFile);
    formData.append("bounty_id", bountyId.toString());
    const token = auth.getToken();
    
    // 上传种子文件
    const res = await axios.post<UploadResponse>(
      'http://localhost:8080/bounty/upload-file',
      formData,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );
    
    // 提取种子ID并下载种子文件
    const torrentId = Number(res.data.data);
    const response = await request.get<DownloadUrlResponse>(`/torrent/download/${torrentId}`).promise;
    const url = response.data?.downloadUrl;
    if (url) {
      await request.download(url).promise;
    }
    
    return res;
  }
};
