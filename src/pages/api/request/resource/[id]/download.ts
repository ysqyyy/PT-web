// mock: /api/request/resource/[id]/download
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // 获取请求中的ID参数
    const { id } = req.query;
    
    // 模拟下载资源的响应
    // 在实际应用中，这里应该返回资源文件内容
    res.status(200).json({ 
      success: true, 
      message: `资源(ID: ${id})下载已开始`,
      data: {
        id: Number(id),
        resourceType: 'resource',
        downloadUrl: `/api/files/resources/${id}`, // 模拟的下载链接
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
