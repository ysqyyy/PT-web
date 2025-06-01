import request from '../utils/request';

/**
 * 根据资源ID下载文件
 * @param id 资源ID
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

/**
 * 通用文件下载函数
 * 已知URL和文件名的情况下使用
 * @param url 下载链接
 * @param filename 文件名
 */
export function downloadFile(url: string, filename: string) {
  return request.download(url, filename);
}