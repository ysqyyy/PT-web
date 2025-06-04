// mock: /api/request/user/profile
import type { NextApiRequest, NextApiResponse } from 'next';
import type { UserProfile } from '@/types/user';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // 模拟用户资料数据
    const mockUserProfile: UserProfile = {
      username: "John Doe",
      email: "johndoe@example.com",
      avatarUrl: "/avatar.png",
      bio: "我是一个开发者，喜欢编程和学习新技术。",
      registrationDate: "2025-04-15"
    };

    // 返回用户资料数据
    res.status(200).json(mockUserProfile);
  } else {
    // 如果不是GET请求，返回405 Method Not Allowed
    res.status(405).json({ 
      success: false, 
      message: '方法不允许' 
    });
  }
}
