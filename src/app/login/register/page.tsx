// app/login/register/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useEventDebounce } from "@/hooks/useEventDebounce";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterPage() {
  // const [method, setMethod] = useState<"invite" | "email">("invite");
  const method = "invite"; // 默认使用邀请码注册
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const router = useRouter();
  const { register, registerLoading } = useAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerLoading) return;
    if (!agree) {
      toast.error("请先勾选同意协议");
      return;
    }
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const userName = formData.get("userName") as string;
    const inviteCode =
      method === "invite" ? (formData.get("invite") as string) : undefined;

    // 验证必填字段
    if (!email) {
      toast.error("请输入邮箱");
      return;
    }
    if (!password) {
      toast.error("请输入密码");
      return;
    }
    if (!userName) {
      toast.error("请输入用户名");
      return;
    }
    if (method === "invite" && !inviteCode) {
      toast.error("请输入邀请码");
      return;
    }
    await register({
      email,
      password,
      userName,
      inviteCode,
    });
    router.push("/login");
  };
  // 提交注册（防抖）
  const debouncedHandleSubmit = useEventDebounce(handleSubmit, 800);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-teal-50 p-6">
      <Toaster position="top-center" />
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-teal-600 to-teal-500 py-4 px-6 text-white">
          <h1 className="text-2xl font-bold text-center">创建新账号</h1>
        </div>

        <div className="p-8">
          <div className="flex justify-center mb-6">
            <Image
              src="/RadioKing.webp"
              alt="Logo"
              width={200}
              height={200}
              priority
              className="mx-auto"
            />
          </div>

          <form onSubmit={debouncedHandleSubmit} className="space-y-5">
            {method === "invite" && (
              <>
                <input
                  type="email"
                  name="email"
                  placeholder="请输入邮箱"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <input
                  type="text"
                  name="userName"
                  placeholder="请输入用户名"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <input
                  type="text"
                  name="invite"
                  placeholder="请输入邀请码"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="请输入密码"
                    className="w-full border border-gray-300 rounded px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? "😎" : "👁"}
                  </button>
                </div>
              </>
            )}
            {/* {method === "email" && (
            <>
              <input
                type="email"
                name="email"
                placeholder="请输入邮箱"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="text"
                name="userName"
                placeholder="请输入用户名"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="请输入密码"
                  className="w-full border border-gray-300 rounded px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? "😎" : "👁"}
                </button>
              </div>
            </>
          )} */}
            <label className="flex items-center space-x-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={agree}
                onChange={() => setAgree(!agree)}
                className="accent-teal-600 cursor-pointer w-4 h-4"
              />
              <span>
                我已同意
                <a
                  href="/user-agreement"
                  className="text-teal-600 hover:underline px-1"
                >
                  用户协议
                </a>
                和
                <a
                  href="/privacy-policy"
                  className="text-teal-600 hover:underline px-1"
                >
                  隐私政策
                </a>
              </span>
            </label>
            <button
              type="submit"
              disabled={!agree || registerLoading}
              className={`w-full py-2 rounded text-white cursor-pointer font-semibold transition ${
                agree && !registerLoading
                  ? "bg-teal-600 hover:bg-teal-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {registerLoading ? "注册中..." : "注册"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-500">
            已有账号？
            <a href="/login" className="text-teal-600 hover:underline">
              立即登录
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
