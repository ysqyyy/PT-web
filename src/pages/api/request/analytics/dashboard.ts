// mock: /api/request/analytics/dashboard
import type { NextApiRequest, NextApiResponse } from 'next';
import type { AnalyticsData } from '@/types/analytics';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // 模拟数据分析的响应数据
    const mockAnalyticsData: AnalyticsData = {
      downloadTrend: {
        labels: ["一月", "二月", "三月", "四月", "五月", "六月"],
        values: [65, 59, 80, 81, 56, 55]
      },
      totalDownloads: 341,
      monthlyAverage: 28.4,
      totalResources: 245,
      activeUsers: 120
    };

    // 返回数据分析数据
    res.status(200).json(mockAnalyticsData);
  } else {
    // 如果不是GET请求，返回405 Method Not Allowed
    res.status(405).json({ 
      success: false, 
      message: '方法不允许' 
    });
  }
}
