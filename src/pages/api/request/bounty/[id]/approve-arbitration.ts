// mock: /api/request/bounty/[id]/approve-arbitration
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // 可根据 id 做不同返回，这里简单返回成功
    res.status(200).json({ success: true, message: '仲裁已同意' });
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
