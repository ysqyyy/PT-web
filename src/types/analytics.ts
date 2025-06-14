// 定义数据分析相关的类型
export interface DownloadTrend {
  labels: string[];   // 日期标签
  values: number[];   // 下载数量
}

export interface AnalyticsData {
  userMonthlyUpload: number[];    // 用户月度上传数据（近4个月）
  userMonthlyDownload: number[];  // 用户月度下载数据（近4个月）
  allMonthlyUpload: number[];     // 全站月度上传数据（近4个月）
  allMonthlyDownload: number[];   // 全站月度下载数据（近4个月）
  totalDownload: number;          // 总下载量
  totalTorrentCount: number;      // 资源总数
  activeUserCount: number;        // 活跃用户数
}
