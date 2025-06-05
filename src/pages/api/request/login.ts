// src/pages/api/request/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, password } = req.body;
    // 简单模拟：用户名和密码都为 admin 时登录成功
    if (username === 'admin' && password === 'adm123') {
      // 设置 httpOnly cookie
      res.setHeader('Set-Cookie', 'token=mocktoken; Path=/; HttpOnly; SameSite=Lax');
      res.status(200).json({ success: true, message: '登录成功' });
    } else {
      res.status(200).json({ success: false, message: '用户名或密码错误' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
