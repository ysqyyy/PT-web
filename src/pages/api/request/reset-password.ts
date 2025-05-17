// src/pages/api/request/reset-password.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, captcha, password } = req.body;
    // 简单校验
    if (!email || !captcha || !password) {
      res.status(200).json({ success: false, message: '参数不完整' });
      return;
    }
    // mock 验证码为 123456
    if (captcha !== '123456') {
      res.status(200).json({ success: false, message: '验证码错误' });
      return;
    }
    res.status(200).json({ success: true, message: '密码重置成功' });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
