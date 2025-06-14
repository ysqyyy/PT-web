import request from '@/utils/request';
import type { AnalyticsData } from '@/types/analytics';

/**
 * 获取数据分析仪表盘数据 ok
 * @returns Promise<AnalyticsData> 数据分析数据 
 */
export async function getAnalyticsDashboard(): Promise<AnalyticsData> {
  try {
    const response = await request.get('http://localhost:8080/analyse/summary');
    const res={
      totalDownload: response.totalDownload || 0,
      userMonthlyUpload:response.userMonthlyUpload || [0, 0, 0, 0],
      userMonthlyDownload: response.userMonthlyDownload || [0, 0, 0, 0],
      allMonthlyUpload: response.allMonthlyUpload || [0, 0, 0, 0],
      allMonthlyDownload:response.allMonthlyDownload || [0, 0, 0, 0],
      totalTorrentCount: response.totalTorrentCount || 0,
      activeUserCount: response.activeUserCount || 0,
    }
    return res;
  } catch (error) {
    console.error('获取数据分析失败:', error);
    throw new Error('获取数据分析失败');
  }
}
