import request from '@/utils/request';
import type { AnalyticsData } from '@/types/analytics';

/**
 * 获取数据分析仪表盘数据
 * @returns Promise<AnalyticsData> 数据分析数据
 */
export async function getAnalyticsDashboard(): Promise<AnalyticsData> {
  try {
    const response = await request.get('/api/request/analytics/dashboard');
    return response.data;
  } catch (error) {
    console.error('获取数据分析失败:', error);
    throw new Error('获取数据分析失败');
  }
}
