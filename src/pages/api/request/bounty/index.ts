// src/pages/api/request/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json([
      { id: 1, name: '高清电影资源', reward: 100, publisher: '用户A', status: 'pending', description: '需要高清电影' },
      { id: 2, name: '冷门软件破解', reward: 300, publisher: '用户B', status: 'approved', description: '破解软件' },
      { id: 3, name: '动漫全集打包', reward: 200, publisher: '用户C', status: 'pending', description: '动漫全集' },
    ]);
  } else if (req.method === 'POST') {
    // 模拟发布悬赏成功
    res.status(200).json({ success: true, message: '发布悬赏成功' });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
