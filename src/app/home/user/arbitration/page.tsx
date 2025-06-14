"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import DashboardLayout from "@/components/DashboardLayout";
import toast, { Toaster } from "react-hot-toast";
import {
  getArbitrationBounties,
  rejectArbitration,
  approveArbitration,
} from "@/api/arbitration";
import DownloadBountyButton from "@/components/bounty/DownloadBountyButton";
import type { ArbitrationBounty } from "@/types/bounty";
import { BUTTON_STYLES } from "@/constants/buttonStyles";
import ProtectedRoute from "@/components/ProtectedRoute";
export function ArbitrationPage() {
  const [bounties, setBounties] = useState<ArbitrationBounty[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getArbitrationBounties().then(setBounties);
  }, []);

  // 驳回仲裁
  const handleReject = async (submissionId: number) => {
    if (!window.confirm("确定要驳回该仲裁请求吗？")) return;
    setLoading(true);
    try {
      await rejectArbitration(submissionId);
      toast.success("已驳回仲裁请求");
      setBounties(bounties.filter((b) => b.submissionId !== submissionId));
    } catch {
      toast.error("操作失败");
    } finally {
      setLoading(false);
    }
  }; // 同意仲裁
  const handleApprove = async (submissionId: number) => {
    if (!window.confirm("确定要同意该仲裁请求吗？")) return;
    setLoading(true);
    try {
      await approveArbitration(submissionId);
      toast.success("已同意仲裁请求");
      setBounties(bounties.filter((b) => b.submissionId !== submissionId));
    } catch {
      toast.error("操作失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Navbar name="个人中心">
      <DashboardLayout title="仲裁管理">
        <Toaster />
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold mb-4">仲裁管理</h2>
          {bounties.length === 0 ? (
            <div className="text-gray-400 text-center py-10">暂无仲裁请求</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">标题</th>
                    <th className="px-4 py-2 text-left">发布人</th>
                    <th className="px-4 py-2 text-left">描述</th>
                    <th className="px-4 py-2 text-left">仲裁理由</th>
                    <th className="px-4 py-2 text-left">操作</th>
                    <th className="px-4 py-2 text-left">下载</th>
                  </tr>
                </thead>
                <tbody>
                  {bounties.map((item) => (
                    <tr key={item.submissionId}>
                      <td className="px-4 py-2">{item.name}</td>
                      <td className="px-4 py-2">{item.publisher}</td>
                      <td className="px-4 py-2">
                        <div className="max-w-[200px] overflow-x-auto whitespace-nowrap">
                          {item.description}
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <div className="max-w-[200px] overflow-x-auto whitespace-nowrap">
                          {item.reason}
                        </div>
                      </td>
                      <td className="px-4 py-2 space-x-2">
                        <div className="flex gap-2">
                          <button
                            className={`${BUTTON_STYLES.STANDARD.padding} ${BUTTON_STYLES.COLORS.primary.bg} text-white rounded ${BUTTON_STYLES.COLORS.primary.hover}`}
                            onClick={() => handleApprove(item.submissionId || 0)}
                            disabled={loading}
                          >
                            同意仲裁
                          </button>
                          <button
                            className={`${BUTTON_STYLES.STANDARD.padding} ${BUTTON_STYLES.COLORS.gray.bg} text-white rounded ${BUTTON_STYLES.COLORS.gray.hover}`}
                            onClick={() => handleReject(item.submissionId|| 0)}
                            disabled={loading}
                          >
                            驳回仲裁
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <DownloadBountyButton
                          id={item.torrentId || 0}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </DashboardLayout>
    </Navbar>
  );
}

// 包装组件，加入路由保护
export default function ArbitrationPageWithProtection() {
  return (
    <ProtectedRoute requiredLevel={2}>
      <ArbitrationPage />
    </ProtectedRoute>
  );
}
