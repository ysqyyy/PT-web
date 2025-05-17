export async function login(username: string, password: string) {
  // 这里用mock接口，实际可替换为真实后端接口
  const res = await fetch("/api/request/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    credentials: 'include',
  });
  return res.json();
}

export async function register({ email, password, invite, captcha }: { email: string, password: string, invite?: string, captcha?: string }) {
  const res = await fetch("/api/request/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, invite, captcha }),
    credentials: 'include',
  });
  return res.json();
}

export async function handleGetCode1(email: string) {
  const res = await fetch("/api/request/send-captcha", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
    credentials: 'include',
  });
  return res.json();
}

export async function resetPassword({ email, captcha, password }: { email: string, captcha: string, password: string }) {
  const res = await fetch("/api/request/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, captcha, password }),
    credentials: 'include',
  });
  return res.json();
}
