// src/api/upload.ts
import request from '../utils/request';

/**
 * 上传单个文件
 * @param file 文件对象
 * @param description 可选的文件描述
 * @returns Promise
 */
export async function uploadSingleFile(file: File, description?: string) {
  const additionalData = description ? { description } : undefined;
  
  return request.upload('/api/request/upload/single', file, additionalData);
}

/**
 * 上传多个文件
 * @param files 文件数组
 * @param folderId 目标文件夹ID
 * @returns Promise
 */
export async function uploadMultipleFiles(files: File[], folderId?: number) {
  const additionalData = folderId ? { folderId } : undefined;
  
  return request.upload('/api/request/upload/multiple', files, additionalData);
}

/**
 * 上传带分类的文件
 * @param files 不同分类的文件对象
 * @param metadata 元数据
 * @returns Promise
 */
export async function uploadCategorizedFiles(
  files: { cover?: File, content?: File, attachments?: File[] },
  metadata: { title: string, description?: string, tags?: string[] }
) {
  // 处理attachments
  const processedFiles: Record<string, File> = {};
  
  if (files.cover) {
    processedFiles.cover = files.cover;
  }
  
  if (files.content) {
    processedFiles.content = files.content;
  }
  
  if (files.attachments && files.attachments.length > 0) {
    files.attachments.forEach((file, index) => {
      processedFiles[`attachment${index}`] = file;
    });
  }
  
  return request.upload(
    '/api/request/upload/resource', 
    processedFiles,
    metadata
  );
}

/**
 * 上传用户头像
 * @param avatarFile 头像文件
 * @returns Promise<{avatarUrl: string}> 上传成功后返回的头像URL
 */
export async function uploadAvatar(avatarFile: File): Promise<{avatarUrl: string}> {
  try {
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    
    const response = await request.post('http://localhost:8080/api/user/avatar/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return { avatarUrl: response.data.avatar_url || response.data.avatarUrl };
  } catch (error) {
    console.error('上传头像失败:', error);
    throw error;
  }
}
