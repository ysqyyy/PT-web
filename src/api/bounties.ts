import request from '../utils/request';

// 获取我的悬赏列表
export async function getMyBounties() {
  return request.get("/api/request/bounty/getMyBounties");
}
// 获取我追加的悬赏列表
export async function getMyAppendedBounties() {
  return request.get("/api/request/bounty/getMyAppendedBounties");
}
// 获取我提交的悬赏列表
export async function getMySubmittedBounties() {
  return request.get("/api/request/bounty/getMySubmittedBounties");
}


//追加悬赏
export async function appendBounty(id: number, amount: number) {
  return request.post(`/api/request/bounty/${id}/append`, { amount });
}

//取消悬赏
export async function cancelBounty(id: number) {
  return request.post(`/api/request/bounty/${id}/cancel`);
}

//确认悬赏
export async function confirmBounty(id: number) {
  return request.post(`/api/request/bounty/${id}/confirm`);
}

//申请仲裁
export async function arbitrateBounty(id: number, reason: string) {
  return request.post(`/api/request/bounty/${id}/arbitrate`, { reason });
}

//发布悬赏
export async function publishBounty(title: string, bounty: number, description: string) {
  return request.post(`/api/request/bounty`, { 
    title, 
    bounty, 
    description, 
    attachments: [] 
  });
}

//下载悬赏资源
export async function downloadBountyResource(id: number) {
  return request.download(`/api/request/bounty/${id}/download`, `bounty-${id}.zip`);
}

//提交悬赏资源
export async function submitBountyResource(id: number, file: File, description: string) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('description', description);
  
  return request.post(`/api/request/bounty/${id}/submit`, formData);
}


