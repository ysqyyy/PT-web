// src/pages/api/request/[id]/append.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // 模拟追加悬赏成功
    res.status(200).json({ success: true, message: '追加悬赏成功' });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
