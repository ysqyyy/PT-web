// src/pages/api/request/bounty/[id]/seed.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // 模拟文件上传和种子提交成功
    res.status(200).json({ success: true, message: '种子提交成功' });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
