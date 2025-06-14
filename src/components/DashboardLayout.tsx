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
  { label: "数据分析", icon: <BarChart />, path: "/home/user/analytics", minLevel: 2 },
  { label: "举报管理", icon: <Users />, path: "/home/user/users", minLevel: 2 },
  { label: "资源审核", icon: <CheckCircle />, path: "/home/user/review", minLevel: 2 },
  { label: "仲裁管理", icon: <CheckCircle />, path: "/home/user/arbitration", minLevel: 2 },
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
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-50 bg-teal-800 text-white rounded border-r p-4">
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={clsx(
                "flex items-center gap-3 p-2 rounded-xl transition", 
                 title === item.label?
                 "bg-gray-50 text-yellow-600":
                 "hover:bg-gray-300 hover:text-yellow-600"
                 
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-neutral-600 text-white rounded p-2 border-b flex items-center justify-between">
          <h1 className="ml-5 text-xl font-bold">{title}</h1>
        </header>

        {/* Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
