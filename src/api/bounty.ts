import type { BountyItem } from '../types/bounty';

// 获取悬赏列表
export async function getBountyList(): Promise<BountyItem[]> {
  const res = await fetch("/api/request/bounty", {
    credentials: 'include',
  });
  return res.json();
}

// 提交种子
export async function submitSeed(id: number, seedFile: File | null) {
  const formData = new FormData();
  if (seedFile) formData.append('file', seedFile);
  return fetch(`/api/request/bounty/${id}/seed`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });
}