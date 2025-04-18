// app/login/register/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

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

  const handleGetCode = () => {
    if (countdown > 0) return;

    // 模拟请求验证码 API
    console.log("正在请求验证码...");

    // 启动倒计时（例如60秒）
    setCountdown(60);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <Image
          src="/RadioKing.png"
          alt="Logo"
          width={300}
          height={300}
          priority // 可选，提升加载优先级（首页 logo 推荐加）
          className="mx-auto"
        />

        <form className="space-y-4">
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
