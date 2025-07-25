// pages/dashboard/review.tsx
"use client";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import DashboardLayout from "@/components/DashboardLayout";
import Navbar from "@/components/Navbar";
import DownloadBountyButton from "@/components/bounty/DownloadBountyButton";
import ProtectedRoute from "@/components/ProtectedRoute";
import { BUTTON_STYLES } from "@/constants/buttonStyles";
import { useAdmin } from "@/hooks/useAdmin";

export function ResourceReviewPage() {
  const { usePendingReviews, approveResourceMutation, rejectResourceMutation } =
    useAdmin();
  const { data: reviews = [], isLoading: loading } = usePendingReviews();

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [currentItemId, setCurrentItemId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const handleApprove = (id: number) => {
    if (!confirm("确定要通过该资源吗？")) return;
    approveResourceMutation.mutate(id);
  };

  const openRejectModal = (id: number) => {
    setCurrentItemId(id);
    setRejectReason("");
    setShowRejectModal(true);
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setCurrentItemId(null);
    setRejectReason("");
  };

  const handleRejectSubmit = () => {
    if (!currentItemId || !rejectReason.trim()) {
      return;
    }
    rejectResourceMutation.mutate(
      { id: currentItemId, reason: rejectReason },
      {
        onSuccess: () => {
          closeRejectModal();
        },
      }
    );
  };

  return (
    <Navbar name="个人中心">
      <DashboardLayout title="资源审核">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">资源审核</h2>
          <Toaster position="top-center" />
          {loading && <div className="text-center py-4">处理中...</div>}
          {reviews.length === 0 && !loading && (
            <div className="text-gray-400 text-center py-10">
              暂无待审核资源
            </div>
          )}
          {reviews.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto whitespace-nowrap">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left min-w-[150px]">
                      资源名
                    </th>
                    <th className="px-4 py-2 text-left min-w-[250px]">
                      资源描述
                    </th>
                    <th className="px-4 py-2 text-left min-w-[100px]">
                      上传者
                    </th>
                    <th className="px-4 py-2 text-left min-w-[120px]">
                      提交日期
                    </th>
                    <th className="px-4 py-2 text-left min-w-[150px]">操作</th>
                    <th className="px-4 py-2 text-left min-w-[100px]">下载</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-2">{item.name}</td>
                      <td className="px-4 py-2">
                        <div className="max-w-[250px] overflow-x-auto whitespace-nowrap">
                          {item.description}
                        </div>
                      </td>
                      <td className="px-4 py-2">{item.uploader}</td>
                      <td className="px-4 py-2">{item.date}</td>
                      <td className="px-4 py-2 space-x-2">
                        <button
                          onClick={() => handleApprove(item.id)}
                          className={` bg-gradient-to-r from-[#5E8B7E] to-[#4F7A6F] cursor-pointer text-white rounded-lg shadow-md hover:shadow-lg hover:from-[#4F7A6F] hover:to-[#3D685F] transition-all duration-300 px-4 py-2 `}
                          disabled={
                            approveResourceMutation.isPending ||
                            rejectResourceMutation.isPending
                          }
                        >
                          <span className="flex items-center justify-center gap-1.5">
                            通过
                          </span>
                        </button>
                        <button
                          onClick={() => openRejectModal(item.id)}
                          className="px-4 py-2 cursor-pointer bg-[#F1F4F3] text-[#556B66] rounded-lg hover:bg-[#E0E5E3] transition-colors shadow-sm"
                          disabled={
                            approveResourceMutation.isPending ||
                            rejectResourceMutation.isPending
                          }
                        >
                          <span className="flex items-center justify-center gap-1.5">
                            拒绝
                          </span>
                        </button>
                      </td>
                      <td className="px-4 py-2">
                        <DownloadBountyButton id={item.id} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {/* 拒绝原因模态框 */}
          {showRejectModal && currentItemId !== null && (
            <div
              className="fixed inset-0 flex items-center justify-center p-4"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                zIndex: 99999,
              }}
              onClick={closeRejectModal}
            >
              <div
                className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md relative"
                style={{ zIndex: 100000 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold mb-4">
                  拒绝资源: {reviews.find((r) => r.id === currentItemId)?.name}
                </h3>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="请输入拒绝原因..."
                  className="w-full p-2 border rounded mb-4 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={closeRejectModal}
                    className={`${BUTTON_STYLES.COLORS.gray.bg} ${BUTTON_STYLES.COLORS.gray.hover} text-white ${BUTTON_STYLES.STANDARD.padding} rounded`}
                    disabled={rejectResourceMutation.isPending}
                  >
                    取消
                  </button>
                  <button
                    onClick={handleRejectSubmit}
                    className={`${BUTTON_STYLES.COLORS.primary.bg} ${BUTTON_STYLES.COLORS.primary.hover} text-white ${BUTTON_STYLES.STANDARD.padding} rounded`}
                    disabled={
                      rejectResourceMutation.isPending || !rejectReason.trim()
                    }
                  >
                    确认拒绝
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </Navbar>
  );
}

// 包装组件，加入路由保护
export default function ResourceReviewPageWithProtection() {
  return (
    <ProtectedRoute requiredLevel={4}>
      <ResourceReviewPage />
    </ProtectedRoute>
  );
}
