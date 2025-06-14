"use client";

import { useState, useEffect } from "react";
import type { BountyListItem } from "@/types/bounty";
import { getBountyList } from "@/api/bounties";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import AppendBountyButton from "@/components/bounty/AppendBountyButton";
import SubmitSeedButton from "@/components/bounty/SubmitSeedButton";
import PublishBountyButton from "@/components/bounty/PublishBountyButton";
import { Coins, User, FileText } from "lucide-react";

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

  // 获取状态的中文名称
  const getStatusName = (status: string | undefined) => {
    switch (status) {
      case "pending":
        return "进行中";
      case "approved":
        return "已批准";
      case "rejected":
        return "已拒绝";
      case "unconfirmed":
        return "未确认";
      case "under_review":
        return "审核中";
      default:
        return status || "未知";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7FAF9] to-[#EFF6F4]">
      <Navbar name="资源悬赏">
        <Toaster />
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#3D4D49] flex items-center">
            <div className="h-8 w-1.5 bg-gradient-to-b from-[#5E8B7E] to-[#4F7A6F] rounded-full mr-3 shadow-sm"></div>
            资源悬赏
          </h1>
          <div className="flex items-center gap-2">
            <PublishBountyButton onSuccess={fetchBounties} className="transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg" />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5E8B7E] shadow-md"></div>
              <p className="mt-4 text-[#5E8B7E] font-medium bg-white/50 px-4 py-1 rounded-full shadow-sm">加载中...</p>
            </div>
          </div>
        ) : bounties.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-[#E0E5E3] bg-gradient-to-br from-white to-[#F7FAF9]">
            <div className="flex flex-col items-center">
              <div className="bg-[#F1F4F3] rounded-full p-5 mb-5 shadow-md bg-gradient-to-br from-[#F1F4F3] to-[#E0E5E3]">
                <Coins size={40} className="text-[#5E8B7E]" />
              </div>
              <p className="text-[#3D4D49] text-xl font-semibold mb-2">暂无悬赏资源</p>
              <p className="text-[#6B7C79] mt-1 max-w-md">发布一个悬赏，让其他用户帮你寻找资源</p>
              <button
                onClick={() => document.querySelector<HTMLButtonElement>('[data-testid="publish-bounty-btn"]')?.click()}
                className="mt-6 px-6 py-2.5 bg-gradient-to-r from-[#5E8B7E] to-[#4F7A6F] text-white rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <Coins size={18} />
                发布悬赏
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-5">
            {bounties.map((item) => (
              <div
                key={item.bountyId}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-[#E0E5E3] hover:border-[#5E8B7E] transform hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold mb-3 text-[#3D4D49] flex items-center">
                        <div className="h-5 w-1.5 bg-gradient-to-b from-[#5E8B7E] to-[#4F7A6F] rounded-full mr-2.5 shadow-sm"></div>
                        {item.name}
                      </h2>
                      
                      <div className="flex items-center flex-wrap gap-2.5 mb-4">
                        <span
                          className={`px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center shadow-sm ${
                            item.status === "pending" 
                              ? "bg-gradient-to-r from-[#EFF6F4] to-[#E6F1ED] text-[#5E8B7E] border border-[#D5E3DE]" 
                              : item.status === "approved" 
                              ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-100" 
                              : "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border border-red-100"
                          }`}
                        >
                          <div className={`h-2 w-2 rounded-full mr-1.5 ${
                            item.status === "pending" ? "bg-[#5E8B7E]" : 
                            item.status === "approved" ? "bg-green-500" : "bg-red-500"
                          }`}></div>
                          {getStatusName(item.status)}
                        </span>
                        <span className="flex items-center gap-1.5 bg-gradient-to-r from-[#FFF8E6] to-[#FFFBF0] text-[#D4A418] px-3.5 py-1.5 rounded-full text-xs font-medium border border-[#FAECC8] shadow-sm">
                          <Coins size={14} className="text-[#FFD700]" />
                          <span>{item.total_amount}</span>
                          <span className="text-[#D4A418]/70">积分</span>
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-3 mt-4 bg-gradient-to-br from-[#F9FAF9] to-[#F3F6F5] p-4 rounded-lg border border-[#E0E5E3] shadow-sm">
                        <div className="flex items-center gap-2.5 text-[#556B66]">
                          <User size={16} className="text-[#5E8B7E]" />
                          <span className="font-medium text-[#3D4D49]">发布人：</span>
                          <span>{item.publisher}</span>
                        </div>
                        <div className="flex items-start gap-2.5 text-[#556B66]">
                          <FileText size={16} className="text-[#5E8B7E] mt-1" />
                          <div>
                            <span className="font-medium text-[#3D4D49]">描述：</span>
                            <span className="line-clamp-2">{item.description}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {item.status === "pending" && (
                      <div className="flex flex-col gap-3 md:ml-6 mt-5 md:mt-0">
                        <SubmitSeedButton
                          bountyId={item.bountyId || 0}
                          onSuccess={() => fetchBounties()}
                          bgColor="bg-gradient-to-r from-[#5E8B7E] to-[#4F7A6F]"
                          hoverColor="hover:from-[#4F7A6F] hover:to-[#3D685F]"
                        />
                        <AppendBountyButton
                          bountyId={item.bountyId || 0}
                          onSuccess={() => fetchBounties()}
                          bgColor="bg-gradient-to-r from-[#6B7C79] to-[#556B66]"
                          hoverColor="hover:from-[#556B66] hover:to-[#455A56]"
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
