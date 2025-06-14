// components/DashboardLayout.tsx
import React, { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  BarChart,
  Users,
  CheckCircle,
  Medal,
  FileText,
  MessageCircle, // 新增
} from "lucide-react";
import clsx from "clsx";

type DashboardLayoutProps = {
  children: ReactNode;
  title: string;
};

// 定义菜单项及其所需的最低等级
const allNavItems = [
  { label: "我的资料", icon: <FileText />, path: "/home/user/profile", minLevel: 1 },
  { label: "我的下载", icon: <LayoutDashboard />, path: "/home/user/downloads", minLevel: 1 },
  { label: "我的悬赏", icon: <Medal />, path: "/home/user/bounties", minLevel: 1 },
  { label: "私信", icon: <MessageCircle />, path: "/home/user/message", minLevel: 1 },
  { label: "资源审核", icon: <CheckCircle />, path: "/home/user/review", minLevel: 4 },
  { label: "仲裁管理", icon: <CheckCircle />, path: "/home/user/arbitration", minLevel: 5 },
  { label: "举报管理", icon: <Users />, path: "/home/user/users", minLevel: 6 },
  { label: "数据分析", icon: <BarChart />, path: "/home/user/analytics", minLevel: 7 },

];

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const [userLevel, setUserLevel] = useState(1); // 默认为等级1
  const [navItems, setNavItems] = useState(allNavItems.filter(item => item.minLevel <= 1));

  useEffect(() => {
    // 从localStorage获取用户信息
    if (typeof window !== 'undefined') {
      const userInfoStr = localStorage.getItem('userInfo');
      if (userInfoStr) {
        try {
          const userInfo = JSON.parse(userInfoStr);
          const level = userInfo.user_level ? parseInt(userInfo.user_level) : 1;
          console.log("用户等级:", level);
          setUserLevel(level);
          
          // 根据用户等级过滤菜单项
          const filteredItems = allNavItems.filter(item => item.minLevel <= level);
          setNavItems(filteredItems);
        } catch (error) {
          console.error("解析用户信息失败:", error);
        }
      }
    }
  }, []);  return (
    <div className="flex min-h-screen bg-[#F6F9F8]">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-[#5E8B7E] to-[#4F7A6F] text-white rounded-lg shadow-lg m-2 p-4 flex flex-col">
        <div className="mb-6 mt-2 flex items-center justify-center">
          <div className="bg-white/15 backdrop-blur-sm p-2 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-[#FFD700]">BT</span>
              <span>用户中心</span>
            </h2>
          </div>
        </div>
        
        <nav className="space-y-1 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300", 
                title === item.label
                  ? "bg-white/20 text-white font-medium shadow-md"
                  : "text-white hover:bg-white/10 hover:translate-x-1"
              )}
            >
              <div className={clsx(
                "transition-all duration-300",
                title === item.label ? "text-[#FFD700]" : "text-white"
              )}>
                {item.icon}
              </div>
              <span>{item.label}</span>
              {title === item.label && (
                <div className="ml-auto h-6 w-1 bg-[#FFD700] rounded-full"></div>
              )}
            </Link>
          ))}
        </nav>
        
        <div className="mt-6 pt-4 border-t border-white/20">
          <div className="bg-white/15 rounded-lg p-3 text-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 bg-[#FFD700] rounded-full animate-pulse"></div>
              <span className="text-white">用户等级: {userLevel}</span>
            </div>
            <div className="text-xs text-white/80">
              {new Date().toLocaleDateString('zh-CN', {year: 'numeric', month: 'long', day: 'numeric'})}
            </div>
          </div>
        </div>
      </aside>      {/* Main Content */}
      <div className="flex-1 flex flex-col m-2 ml-0">
        {/* Header */}
        <header className="bg-gradient-to-r from-[#5E8B7E] to-[#4F7A6F] text-white rounded-lg shadow-md p-3 border-b border-[#E0E5E3] flex items-center justify-between">
          <h1 className="ml-4 text-xl font-bold flex items-center">
            <div className="h-8 w-1 bg-[#FFD700] rounded-full mr-3 shadow-sm"></div>
            {title}
          </h1>
          <div className="flex items-center gap-2 mr-3">
            <div className="px-3 py-1.5 bg-white/15 rounded-full text-sm font-medium backdrop-blur-sm shadow-inner">
              {new Date().toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long'
              })}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6 bg-white rounded-lg shadow-sm mt-2 flex-1">{children}</main>
      </div>
    </div>
  );
}
