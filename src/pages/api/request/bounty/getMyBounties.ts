// src/pages/api/request/bounty/my-bounties.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json([
      { id: 1, title: "悬赏A", amount: 50, status: "进行中" },
      { id: 2, title: "悬赏B", amount: 100, status: "已完成" },
      { id: 3, title: "悬赏C", amount: 100, status: "待确认" },
    ]);
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
