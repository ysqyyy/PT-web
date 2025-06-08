// src/api/upload.ts
import request from '../utils/request';

/**
 * 上传用户头像
 * @param avatarFile 头像文件
 * @returns Promise<string> 上传成功后返回的头像URL
 */
export async function uploadAvatar(avatarFile: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', avatarFile);
    
    const response = await request.post('http://localhost:8080/api/avatar/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('上传头像失败:', error);
    throw error;
  }
}
