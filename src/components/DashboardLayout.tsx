// components/DashboardLayout.tsx
import React, { ReactNode } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  BarChart,
  Users,
  CheckCircle,
  Medal,
  FileText,
} from "lucide-react";

type DashboardLayoutProps = {
  children: ReactNode;
  title: string;
};

const navItems = [
  { label: "我的资料", icon: <FileText />, path: "/user/profile" },
  { label: "我的下载", icon: <LayoutDashboard />, path: "/user/downloads" },
  { label: "数据分析", icon: <BarChart />, path: "/user/analytics" },
  { label: "用户管理", icon: <Users />, path: "/user/users" },
  { label: "资源审核", icon: <CheckCircle />, path: "/user/review" },
  { label: "我的悬赏", icon: <Medal />, path: "/user/bounties" },
];

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-50 bg-teal-800 text-white rounded-3xl border-r p-4">
        <h2 className="text-xl font-semibold mb-15">个人中心</h2>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 hover:text-yellow-600 transition"
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
        <header className="bg-neutral-600 text-white rounded-xl p-4 border-b flex items-center justify-between">
          <h1 className="text-2xl font-bold">{title}</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white-600">欢迎回来，{}</span>
            <img
              src="/avatar.png"
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
        </header>

        {/* Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
