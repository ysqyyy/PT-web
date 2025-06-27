import request from '../utils/request';
import type { UpdateProfileParams, UserMessage } from '@/types/user';

// 接口响应类型定义
export interface UserProfileResponse {
  code: number;
  message: string;
  data: {
    user_id: number;
    user_name: string;
    email: string;
    bio: string;
    avatar_url: string;
    created_time: string;
    level: number;
  };
}

export interface UpdateProfileResponse {
  code: number;
  message: string;
  data: {
    success: boolean;
  };
}

export interface UserMessagesResponse {
  code: number;
  message: string;
  data: UserMessage[];
}

export interface UpdatePasswordResponse {
  code: number;
  message: string;
  data: {
    success: boolean;
  };
}

// API 层只负责与服务器通信，不处理业务逻辑
export const userApi = {
  /**
   * 获取用户资料
   */
  getUserProfile: () => 
    request.get<UserProfileResponse>('/api/user/info'),
  
  /**
   * 更新用户资料
   * @param params 更新参数
   */
  updateUserProfile: (params: UpdateProfileParams) => 
    request.put<UpdateProfileResponse>('/api/user/info', {
      userName: params.username,
      avatarUrl: params.avatarUrl,
      bio: params.bio
    }),
  
  /**
   * 修改用户密码
   * @param oldPassword 旧密码
   * @param newPassword 新密码
   */
  updateUserPassword: (oldPassword: string, newPassword: string) => 
    request.put<UpdatePasswordResponse>('/api/user/password', {
      oldPassword,
      newPassword
    }),
    /**
   * 上传用户头像
   * @param avatarFile 头像文件
   * @returns Promise<string> 上传成功后返回的头像URL
   */
  uploadAvatar: (avatarFile: File) => {
    return request.upload<{code: number; message: string; data: string}>('/api/avatar/upload', avatarFile);
  }
};
