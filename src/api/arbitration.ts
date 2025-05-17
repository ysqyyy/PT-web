// 获取仲裁列表
export async function getArbitrationBounties() {
  const res = await fetch("/api/request/bounty/arbitration", {
    credentials: "include",
  });
  return res.json();
}

// 驳回仲裁
export async function rejectArbitration(id: number) {
  const res = await fetch(`/api/request/bounty/${id}/reject-arbitration`, {
    method: "POST",
    credentials: "include",
  });
  return res.json();
}

// 同意仲裁
export async function approveArbitration(id: number) {
  const res = await fetch(`/api/request/bounty/${id}/approve-arbitration`, {
    method: "POST",
    credentials: "include",
  });
  return res.json();
}

