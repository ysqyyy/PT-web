// hooks/useAuth.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/apinew/authApi"; // 导入你提供的 API 层
import auth from "@/utils/auth";
import { UserInfo } from "@/types/user";
import eventBus from "@/utils/eventBus";
/**
 * 用户认证相关的 hook，包含登录、登出、注册等功能
 */
export function useAuth() {
  const queryClient = useQueryClient();

  // 获取当前用户信息的查询
  const userInfoQuery = useQuery({
    queryKey: ["userInfo"],
    queryFn: () => {
      const storedUserInfo = localStorage.getItem("userInfo");
      if (!storedUserInfo) return null;

      try {
        return JSON.parse(storedUserInfo) as UserInfo;
      } catch (error) {
        console.error("解析用户信息失败:", error);
        return null;
      }
    },
    // 用户信息不会自动更新，只有通过登录或明确的刷新操作才会更新
    staleTime: Infinity,
  });

  // 判断用户是否已登录
  const isLoggedIn = !!auth.getToken() && !!userInfoQuery.data;

  // 登录 mutation
  const loginMutation = useMutation({
    mutationFn: async ({
      userName,
      password,
      rememberMe = true,
    }: {
      userName: string;
      password: string;
      rememberMe?: boolean;
    }) => {
      // 记录登录开始时间（用于性能分析）
      const loginStartTime = performance.now();
      const res = authApi.login(userName, password);
      const timeoutId = setTimeout(() => res.cancel(), 15000);
      try {
        const response = await res.promise;
        // 清除超时定时器
        clearTimeout(timeoutId);

        // 记录登录结束时间
        const loginEndTime = performance.now();
        console.log(
          `[Auth] 登录请求完成，耗时: ${loginEndTime - loginStartTime}ms`
        );

        // 检查用户状态
        if (response?.data?.user_info) {
          if (response.data.user_info.user_status === "banned") {
            console.warn(`[Auth] 用户 ${userName} 已被封禁`);
            return {
              code: 403,
              message: "您的账号已被封禁，请联系管理员",
              data: null,
            };
          }
        }

        // 保存 token 和用户信息
        if (response && response.data.access_token) {
          const tokenDuration = rememberMe ? 7 : 1;
          auth.setToken(response.data.access_token, tokenDuration);

          // 保存刷新 token (如果有)
          if (response.data.refresh_token) {
            auth.setRefreshToken(
              response.data.refresh_token,
              tokenDuration + 30
            );
          }

          // 保存用户信息到 localStorage
          if (response.data.user_info) {
            localStorage.setItem(
              "userInfo",
              JSON.stringify(response.data.user_info)
            );

            // 更新 userInfo 查询缓存
            queryClient.setQueryData(["userInfo"], response.data.user_info);
          }

          // 设置自动刷新 token 的定时器
          setupTokenRefresh(1800); // 默认30分钟刷新一次
        }

        return response;
      } catch (error: any) {
        // 清除超时定时器
        clearTimeout(timeoutId);

        // 记录详细错误
        console.error(`[Auth] 登录失败: ${userName}`, error);

        // 错误分类处理
        if (error.name === "AbortError") {
          console.warn("[Auth] 登录请求超时");
          throw new Error("登录请求超时，请检查网络连接");
        }

        // 登录失败次数跟踪
        const failedAttempts =
          parseInt(localStorage.getItem(`failedLogins_${userName}`) || "0") + 1;
        localStorage.setItem(
          `failedLogins_${userName}`,
          failedAttempts.toString()
        );

        // 处理特定状态码
        if (error.response) {
          switch (error.response.status) {
            case 429:
              throw new Error("登录尝试次数过多，请稍后再试");
            case 401:
              throw new Error("用户名或密码错误");
            case 403:
              throw new Error("账号已被锁定，请联系管理员");
            default:
              throw new Error(
                `登录失败: ${error.response.data?.message || "服务器错误"}`
              );
          }
        }
        throw error;
      }
    },

    // 重试配置 ok
    retry: (failureCount, error: any) => {
      // 对于网络错误进行重试，但对于认证错误不重试
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        return false; // 不重试认证错误
      }
      return failureCount < 2; // 最多重试2次其他错误
    },

    // 成功回调
    onSuccess: (response, variables) => {
      console.log(`[Auth] 用户 ${variables.userName} 登录成功`);

      // 清除失败计数
      localStorage.removeItem(`failedLogins_${variables.userName}`);

      // 设置上次登录信息
      const lastLogin = {
        time: new Date().toISOString(),
        username: variables.userName,
      };
      localStorage.setItem("lastSuccessfulLogin", JSON.stringify(lastLogin));

      // 通知其他系统组件登录成功
      eventBus.emit("user:loggedIn", response.data.user_info);

      // 更新在线状态
      updateOnlineStatus(true);
    },

    // 错误回调
    onError: (error, variables) => {
      console.error(`[Auth] 用户 ${variables.userName} 登录失败:`, error);

      // 增加延迟防止暴力破解
      const failedAttempts = parseInt(
        localStorage.getItem(`failedLogins_${variables.userName}`) || "0"
      );
      if (failedAttempts > 3) {
        // 延迟增加，防止暴力破解
        const delayTime = Math.min(failedAttempts * 1000, 10000); // 最多延迟10秒
        console.warn(`[Auth] 登录失败次数过多，增加延迟: ${delayTime}ms`);
      }
    },
  });

  // 辅助函数 - 设置Token自动刷新
  function setupTokenRefresh(expiresIn: number) {
    // 清除现有的刷新定时器
    if (window.tokenRefreshTimer) {
      clearTimeout(window.tokenRefreshTimer);
    }

    // 在token过期前5分钟刷新
    const refreshTime = (expiresIn - 300) * 1000;
    if (refreshTime <= 0) return; // 如果已经过期或即将过期，则不设置定时器

    console.log(
      `[Auth] 设置token自动刷新定时器，将在${refreshTime / 1000}秒后刷新`
    );

    window.tokenRefreshTimer = setTimeout(async () => {
      try {
        const refreshToken = auth.getRefreshToken();
        if (!refreshToken) {
          console.warn("[Auth] 没有刷新令牌，无法自动刷新");
          return;
        }

        console.log("[Auth] 自动刷新token开始");
        const response = await authApi.refreshToken(refreshToken).promise;

        if (response && response.data.access_token) {
          auth.setToken(response.data.access_token, 7);
          if (response.data.refresh_token) {
            auth.setRefreshToken(response.data.refresh_token, 37);
          }
          console.log("[Auth] Token自动刷新成功");
          // 重新设置下一次刷新
          setupTokenRefresh(3600);
        }
      } catch (error) {
        console.error("[Auth] Token自动刷新失败", error);
        eventBus.emit("auth:refreshFailed");
      }
    }, refreshTime);
  }

  // 辅助函数 - 更新在线状态 todo
  function updateOnlineStatus(isOnline: boolean) {
    // 这里可以实现与在线状态服务的交互
    // 例如向服务器发送心跳包或更新在线状态
    console.log(`[Auth] 用户在线状态更新: ${isOnline ? "在线" : "离线"}`);
  }
  // 登出 mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      try {
        // 调用登出接口（可选）
        await authApi.logout().promise;
      } catch (error) {
        console.error("登出请求失败:", error);
        // 失败时继续执行清理操作
      } finally {
        // 无论接口是否成功，都清除本地存储
        auth.removeToken();
        localStorage.removeItem("userInfo");
        // 清除查询缓存
        queryClient.setQueryData(["userInfo"], null);
        // 可以选择性地使其他可能的用户相关查询失效
        queryClient.invalidateQueries({ queryKey: ["userSettings"] });
        return { success: true };
      }
    },
  });

  // 注册 mutation
  const registerMutation = useMutation({
    mutationFn: async (data: {
      userName: string;
      password: string;
      email: string;
      inviteCode?: string;
    }) => {
      const response = await authApi.register(data).promise;
      return response;
    },
    onError: (error: any) => {
      console.error("注册失败:", error);
      return {
        code: 500,
        message: error?.message || "注册失败，请稍后重试",
        data: null,
      };
    },
  });

  // 重置密码 mutation
  const resetPasswordMutation = useMutation({
    mutationFn: async (data: {
      email: string;
      captcha: string;
      password: string;
    }) => {
      const response = await authApi.resetPassword(data).promise;
      return response;
    },
  });

  // 获取验证码 mutation
  const getCaptchaMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await authApi.getCaptcha(email).promise;
      return response;
    },
  });

  // 刷新用户信息
  const refreshUserInfo = async () => {
    // 这里可以添加获取最新用户信息的 API 调用
    // 然后更新缓存
    // 示例：
    // const userInfo = await fetchUserInfo();
    // queryClient.setQueryData(['userInfo'], userInfo);

    // 或者只是使查询失效，强制重新获取
    queryClient.invalidateQueries({ queryKey: ["userInfo"] });
  };

  return {
    // 查询结果
    user: userInfoQuery.data,
    isLoading: userInfoQuery.isLoading,
    isLoggedIn,

    // 操作方法
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    resetPassword: resetPasswordMutation.mutateAsync,
    getCaptcha: getCaptchaMutation.mutateAsync,
    refreshUserInfo,

    // 状态
    loginLoading: loginMutation.isPending,
    logoutLoading: logoutMutation.isPending,
    registerLoading: registerMutation.isPending,
    resetPasswordLoading: resetPasswordMutation.isPending,
    getCaptchaLoading: getCaptchaMutation.isPending,
  };
}

/**
 * 用于保护需要认证的路由的 hook
 */
export function useAuthGuard() {
  const { isLoggedIn, user } = useAuth();

  return {
    isLoggedIn,
    user,
    // 可以添加更多权限检查，例如：
    isAdmin: user?.role === "admin",
    canAccess: (requiredRole: string) => {
      if (!isLoggedIn) return false;
      if (!requiredRole) return true;
      // 实现更复杂的权限检查逻辑
      return user?.role === requiredRole;
    },
  };
}
