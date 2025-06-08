import request from '@/utils/request';
import type { UserProfile, UpdateProfileParams, UserMessage } from '@/types/user';

/**
 * 获取用户资料
 */
export async function getUserProfile(): Promise<UserProfile> {
  try {
    const response = await request.get('http://localhost:8080/api/user/info');
    const data = response.data;
    // console.log('获取用户资料:', response);
    const userProfile: UserProfile = {
      id: data.user_id || 0,
      username: data.user_name,
      email: data.email,
      bio: data.bio || '',
      avatarUrl: data.avatar_url || '',
      registrationDate: data.created_time || '',
      level: data.level || 0, 
    };
    return userProfile;
  } catch (error) {
    console.error('获取用户资料失败:', error);
    throw error;
  }
}

/**
 * 更新用户资料
 * @param params 更新参数 
 * @returns Promise<{success: boolean}> 更新结果
 */
export async function updateUserProfile(params: UpdateProfileParams): Promise<{success: boolean}> {
  try {
    const param={
      userName: params.username,
      avatarUrl: params.avatarUrl,
      bio: params.bio
    }
    const response = await request.put('http://localhost:8080/api/user/info', param);
    return response;
  } catch (error) {
    console.error('更新用户资料失败:', error);
    throw error;
  }
}

/**
 * 获取用户消息 todo
 * @returns Promise<UserMessage[]> 用户消息列表
 */
export async function getUserMessages(): Promise<UserMessage[]> {
  try {
    const response = await request.get('/api/request/user/profile/messages');
    return response;
  } catch (error) {
    console.error('获取用户消息失败:', error);
    // 直接重新抛出原始错误，让全局拦截器处理
    throw error;
  }
}
