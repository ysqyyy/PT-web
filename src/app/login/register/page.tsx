// app/login/register/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { register, handleGetCode1 } from "@/api/login";
import { useRouter } from "next/navigation";
import { useDebounceFn } from "@/hooks/useDebounceFn";

export default function RegisterPage() {
  const [method, setMethod] = useState<"invite" | "email">("email");
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!agree) {
      toast.error("请先勾选同意协议");
      return;
    }

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const invite = formData.get("invite") as string | undefined;
    const captcha = formData.get("captcha") as string | undefined;

    try {
      setLoading(true);
      const data = await register({ email, password, invite, captcha });
      if (data.success) {
        toast.success("注册成功");
        router.push("/login");
      } else {
        toast.error(data.message || "注册失败");
      }
    } catch {
      toast.error("请求出错");
    } finally {
      setLoading(false);
    }
  };
  // 提交注册（防抖）
  const debouncedHandleSubmit = useDebounceFn((e:unknown)=>{handleSubmit(e as React.FormEvent)}, 800);

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
    // 获取邮箱输入框的值
    const emailInput = document.querySelector(
      'input[name="email"]'
    ) as HTMLInputElement;
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

        <div className="flex items-center justify-center gap-2 mb-4">
          <label className="flex mr-10 gap-2">
            <input
              type="radio"
              name="registerMethod"
              value="email"
              checked={method === "email"}
              onChange={() => setMethod("email")}
              className="accent-teal-600"
            />
            邮箱注册
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="registerMethod"
              value="invite"
              checked={method === "invite"}
              onChange={() => setMethod("invite")}
              className="accent-teal-600"
            />
            邀请码注册
          </label>
        </div>

        <form onSubmit={debouncedHandleSubmit} className="space-y-4">
          {method === "invite" && (
            <>
              <input
                type="text"
                name="email"
                placeholder="请输入邮箱"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                name="invite"
                placeholder="请输入邀请码"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <div className="flex">
                <input
                  type="captcha"
                  name="captcha"
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
                  name="password"
                  placeholder="请输入密码"
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
          )}

          {method === "email" && (
            <>
              <input
                type="email"
                name="email"
                placeholder="请输入邮箱"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <div className="flex">
                <input
                  type="captcha"
                  name="captcha"
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
                  name="password"
                  placeholder="请输入密码"
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
          )}
          <label className="flex items-center space-x-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={agree}
              onChange={() => setAgree(!agree)}
              className="accent-teal-600 w-4 h-4"
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
            disabled={!agree || loading}
            className={`w-full py-2 rounded text-white font-semibold transition ${
              agree && !loading
                ? "bg-teal-600 hover:bg-teal-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            注册
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          已有账号？{" "}
          <a href="/login" className="text-teal-600 hover:underline">
            立即登录
          </a>
        </p>
      </div>
    </div>
  );
}
