'use client';

import Link from 'next/link';
import clsx from 'clsx';
import React, { ReactNode } from "react";

type NavbarProps = {
  children: ReactNode;
  name: string;
};
const navItems = [
  { name: '种子中心', path: '/home/seed' },
  { name: '资源悬赏', path: '/home/bounty' },
  { name: '兑换中心', path: '/home/exchange' },
  { name: '评论示例', path: '/home/comment-example' },
  { name: '个人中心', path: '/home/user' },
];

export default function Navbar({ children, name }: NavbarProps) {
  return (
    <div>
      <nav className="bg-teal-800 shadow-md px-6 py-4 flex gap-6 rounded">
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
      </nav>
      <main className="p-3">{children}</main>
    </div>
  );
}
