"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import toast, { Toaster } from "react-hot-toast";

interface ValuesInfo {
  user_id: number;
  points: number;
  tickets: number;
  magic_value: number;
}

export default function ExchangePage() {
  const [info, setInfo] = useState<ValuesInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [exchangeTickets, setExchangeTickets] = useState("");
  const [exchangeTitleId, setExchangeTitleId] = useState("");

  // 查询当前用户积分/点券/魔力值
  useEffect(() => {
    fetch("/api/request/values/info", { credentials: "include" })
      .then((res) => res.json())
      .then(setInfo);
  }, []);

  // 每日签到
  const handleSignin = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/request/values/signin", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      toast.success(
        data.message +
          ` 奖励：积分+${data.reward.points} 魔力值+${data.reward.magic_value} 点券+${data.reward.tickets}`
      );
      // 刷新用户信息
      fetch("/api/request/values/info", { credentials: "include" })
        .then((res) => res.json())
        .then(setInfo);
    } catch {
      toast.error("签到失败");
    } finally {
      setLoading(false);
    }
  };

  // 点券兑换上传量
  const handleExchangeUpload = async () => {
    if (!exchangeTickets) return;
    setLoading(true);
    try {
      const res = await fetch("/api/request/values/tickets/exchange-upload", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tickets: Number(exchangeTickets) }),
      });
      const data = await res.json();
      toast.success(
        data.message +
          ` 获得上传量：${(data.added_uploaded_bytes / 1073741824).toFixed(
            2
          )}GB`
      );
      setExchangeTickets("");
      fetch("/api/request/values/info", { credentials: "include" })
        .then((res) => res.json())
        .then(setInfo);
    } catch {
      toast.error("兑换失败");
    } finally {
      setLoading(false);
    }
  };

  // 魔力值兑换勋章
  const handleExchangeTitle = async () => {
    if (!exchangeTitleId) return;
    setLoading(true);
    try {
      const res = await fetch("/api/request/magic/exchange/title", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title_id: Number(exchangeTitleId) }),
      });
      const data = await res.json();
      toast.success(data.message + ` 获得勋章ID：${data.gained.title_id}`);
      setExchangeTitleId("");
      fetch("/api/request/values/info", { credentials: "include" })
        .then((res) => res.json())
        .then(setInfo);
    } catch {
      toast.error("兑换失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Navbar name="兑换中心">
      <Toaster />
      <div className="bg-white rounded-xl shadow p-6 max-w-xl mx-auto">
        <h2 className="text-lg font-bold mb-4">我的资产</h2>
        {info ? (
          <div className="mb-6 flex gap-8 text-lg">
            <span>
              积分：<b className="text-blue-600">{info.points}</b>
            </span>
            <span>
              点券：<b className="text-teal-700">{info.tickets}</b>
            </span>
            <span>
              魔力值：<b className="text-purple-700">{info.magic_value}</b>
            </span>
          </div>
        ) : (
          <div className="text-gray-400 mb-6">加载中...</div>
        )}
        <button
          className="px-4 py-2 bg-teal-700 text-white rounded hover:bg-teal-900 mb-6"
          onClick={handleSignin}
          disabled={loading}
        >
          每日签到
        </button>

        <div className="mb-6">
          <h3 className="font-bold mb-2">点券兑换上传量</h3>
          <div className="flex gap-2">
            <input
              type="number"
              min={1}
              value={exchangeTickets}
              onChange={(e) => setExchangeTickets(e.target.value)}
              className="border p-2 rounded w-32"
              placeholder="点券数量"
            />
            <button
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-800"
              onClick={handleExchangeUpload}
              disabled={loading || !exchangeTickets}
            >
              兑换上传量
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-bold mb-2">魔力值兑换勋章</h3>
          <div className="flex gap-2">
            <input
              type="number"
              min={1}
              value={exchangeTitleId}
              onChange={(e) => setExchangeTitleId(e.target.value)}
              className="border p-2 rounded w-32"
              placeholder="勋章ID"
            />
            <button
              className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-800"
              onClick={handleExchangeTitle}
              disabled={loading || !exchangeTitleId}
            >
              兑换勋章
            </button>
          </div>
        </div>

        <div className="text-gray-500 text-sm">
          更多兑换功能（如点券兑换魔力值、积分兑换邀请码等）可按需扩展...
        </div>
      </div>
    </Navbar>
  );
}
