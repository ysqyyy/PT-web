// components/ProtectedRoute.tsx
"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredLevel: number;
}

export default function ProtectedRoute({ children, requiredLevel }: ProtectedRouteProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查用户权限
    checkUserPermission();
  }, []);

  const checkUserPermission = () => {
    // 默认未授权
    let isAuthorized = false;
    
    try {
      // 获取用户信息
      if (typeof window !== 'undefined') {
        const userInfoStr = localStorage.getItem('userInfo');
        
        if (userInfoStr) {
          const userInfo = JSON.parse(userInfoStr);
          const userLevel = userInfo.level ? parseInt(userInfo.level) : 1;
          
          // 判断用户等级是否满足要求
          isAuthorized = userLevel >= requiredLevel;
        }
      }
    } catch (error) {
      console.error("解析用户信息失败:", error);
    }
    
    setAuthorized(isAuthorized);
    setLoading(false);
    
    // 如果未授权，重定向到上一页
    if (!isAuthorized) {
      // 显示提示信息
      if (typeof window !== 'undefined') {
        alert("您没有权限访问此页面");
        // 尝试返回上一页，如果没有上一页，则返回首页
        if (window.history.length > 1) {
          router.back();
        } else {
          router.push("/home");
        }
      }
    }
  };

  // 加载状态时显示加载中
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  // 已授权则显示子组件
  return authorized ? <>{children}</> : null;
}
