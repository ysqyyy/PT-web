import { NextApiRequest, NextApiResponse } from 'next';
import { SubmittedBounty } from '@/types/bounty';

// 模拟数据库中的提交悬赏数据
const submittedBounties: SubmittedBounty[] = [
  {
    id: 1,
    name: "哈利波特电影全集高清资源",
    description: "已上传1080p高清版本，带中英字幕",
    total_amount: 150,
    publisher: "harry_fan",
    status: "已完成"
  },
  {
    id: 2,
    name: "Python高级编程教程",
    description: "包含源代码和课程笔记",
    total_amount: 80,
    publisher: "code_master",
    status: "待确认"
  },
  {
    id: 3,
    name: "《双城记》有声读物",
    description: "英文朗读版，音质清晰",
    total_amount: 60,
    publisher: "book_lover",
    status: "pending"
  }
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // 在实际应用中，您需要从请求中获取用户ID并从数据库中查询相关数据
  res.status(200).json(submittedBounties);
}
