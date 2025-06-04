// mock: /api/request/review/[id]/reject
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // 获取请求中的ID参数和请求体中的拒绝原因
    const { id } = req.query;
    const { reason } = req.body;
    
    // 验证拒绝原因是否存在
    if (!reason) {
      return res.status(400).json({ 
        success: false, 
        message: '拒绝原因不能为空' 
      });
    }
    
    // 模拟拒绝审核的响应
    res.status(200).json({ 
      success: true, 
      message: `资源(ID: ${id})已被拒绝`,
      data: {
        id: Number(id),
        rejectedAt: new Date().toISOString(),
        status: 'rejected',
        reason: reason
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