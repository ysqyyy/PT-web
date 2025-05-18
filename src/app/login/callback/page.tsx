// app/login/register/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { handleGetCode1, resetPassword } from "@/api/login";
import { useEventDebounce } from "@/hooks/useEventDebounce";

export default function CallBackPage() {
  const [showPassword, setShowPassword] = useState(false);

  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleGetCode = async () => {
    if (countdown > 0) return;
    const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
    const email = emailInput?.value;
    if (!email) {
      toast.error("请输入邮箱");
      return;
    }
    try {
      const res = await handleGetCode1(email);
      if (res.success) {
        toast.success("验证码已发送");
        setCountdown(60);
      } else {
        toast.error(res.message || "发送失败");
      }
    } catch {
      toast.error("请求出错");
    }
  };

  // 表单提交：重置密码
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = (form.querySelector('input[type="email"]') as HTMLInputElement)?.value;
    const captcha = (form.querySelector('input[type="captcha"]') as HTMLInputElement)?.value;
    const password = (form.querySelector('input[type="password"],input[type="text"][placeholder="设置新的密码"]') as HTMLInputElement)?.value;
    if (!email || !email.includes("@") || !email.includes(".") || email.length < 5
      || email.length > 50 || !captcha || !password) {
      toast.error("请检查你的输入");
      return;
    }
    if (password.length < 6 || password.length > 20) {
      toast.error("密码长度应在6-20个字符之间");
      return;
    }
    try {
      const data = await resetPassword({ email, captcha, password });
      if (data.success) {
        toast.success("密码重置成功，请重新登录");
      } else {
        toast.error(data.message || "重置失败");
      }
    } catch {
      toast.error("请求出错");
    }
  };

  // 表单提交：重置密码（防抖）
  const debouncedHandleSubmit = useEventDebounce(handleSubmit, 800);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <Toaster />
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <Image
          src="/RadioKing.png"
          alt="Logo"
          width={300}
          height={300}
          priority // 可选，提升加载优先级（首页 logo 推荐加）
          className="mx-auto"
        />

        <form className="space-y-4" onSubmit={debouncedHandleSubmit}>
          <>
            <input
              type="email"
              placeholder="请输入邮箱"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex">
              <input
                type="captcha"
                placeholder="请输入验证码"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="button"
                onClick={handleGetCode}
                disabled={countdown > 0}
                className={`w-full sm:w-auto px-4 py-2 rounded text-xs font-semibold text-white transition whitespace-nowrap ${
                  countdown > 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-teal-600 hover:bg-teal-700"
                }`}
              >
                {countdown > 0 ? `重新发送 (${countdown}s)` : "获取验证码"}
              </button>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="设置新的密码"
                className="w-full border border-gray-300 rounded px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
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

          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 transition-colors"
          >
            确定
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          记起密码？{" "}
          <a href="/login" className="text-teal-600 hover:underline">
            立即登录
          </a>
        </p>
      </div>
    </div>
  );
}
