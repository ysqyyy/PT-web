// src/api/upload.ts
import request from '../utils/request';

/**
 * 上传用户头像   ok
 * @param avatarFile 头像文件
 * @returns Promise<string> 上传成功后返回的头像URL
 */
export async function uploadAvatar(avatarFile: File): Promise<string> {
  try {
    const response = await request.upload(
      "http://localhost:8080/api/avatar/upload",
      avatarFile
    );
    console.log("上传头像成功:", response);
      return response.data;
  } catch (error) {
    console.error("上传头像失败:", error);
    throw error;
  }
}
