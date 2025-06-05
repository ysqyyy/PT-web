// mock: /api/request/download/[id]
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // 获取请求中的ID参数
    const { id } = req.query;
    
    // 模拟下载文件的响应
    // 在实际应用中，这里应该返回文件内容或文件下载链接
    res.status(200).json({ 
      success: true, 
      message: `文件(ID: ${id})下载已开始`,
      data: {
        id: Number(id),
        downloadUrl: `/api/files/download/${id}`, // 模拟的下载链接
        downloadStartedAt: new Date().toISOString()
      }
    });
  } else {
    // 如果不是GET请求，返回405 Method Not Allowed
    res.status(405).json({ 
      success: false, 
      message: '方法不允许' 
    });
  }
}
