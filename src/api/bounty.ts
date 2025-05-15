// bounty.ts

// 获取悬赏列表（mock，可替换为真实接口）
import type { BountyItem } from '../types/bounty';

export async function getBountyList(): Promise<BountyItem[]> {
  return [
    { id: 1, name: '高清电影资源', reward: 100, publisher: '用户A', status: '进行中', description: '需要高清电影' },
    { id: 2, name: '冷门软件破解', reward: 300, publisher: '用户B', status: '已完成', description: '破解软件' },
    { id: 3, name: '动漫全集打包', reward: 200, publisher: '用户C', status: '进行中', description: '动漫全集' },
  ];
}

// 提交种子响应（支持链接和文件上传）
export async function submitSeed(id: number, seedFile: File | null) {
  const formData = new FormData();
  if (seedFile) formData.append('file', seedFile);
  return fetch(`/rewards/request/${id}/seed`, {
    method: 'POST',
    body: formData,
  });
}