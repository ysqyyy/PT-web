import request from '../utils/request';

export const downloadApi = {
  /**
   * 获取用户的下载记录
   */
  getDownloadRecords: () => 
    request.get('/torrent/download-records'),
  
  /**
   * 根据资源ID获取下载链接
   * @param torrentId 资源ID
   */
  getDownloadUrl: (torrentId: number) => 
    request.get(`/torrent/download/${torrentId}`),
  
  /**
   * 执行下载操作
   * @param url 下载URL
   */
  downloadFile: (url: string) => 
    request.download(url)
};
