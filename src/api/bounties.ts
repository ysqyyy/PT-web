// src/api/bounty.ts

// 获取我的悬赏列表（mock，可替换为真实接口），需传输当前用户id
export async function getMyBounties() {
  const res = await fetch("/api/request/bounty/getMyBounties", {
    credentials: 'include',
  });
  return res.json();
}
export async function appendBounty(id: number, amount: number) {
  return fetch(`/api/request/bounty/${id}/append`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount }),
    credentials: 'include',
  });
}

export async function cancelBounty(id: number) {
  return fetch(`/api/request/bounty/${id}/cancel`, { method: "POST", credentials: 'include' });
}

export async function confirmBounty(id: number) {
  return fetch(`/api/request/bounty/${id}/confirm`, { method: "POST", credentials: 'include' });
}

export async function arbitrateBounty(id: number, reason: string) {
  return fetch(`/api/request/bounty/${id}/arbitrate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reason }),
    credentials: 'include',
  });
}

export async function publishBounty(title: string, bounty: number, description: string) {
  return fetch(`/api/request/bounty`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, bounty, description, attachments: [] }),
    credentials: 'include',
  });
}


