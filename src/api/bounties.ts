// src/api/bounty.ts

// 获取我的悬赏列表（mock，可替换为真实接口），需传输当前用户id
export async function getMyBounties() {
  // const res = await fetch("/api/request/my-bounties");
  // return res.json();
  return [
    { id: 1, title: "悬赏A", amount: 50, status: "进行中" },
    { id: 2, title: "悬赏B", amount: 100, status: "已完成" },
    { id: 3, title: "悬赏C", amount: 100, status: "待确认" },
  ];
}
export async function appendBounty(id: number, amount: number) {
  return fetch(`/api/request/${id}/append`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount }),
  });
}

export async function cancelBounty(id: number) {
  return fetch(`/api/request/${id}/cancel`, { method: "POST" });
}

export async function confirmBounty(id: number) {
  return fetch(`/api/request/${id}/confirm`, { method: "POST" });
}

export async function arbitrateBounty(id: number, reason: string) {
  return fetch(`/api/request/${id}/arbitrate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reason }),
  });
}

export async function publishBounty(title: string, bounty: number, description: string) {
  return fetch(`/api/request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, bounty, description, attachments: [] }),
  });
}


