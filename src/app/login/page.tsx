"use client";

import { useState } from "react";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/user";
import { useEventDebounce } from "@/hooks/useEventDebounce";
import { useAuth } from "@/hooks/useAuth"; // 1. 引入 useAuth

export default function LoginPage() {
  const [username, setUsername] = useState("hua");
  const [password, setPassword] = useState("123456789");
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  const { login, loginLoading } = useAuth(); // 2. 拿到 login 和 loginLoading

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginLoading) return;
    try {
      const res = await login({ userName: username, password });
      if (res?.code === 200) {
        // 假设后端返回了 role 字段
        setUser({ username, role: res.data?.user_info?.role || "user" });
        toast.success("登录成功");
        router.push("/home");
      } else {
        toast.error(res?.message || "登录失败");
      }
    } catch (err: any) {
      toast.error(err?.message || "请求出错");
    }
  };

  // 提交登录（防抖）
  const debouncedHandleSubmit = useEventDebounce(
    (e: React.FormEvent<HTMLFormElement>) => {
      handleSubmit(e);
    },
    800
  );

  return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <Toaster />
        <form
          onSubmit={debouncedHandleSubmit}
          className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-8 w-full max-w-md space-y-6"
        >
          <Image
            src="/RadioKing.webp"
            alt="Logo"
            width={300}
            height={300}
            priority
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
            className="w-full bg-teal-600 cursor-pointer text-white py-2 rounded-md hover:bg-teal-700 transition-colors"
            disabled={loginLoading}
          >
            {loginLoading ? "登录中..." : "登录"}
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
