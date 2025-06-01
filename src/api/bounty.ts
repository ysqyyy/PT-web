import type { BountyListItem } from '../types/bounty';
import request from '../utils/request';

// 获取悬赏列表
export async function getBountyList(): Promise<BountyListItem[]> {
  return request.get('/api/request/bounty');
}

// 提交种子
export async function submitSeed(id: number, seedFile: File | null) {
  if (!seedFile) {
    return Promise.reject(new Error('请选择种子文件'));
  }
  return request.upload(`/api/request/bounty/${id}/seed`, seedFile);
}