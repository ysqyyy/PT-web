// 定义数据分析相关的类型
export interface DownloadTrend {
  labels: string[];   // 日期标签
  values: number[];   // 下载数量
}

export interface AnalyticsData {
  downloadTrend: DownloadTrend;  // 下载趋势数据
  totalDownloads: number;        // 总下载量
  monthlyAverage: number;        // 月均下载量
  totalResources: number;        // 资源总数
  activeUsers: number;           // 活跃用户数
}
