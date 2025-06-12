'use client';

import Link from 'next/link';
import clsx from 'clsx';
import React, { ReactNode, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logout } from '@/api/login';
import type { UserInfo } from '@/types/user';
type NavbarProps = {
  children: ReactNode;
  name: string;
};
const navItems = [
  { name: '种子中心', path: '/home/seed' },
  { name: '资源悬赏', path: '/home/bounty' },
  { name: '兑换中心', path: '/home/exchange' },
  { name: '个人中心', path: '/home/user' },
];

export default function Navbar({ children, name }: NavbarProps) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  // 获取用户信息
  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      try {
        const parsedUserInfo = JSON.parse(storedUserInfo);
        setUserInfo(parsedUserInfo);
      } catch (error) {
        console.error('解析用户信息失败:', error);
      }
    }
  }, []);

  // 处理登出
  const handleLogout = async () => {
    try {
      await logout();
      setUserInfo(null);
      setShowDropdown(false);
      router.push('/login');
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  return (
    <div>
      <nav className="bg-teal-800 shadow-md px-6 py-4 flex justify-between rounded">
        <div className="flex gap-6">
          {navItems.map(item => (
            <Link
              key={item.path}
              href={item.path}
              className={clsx(
                'font-medium transition-colors px-3 py-1 rounded',
                name == item.name
                  ? 'text-white bg-teal-700 shadow'
                  : 'text-white/80 hover:text-white hover:bg-teal-900 hover:shadow-md'
              )}
            >{item.name}</Link>
          ))}
        </div>

        {/* 用户头像和用户名 */}
        {userInfo && (
          <div className="relative">
            <div 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <span className="text-white">{userInfo.user_name}</span>
              <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white overflow-hidden">
                {userInfo.avatar_url ? (
                  <img 
                    src={userInfo.avatar_url} 
                    alt={userInfo.user_name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.textContent = userInfo.user_name.charAt(0).toUpperCase();
                    }}
                  />
                ) : (
                  <span>{userInfo.user_name.charAt(0).toUpperCase()}</span>
                )}
              </div>
            </div>

            {/* 下拉菜单 */}
            {showDropdown && (
              <>
                {/* 透明遮罩，点击关闭下拉菜单 */}
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowDropdown(false)}
                />
                
                {/* 下拉菜单内容 */}
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                  <div className="py-1">
                    <Link
                      href="/home/user/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      个人资料
                    </Link>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={handleLogout}
                    >
                      退出登录
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </nav>
      <main className="p-3">{children}</main>
    </div>
  );
}
