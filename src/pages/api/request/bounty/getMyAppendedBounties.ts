import { NextApiRequest, NextApiResponse } from 'next';
import { AppendedBounty } from '@/types/bounty';

// 模拟数据库中的追加悬赏数据
const appendedBounties: AppendedBounty[] = [
  {
    bountyId: 1,
    name: "求哈利波特电影全集高清资源",
    description: "1080p或4K分辨率，中英双语字幕",
    total_amount: 200,
    publisher: "magic_fan",
    status: "pending"
  },
  {
    bountyId: 2,
    name: "求WWDC 2025完整视频",
    description: "包含所有演讲和研讨会环节",
    total_amount: 150,
    publisher: "apple_dev",
    status: "approved"
  },
  {
    bountyId: 3,
    name: "求最新版PhotoShop软件",
    description: "适用于Windows系统，带破解教程",
    total_amount: 120,
    publisher: "design_pro",
    status: "unconfirmed"
  }
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // 在实际应用中，您需要从请求中获取用户ID并从数据库中查询相关数据
  res.status(200).json(appendedBounties);
}
