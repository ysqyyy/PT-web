// 定义下载记录的类型
export interface DownloadRecord {
  id: number;
  fileName: string;
  date: string;
  size: string;
  type: 'bounty' | 'resource'; // 资源类型
}
