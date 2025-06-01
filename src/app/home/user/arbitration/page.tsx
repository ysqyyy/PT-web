"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import DashboardLayout from "@/components/DashboardLayout";
import toast, { Toaster } from "react-hot-toast";
import { getArbitrationBounties, rejectArbitration, approveArbitration } from "@/api/arbitration";
import { downloadBountyResource } from "@/api/bounties";
import type { ArbitrationBounty } from "@/types/bounty";

export default function ArbitrationPage() {
  const [bounties, setBounties] = useState<ArbitrationBounty[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getArbitrationBounties().then(setBounties);
  }, []);

  // 驳回仲裁
  const handleReject = async (id: number) => {
    if (!window.confirm("确定要驳回该仲裁请求吗？")) return;
    setLoading(true);
    try {
      await rejectArbitration(id);
      toast.success("已驳回仲裁请求");
      setBounties(bounties.filter((b) => b.id !== id));
    } catch {
      toast.error("操作失败");
    } finally {
      setLoading(false);
    }
  };  // 同意仲裁
  const handleApprove = async (id: number) => {
    if (!window.confirm("确定要同意该仲裁请求吗？")) return;
    setLoading(true);
    try {
      await approveArbitration(id);
      toast.success("已同意仲裁请求");
      setBounties(bounties.filter((b) => b.id !== id));
    } catch {
      toast.error("操作失败");
    } finally {
      setLoading(false);
    }
  };

  // 下载资源
  const handleDownload = async (id: number) => {
    setLoading(true);
    try {
      await downloadBountyResource(id);
      toast.success("资源下载已开始");
    } catch (error) {
      toast.error("下载失败，请稍后重试");
      console.error("下载错误:", error);
    } finally {
      setLoading(false);
    }
  };

  // if (role !== "admin") {
  //   return (
  //     <Navbar name="仲裁管理">
  //       <DashboardLayout title="仲裁管理">
  //         <div className="text-center text-gray-500 py-20">无权限访问</div>
  //       </DashboardLayout>
  //     </Navbar>
  //   );
  // }

  return (
    <Navbar name="个人中心">
      <DashboardLayout title="仲裁管理">
        <Toaster />
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold mb-4">仲裁管理</h2>
          {bounties.length === 0 ? (
            <div className="text-gray-400 text-center py-10">暂无仲裁请求</div>
          ) : (
            <table className="min-w-full table-auto">              
            <thead>
                <tr>
                  <th className="px-4 py-2 text-left">标题</th>
                  <th className="px-4 py-2 text-left">金额</th>
                  <th className="px-4 py-2 text-left">发布人</th>
                  <th className="px-4 py-2 text-left">仲裁理由</th>
                  <th className="px-4 py-2 text-left">操作</th>
                  <th className="px-4 py-2 text-left">下载</th>
                </tr>
              </thead>
              <tbody>
                {bounties.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-2">{item.title}</td>
                    <td className="px-4 py-2">{item.amount} 元</td>
                    <td className="px-4 py-2">{item.publisher}</td>
                    <td className="px-4 py-2">{item.arbitrationReason}</td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                        onClick={() => handleReject(item.id)}
                        disabled={loading}
                      >
                        驳回仲裁
                      </button>
                      <button
                        className="px-3 py-1 bg-teal-700 text-white rounded hover:bg-teal-900"
                        onClick={() => handleApprove(item.id)}
                        disabled={loading}                      >
                        同意仲裁
                      </button>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        className="px-3 py-1 bg-teal-600 text-white rounded hover:bg-teal-700 flex items-center"
                        onClick={() => handleDownload(item.id)}
                        disabled={loading}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        下载
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </DashboardLayout>
    </Navbar>
  );
}
