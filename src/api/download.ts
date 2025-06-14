import request from '../utils/request';
import { DownloadRecord } from '@/types/download';

/**
 * 获取用户的下载记录  ok
 */
export async function getDownloadRecords(): Promise<DownloadRecord[]> {
  try {
    const response = await request.get('http://localhost:8080/torrent/download-records');
    console.log('获取下载记录:', response.data);
    const records: DownloadRecord[] = response.data.map((item: any) => ({
      id: item.torrentId,
      filename: item.torrentName,
      date: item.downloadTime,
      size: item.downloadByte,
    }));
    console.log('下载记录列表:', records);
    return records;
  } catch (error) {
    console.error('获取下载记录失败:', error);
    throw new Error('获取下载记录失败');
  }
}

/**
 * 根据资源ID下载文件  ok
 * @param id 资源ID
 * @returns Promise
 */
export async function downloadResource(torrentId: number) {
  try {
    console.log('开始下载资源，ID:', torrentId);
    const res=await request.download(`http://localhost:8080/torrent/download/${torrentId}`);
    console.log('下载资源成功:', res);
    return { success: true };
  } catch (error) {
    console.error('下载资源出错:', error);
    throw error;
  }
}