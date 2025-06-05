import request from '../utils/request';
import { DownloadRecord } from '@/types/download';

/**
 * 获取用户的下载记录
 * @returns Promise<DownloadRecord[]> 下载记录列表
 */
export async function getDownloadRecords(): Promise<DownloadRecord[]> {
  try {
    const response = await request.get('/api/request/download/records');
    return response;
  } catch (error) {
    console.error('获取下载记录失败:', error);
    throw new Error('获取下载记录失败');
  }
}

/**
 * 根据资源ID下载文件
 * @param id 资源ID 或 悬赏ID
 * @param resourceType 资源类型，默认为'resource'
 * @returns Promise
 */
export async function downloadResource(id: number, resourceType: 'resource' | 'bounty' = 'resource') {
  try {
    // 构建下载URL，根据资源类型区分
    const downloadUrl = resourceType === 'bounty' 
      ? `/api/request/bounty/${id}/download` 
      : `/api/request/resource/${id}/download`;
    
    // 使用request中间件的download方法
    await request.download(downloadUrl);
    
    return { success: true };
  } catch (error) {
    console.error('下载资源出错:', error);
    throw error;
  }
}