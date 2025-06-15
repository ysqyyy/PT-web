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
    const response = await request.post<LoginResponse>("http://localhost:8080/api/user/login", { userName, password });      window.confirm(`磁力链接: ${url}`);
    // window.confirm("您的账号已被封禁，请联系管理员");

    // 检查用户状态是否为banned
    if (response && response.data.user_info && response.data.user_info.user_status === "banned") {
      return {
        code: 403,
        message: "您的账号已被封禁，请联系管理员",
        data: null
      };
    }
    
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

//注册  ok
export async function register({ userName, password, email, inviteCode }: { 
  userName: string, 
  password: string, 
  email: string, 
  inviteCode?: string 
}) {
  try {
    const response = await request.post<{
      code: number;
      message: string;
      data?: {
        user_id: number;
      };
    }>("http://localhost:8080/api/user/register", { 
      userName, 
      password, 
      email, 
      inviteCode 
    });
    
    return response;
  } catch (error: any) {
    console.error("注册失败:", error);
    return {
      code: 500,
      message: error?.message || "注册失败，请稍后重试",
      data: null
    };
  }
}

//重置密码
export async function resetPassword({ email, captcha, password }: { email: string, captcha: string, password: string }) {
  return request.post("/api/request/reset-password", { email, captcha, password });
}

// //获取验证码（注册+重置）
// export async function handleGetCode1(email: string) {
//   return request.post("/api/request/send-captcha", { email });
// }