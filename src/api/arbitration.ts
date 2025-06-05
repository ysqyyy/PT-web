import request from '../utils/request';

// 获取仲裁列表
export async function getArbitrationBounties() {
  return request.get("/api/request/bounty/arbitration");
}

// 驳回仲裁
export async function rejectArbitration(id: number) {
  return request.post(`/api/request/bounty/${id}/reject-arbitration`);
}

// 同意仲裁
export async function approveArbitration(id: number) {
  return request.post(`/api/request/bounty/${id}/approve-arbitration`);
}

