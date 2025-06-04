// mock: /api/request/download/records
import type { NextApiRequest, NextApiResponse } from 'next';
import type { DownloadRecord } from '@/types/download';

export default function handler(req: NextApiRequest, res: NextApiResponse) {  if (req.method === 'GET') {
    // 模拟下载记录数据
    const mockDownloadRecords: DownloadRecord[] = [
      { id: 1, fileName: "React项目模板.zip", date: "2025-06-01", size: "25.6 MB", type: "bounty" },
      { id: 2, fileName: "Vue后台管理系统.zip", date: "2025-05-28", size: "18.2 MB", type: "resource" },
      { id: 3, fileName: "Next.js电商平台源码.zip", date: "2025-05-20", size: "32.5 MB", type: "bounty" },
      { id: 4, fileName: "Node.js API框架.zip", date: "2025-05-15", size: "8.4 MB", type: "resource" },
      { id: 5, fileName: "Flutter移动应用源码.zip", date: "2025-05-10", size: "45.7 MB", type: "bounty" },
      { id: 6, fileName: "微信小程序商城.zip", date: "2025-05-05", size: "15.3 MB", type: "resource" },
      { id: 7, fileName: "Python数据分析工具.zip", date: "2025-05-01", size: "12.9 MB", type: "bounty" }
    ];
    res.status(200).json(mockDownloadRecords);
  } else {
    // 如果不是GET请求，返回405 Method Not Allowed
    res.status(405).json({ 
      success: false, 
      message: '方法不允许' 
    });
  }
}
