export type BountyItem = {
  id: number;
  name: string;
  reward: number;
  publisher: string;
  status: '进行中' | '已完成' | '已取消' | '待确认' | '待仲裁';
  description?: string;
};
