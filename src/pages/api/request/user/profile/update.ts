// mock: /api/request/user/profile/update
import type { NextApiRequest, NextApiResponse } from 'next';
import type { UpdateProfileParams } from '@/types/user';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // 获取请求体中的参数
    const { username, avatarUrl, bio } = req.body as UpdateProfileParams;
    
    // 验证参数
    if (!username) {
      return res.status(400).json({ 
        success: false, 
        message: '用户名不能为空' 
      });
    }
    
    // 模拟更新用户资料的响应
    res.status(200).json({ 
      success: true, 
      message: '用户资料更新成功',
      data: {
        username,
        avatarUrl,
        bio,
        updatedAt: new Date().toISOString()
      }
    });
  } else {
    // 如果不是POST请求，返回405 Method Not Allowed
    res.status(405).json({ 
      success: false, 
      message: '方法不允许' 
    });
  }
}
