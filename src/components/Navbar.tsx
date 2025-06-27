'use client';

import Link from 'next/link';
import clsx from 'clsx';
import React, { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from '@/hooks/useAuth';
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
  const [showDropdown, setShowDropdown] = useState(false);  const router = useRouter();
  const { logout, user } = useAuth();
  
  // 使用 useAuth 钩子中的 user 信息，不再需要从 localStorage 手动获取

  // 处理登出
  const handleLogout = async () => {
    try {
      await logout();
      setShowDropdown(false);
      setShowDropdown(false);
      router.push('/login');
    } catch (error) {
      console.error('登出失败:', error);
    }
  };  return (
    <div>
      <nav className="bg-gradient-to-r from-[#5E8B7E] to-[#4F7A6F] shadow-lg px-6 py-4 flex justify-between rounded-lg mb-2">
        <div className="flex gap-4">
          {navItems.map(item => (
            <Link
              key={item.path}
              href={item.path}
              className={clsx(
                'font-medium transition-all duration-300 px-4 py-2 rounded-lg flex items-center',
                name === item.name
                  ? 'text-white bg-white/15 backdrop-blur-sm shadow-md'
                  : 'text-white/90 hover:text-white hover:bg-white/10 hover:shadow-md hover:translate-y-[-2px]'
              )}
            >
              {name === item.name && (
                <div className="h-4 w-1 bg-[#FFD700] rounded-full mr-2"></div>
              )}
              {item.name}
            </Link>
          ))}
        </div>        {/* 用户头像和用户名 */}
        {user && (
          <div className="relative">
            <div 
              className="flex items-center gap-3 cursor-pointer bg-white/15 px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-300" 
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <span className="text-white font-medium">{user.user_name}</span>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white overflow-hidden border-2 border-white/30 shadow-md">
                {user.avatar_url ? (
                  <img 
                    src={user.avatar_url} 
                    alt={user.user_name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.textContent = user.user_name.charAt(0).toUpperCase();
                    }}
                  />
                ) : (
                  <span>{user.user_name.charAt(0).toUpperCase()}</span>
                )}
              </div>
            </div>            {/* 下拉菜单 */}
            {showDropdown && (
              <>
                {/* 透明遮罩，点击关闭下拉菜单 */}
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowDropdown(false)}
                />
                
                {/* 下拉菜单内容 */}
                <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black/5 z-20 overflow-hidden">
                  <div className="py-1">
                    <div className="px-4 py-3 bg-gradient-to-r from-[#5E8B7E]/10 to-[#4F7A6F]/10 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-700">{user.user_name}</p>
                      <p className="text-xs text-gray-500 mt-1">用户等级: {user.user_level || 1}</p>
                    </div>
                    <Link
                      href="/home/user/profile"
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-[#5E8B7E]/10 transition-colors flex items-center gap-2"
                      onClick={() => setShowDropdown(false)}
                    >
                      <svg className="w-4 h-4 text-[#5E8B7E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      个人资料
                    </Link>
                    <button
                      className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                      onClick={handleLogout}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                      </svg>
                      退出登录
                    </button>
                  </div>
                </div>
              </>
            )}          </div>
        )}
      </nav>
      <main className="p-4 bg-[#F6F9F8] rounded-lg">{children}</main>
    </div>
  );
}
