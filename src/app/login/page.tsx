"use client";

import { useState } from "react";
import Image from "next/image";
import { login } from "@/api/login";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/user";
import { useDebounceFn } from "@/hooks/useDebounceFn";

export default function LoginPage() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("adm123");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const res = await login(username, password);
      if (res.success) {
        // 假设后端返回了 role 字段
        setUser({ username, role: res.role || "user" });
        toast.success("登录成功");
        router.push("/home"); 
        
      } else {
        toast.error(res.message || "登录失败");
      }
    } catch (err) {
      toast.error("请求出错：" + err);
    } finally {
      setLoading(false);
    }
  };

  // 提交登录（防抖）
  const debouncedHandleSubmit = useDebounceFn( (e: unknown) => {handleSubmit(e as React.FormEvent)}, 800);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Toaster />
      <form
        onSubmit={debouncedHandleSubmit}
        className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-8 w-full max-w-md space-y-6"
      >
        <Image
          src="/RadioKing.png"
          alt="Logo"
          width={300}
          height={300}
          priority // 可选，提升加载优先级（首页 logo 推荐加）
          className="mx-auto"
        />

        <div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入用户名"
            required
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入密码"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 transition-colors"
          disabled={loading}
        >
          登录
        </button>
        <div>
          <a
            href="/login/register"
            className="text-sm text-gray-400 hover:underline"
          >
            没有账号？现在注册
          </a>
          <a
            href="/login/callback"
            className="text-sm text-gray-400 ml-30 hover:underline"
          >
            忘记密码？点击找回
          </a>
        </div>
      </form>
    </div>
  );
}
