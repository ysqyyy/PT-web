import request from '@/utils/request';
import type { UserProfile, UpdateProfileParams, UserMessage } from '@/types/user';

/**
 * 获取用户资料
 * @returns Promise<UserProfile> 用户资料
 */
export async function getUserProfile(): Promise<UserProfile> {
  try {
    const response = await request.get('/api/request/user/profile');
    return response;
  } catch (error) {
    console.error('获取用户资料失败:', error);
    throw new Error('获取用户资料失败');
  }
}

/**
 * 更新用户资料
 * @param params 更新参数 
 * @returns Promise<{success: boolean}> 更新结果
 */
export async function updateUserProfile(params: UpdateProfileParams): Promise<{success: boolean}> {
  try {
    const response = await request.post('/api/request/user/profile/update', params);
    return response;
  } catch (error) {
    console.error('更新用户资料失败:', error);
    throw new Error('更新用户资料失败');
  }
}

/**
 * 获取用户消息
 * @returns Promise<UserMessage[]> 用户消息列表
 */
export async function getUserMessages(): Promise<UserMessage[]> {
  try {
    const response = await request.get('/api/request/user/profile/messages');
    return response;
  } catch (error) {
    console.error('获取用户消息失败:', error);
    throw new Error('获取用户消息失败');
  }
}
