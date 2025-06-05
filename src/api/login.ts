import request from '../utils/request';

//登录
export async function login(username: string, password: string) {
  return request.post("/api/request/login", { username, password });
}

//注册
export async function register({ email, password, invite, captcha }: { email: string, password: string, invite?: string, captcha?: string }) {
  return request.post("/api/request/register", { email, password, invite, captcha });
}

//重置密码
export async function resetPassword({ email, captcha, password }: { email: string, captcha: string, password: string }) {
  return request.post("/api/request/reset-password", { email, captcha, password });
}

//获取验证码（注册+重置）
export async function handleGetCode1(email: string) {
  return request.post("/api/request/send-captcha", { email });
}