// 基础悬赏类型 - 所有悬赏类型的公共字段
export type BountyItem = {
  id: number;
  name: string;
  description: string;
  status: "pending" | "已完成" | "已取消" | "待确认" | "待仲裁";
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
