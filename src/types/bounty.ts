// 基础悬赏类型 - 所有悬赏类型的公共字段
export type BountyItem = {
  bountyId?: number; //提交悬赏
  torrentId?: number; // 下载用
  submissionId?:number; // 仲裁用
  name: string;
  description: string;
  status?: "pending" | "approved" | "rejected" | "unconfirmed" | "under_review";
};

// 悬赏列表项
export interface BountyListItem extends BountyItem {
  total_amount: number;
  publisher: string;
}
// 我发布的悬赏
export interface MyBounty extends BountyItem {
  reward_amount: number;
  total_amount: number;
}

// 我追加的悬赏
export interface AppendedBounty extends BountyItem {
  total_amount: number;
  publisher: string;
}

// 我提交的悬赏
export interface SubmittedBounty extends BountyItem {
  total_amount: number;
  publisher: string;
}

// 仲裁悬赏
export interface ArbitrationBounty extends BountyItem {
  publisher: string;
  reason: string;
}
