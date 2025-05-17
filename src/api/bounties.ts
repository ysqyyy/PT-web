// 获取我的悬赏列表
export async function getMyBounties() {
  const res = await fetch("/api/request/bounty/getMyBounties", {
    credentials: 'include',
  });
  return res.json();
}
//追加悬赏
export async function appendBounty(id: number, amount: number) {
  return fetch(`/api/request/bounty/${id}/append`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount }),
    credentials: 'include',
  });
}
//取消悬赏
export async function cancelBounty(id: number) {
  return fetch(`/api/request/bounty/${id}/cancel`, { method: "POST", credentials: 'include' });
}
//确认悬赏
export async function confirmBounty(id: number) {
  return fetch(`/api/request/bounty/${id}/confirm`, { method: "POST", credentials: 'include' });
}
//申请仲裁
export async function arbitrateBounty(id: number, reason: string) {
  return fetch(`/api/request/bounty/${id}/arbitrate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reason }),
    credentials: 'include',
  });
}
//发布悬赏
export async function publishBounty(title: string, bounty: number, description: string) {
  return fetch(`/api/request/bounty`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, bounty, description, attachments: [] }),
    credentials: 'include',
  });
}


