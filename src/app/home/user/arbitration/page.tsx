"use client";

import Navbar from "@/components/Navbar";
import DashboardLayout from "@/components/DashboardLayout";
import { Toaster } from "react-hot-toast";
import DownloadBountyButton from "@/components/bounty/DownloadBountyButton";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useArbitration } from "@/hooks/useArbitration";
export function ArbitrationPage() {
  const { 
    useArbitrationBounties,
    rejectArbitrationMutation,
    approveArbitrationMutation
  } = useArbitration();
    // 获取仲裁列表
  const { 
    data: bounties = []
  } = useArbitrationBounties();

  // 驳回仲裁
  const handleReject = (submissionId: number) => {
    if (!window.confirm("确定要驳回该仲裁请求吗？")) return;
    rejectArbitrationMutation.mutate(submissionId);
  };

  // 同意仲裁
  const handleApprove = (submissionId: number) => {
    if (!window.confirm("确定要同意该仲裁请求吗？")) return;
    approveArbitrationMutation.mutate(submissionId);
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
                            className="bg-gradient-to-r from-[#5E8B7E] to-[#4F7A6F] cursor-pointer text-white rounded-lg shadow-md hover:shadow-lg hover:from-[#4F7A6F] hover:to-[#3D685F] transition-all duration-300 px-4 py-2"
                            onClick={() =>
                              handleApprove(item.submissionId || 0)
                            }
                            disabled={approveArbitrationMutation.isPending || rejectArbitrationMutation.isPending}
                          >
                            <span className="flex items-center justify-center gap-1.5">
                              同意仲裁
                            </span>
                          </button>
                          <button></button>
                          <button
                            className="px-4 py-2 cursor-pointer bg-[#F1F4F3] text-[#556B66] rounded-lg hover:bg-[#E0E5E3] transition-colors shadow-sm"
                            onClick={() => handleReject(item.submissionId || 0)}
                            disabled={approveArbitrationMutation.isPending || rejectArbitrationMutation.isPending}
                          >
                            <span className="flex items-center justify-center gap-1.5">
                              驳回仲裁
                            </span>
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <DownloadBountyButton id={item.torrentId || 0} />
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
    <ProtectedRoute requiredLevel={5}>
      <ArbitrationPage />
    </ProtectedRoute>
  );
}
