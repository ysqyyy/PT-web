import request from "../utils/request";
import { UserInfo } from "@/types/user";

// 类型定义放在 types 文件夹中
export interface LoginResponse {
  code: number;
  message: string;
  data: {
    access_token: string;
    refresh_token: string;
    user_info: UserInfo;
  };
}

export interface RegisterResponse {
  code: number;
  message: string;
  data?: {
    user_id: number;
  };
}

export interface ResetPasswordResponse {
  code: number;
  message: string;
  data: any;
}

export interface CaptchaResponse {
  code: number;
  message: string;
  data: {
    captcha_id: string;
  };
}

// API 层只负责与服务器通信，不处理业务逻辑
export const authApi = {
  // 登录
  login: (userName: string, password: string) =>
    request.post<LoginResponse>("/api/user/login", { userName, password }),

  // 登出
  logout: () => request.post("/api/user/logout"),

  // 注册
  register: ({
    userName,
    password,
    email,
    inviteCode,
  }: {
    userName: string;
    password: string;
    email: string;
    inviteCode?: string;
  }) =>
    request.post<RegisterResponse>("/api/user/register", {
      userName,
      password,
      email,
      inviteCode,
    }),

  // 刷新令牌 无接口
  refreshToken: (refresh_token: string) =>
    request.post<LoginResponse>("/api/user/refresh-token", { refresh_token }),
};
