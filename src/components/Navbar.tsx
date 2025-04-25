'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  { name: '个人中心', path: '/home/user' },
];

export default function Navbar({ children, name }: NavbarProps) {
  const pathname = usePathname();

  return (
    <div>
    <nav className="bg-white shadow-md px-6 py-4 flex gap-6">
      {navItems.map(item => (
        <Link
          key={item.path}
          href={item.path}
          className={clsx(
            'font-medium hover:text-blue-600 transition-colors',
            pathname === item.path ? 'text-blue-600' : 'text-gray-700'
          )}
        >
          {item.name}
        </Link>
      ))}
      <h1 className="text-2xl -bold">{name}</h1>
    </nav>
    <main className="p-6">{children}</main>
</div>
  );
}
