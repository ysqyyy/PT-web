"use client";

import { useState, useEffect } from "react";
import type { BountyListItem } from "@/types/bounty";
import { getBountyList } from "@/api/bounties";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import AppendBountyButton from "@/components/bounty/AppendBountyButton";
import SubmitSeedButton from "@/components/bounty/SubmitSeedButton";
import { Coins, User, FileText, RefreshCw } from "lucide-react";

export default function BountyPage() {
  const [bounties, setBounties] = useState<BountyListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBounties();
  }, []);

  const fetchBounties = async () => {
    setLoading(true);
    try {
      const data = await getBountyList();
      setBounties(data);
    } catch (error) {
      console.error("获取悬赏列表失败", error);
    } finally {
      setLoading(false);
    }
  };

  // 获取状态标签的样式
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // 获取状态的中文名称
  const getStatusName = (status: string) => {
    switch (status) {
      case "pending":
        return "进行中";
      case "completed":
        return "已完成";
      case "cancelled":
        return "已取消";
      default:
        return status;
    }
  };

  return (
    <div>
      <Navbar name="资源悬赏">
        <Toaster />
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">资源悬赏</h1>
          <button
            onClick={fetchBounties}
            className="flex items-center gap-1 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md transition-colors"
          >
            <RefreshCw size={16} />
            <span>刷新列表</span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : bounties.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <p className="text-gray-500 text-lg">暂无悬赏资源</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {bounties.map((item) => (
              <div
                key={item.bountyId}
                className="bg-white rounded-xl shadow overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-5">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold mb-2">
                        {item.name}
                      </h2>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                            item.status|| "pending"
                          )}`}
                        >
                          {getStatusName(item.status|| "pending")}
                        </span>
                        <span className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">
                          <Coins size={14} />
                          {item.total_amount}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-2 mt-3">
                        <div className="flex items-center gap-2 text-gray-600">
                          <User size={16} />
                          <span>发布人：{item.publisher}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FileText size={16} />
                          <span className="line-clamp-2">
                            描述：{item.description}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {item.status === "pending" && (
                      <div className="flex flex-col gap-2 md:ml-4 mt-4 md:mt-0">
                        <SubmitSeedButton
                          bountyId={item.bountyId || 0}
                          onSuccess={() => fetchBounties()}
                        />
                        <AppendBountyButton
                          bountyId={item.bountyId || 0}
                          onSuccess={() => fetchBounties()}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Navbar>
    </div>
  );
}
