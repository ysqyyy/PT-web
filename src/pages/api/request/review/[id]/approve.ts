// mock: /api/request/review/[id]/approve
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // 获取请求中的ID参数
    const { id } = req.query;
    
    // 模拟审核成功的响应
    res.status(200).json({ 
      success: true, 
      message: `资源(ID: ${id})审核已通过`,
      data: {
        id: Number(id),
        approvedAt: new Date().toISOString(),
        status: 'approved'
      }
    });
  } else {
    // 如果不是POST请求，返回405 Method Not Allowed
    res.status(405).json({ 
      success: false, 
      message: 'Method Not Allowed' 
    });
  }
}