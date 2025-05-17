// src/pages/api/request/send-captcha.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { email } = req.body;
    if (email) {
      // 模拟发送验证码
      // 模拟验证码发送成功
      res
        .status(200)
        .json({ success: true, message: "验证码已发送", code: "123456" });
    } else {
      res.status(405).json({ error: "Method Not Allowed" });
    }
  }
}
