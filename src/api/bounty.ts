import type { BountyItem } from '../types/bounty';
import request from '../utils/request';

// 获取悬赏列表
export async function getBountyList(): Promise<BountyItem[]> {
  return request.get('/api/request/bounty');
}

// 提交种子
export async function submitSeed(id: number, seedFile: File | null) {
  const formData = new FormData();
  if (seedFile) formData.append('file', seedFile);
  return request.post(`/api/request/bounty/${id}/seed`, formData);
}