import request from '../utils/request';
import auth from '../utils/auth';
import { UserInfo } from '@/types/user';

interface LoginResponse {
  code: number;
  message: string;
  data: {
    access_token: string;
    refresh_token: string;
    user_info: UserInfo;
  };
}

//登录 ok
export async function login(userName: string, password: string) {
  try {
    const response = await request.post<LoginResponse>("http://localhost:8080/api/user/login", { userName, password });
    if (response && response.data.access_token) {
      // 保存token
      auth.setToken(response.data.access_token, 7);
      
      // 保存用户信息到localStorage
      if (response.data.user_info) {
        localStorage.setItem('userInfo', JSON.stringify(response.data.user_info));
      }
    }
    // console.log("token:", auth.getToken());
    return response;
  } catch (error) {
    console.error("登录失败:", error);
    throw error;
  }
}

//登出 ok
export async function logout() {
  try {
    // 调用登出接口
    // await request.post("http://localhost:8080/api/user/logout");
    // 清除本地token和用户信息
    auth.removeToken();
    localStorage.removeItem('userInfo');
    return { success: true };
  } catch (error) {
    console.error("登出请求失败:", error);
    // 即使接口失败，也清除本地token和用户信息
    auth.removeToken();
    localStorage.removeItem('userInfo');
    return { success: true };
  }
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