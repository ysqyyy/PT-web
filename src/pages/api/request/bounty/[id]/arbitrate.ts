// src/pages/api/request/[id]/arbitrate.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // 模拟仲裁成功
    res.status(200).json({ success: true, message: '仲裁申请已提交' });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
