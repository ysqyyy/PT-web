// src/pages/api/request/[id]/cancel.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // 模拟成功
    res.status(200).json({ success: true, message: '取消成功' });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
