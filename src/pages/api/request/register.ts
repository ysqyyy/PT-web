// src/pages/api/request/register.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { email, password, invite, captcha } = req.body;
    // 简单模拟：邮箱和密码都不为空时注册成功
    if (email && password) {
      res.status(200).json({ success: true, message: '注册成功' });
    } else {
      res.status(200).json({ success: false, message: '邮箱和密码不能为空' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
