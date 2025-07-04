"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import { useDebounceFn } from "@/hooks/useDebounceFn";
import AppendBountyButton from "@/components/bounty/AppendBountyButton";
import SubmitSeedButton from "@/components/bounty/SubmitSeedButton";
import DownloadBountyButton from "@/components/bounty/DownloadBountyButton";
import PublishBountyButton from "@/components/bounty/PublishBountyButton";
import { BUTTON_STYLES } from "@/constants/buttonStyles";
import { X, Check, FileUp } from "lucide-react";
import { useBounty } from "@/hooks/useBounty";

export default function MyBountiesPage() {
  const {
    useMyBounties,
    useMyAppendedBounties,
    useMySubmittedBounties,
    cancelBountyMutation,
    confirmBountyMutation,
    arbitrateBountyMutation,
  } = useBounty();

  // 使用React Query获取数据
  const { data: bounties = [], refetch: refetchMyBounties, isLoading: isLoadingMyBounties } = useMyBounties();
  const { data: appendedBounties = [], refetch: refetchAppendedBounties, isLoading: isLoadingAppendedBounties } = useMyAppendedBounties();
  const { data: submittedBounties = [], refetch: refetchSubmittedBounties, isLoading: isLoadingSubmittedBounties } = useMySubmittedBounties();

  const [activeTab, setActiveTab] = useState<"published" | "appended" | "submitted">("published");

  // 仲裁弹窗相关状态
  const [showArbitrateModal, setShowArbitrateModal] = useState(false);
  const [arbitrateId, setArbitrateId] = useState<number | null>(null);
  const [arbitrateReason, setArbitrateReason] = useState("");

  // 重新加载所有数据
  const refreshAllData = () => {
    refetchMyBounties();
    refetchAppendedBounties();
    refetchSubmittedBounties();
  };

  // 取消求种请求
  const handleCancel = async (bountyId: number) => {
    if (!window.confirm("确定要取消该求种请求吗？")) return;
    cancelBountyMutation.mutate(bountyId, {
      onSuccess: () => {
        toast.success("已取消求种请求");
        refreshAllData();
      },
    });
  };

  // 确认资源成功
  const handleConfirm = async (submissionId: number) => {
    if (!window.confirm("确定要确认资源吗？")) return;
    confirmBountyMutation.mutate(submissionId, {
      onSuccess: () => {
        toast.success("已确认资源成功");
        refreshAllData();
      },
    });
  };

  // 打开仲裁弹窗
  const openArbitrateModal = (submissionId: number) => {
    setArbitrateId(submissionId);
    setArbitrateReason("");
    setShowArbitrateModal(true);
  };
  // 关闭仲裁弹窗
  const closeArbitrateModal = () => {
    setShowArbitrateModal(false);
    setArbitrateId(null);
    setArbitrateReason("");
  };
  // 仲裁（弹窗提交）
  const handleArbitrate = async () => {
    if (!arbitrateId || !arbitrateReason) return;
    arbitrateBountyMutation.mutate(
      { submissionId: arbitrateId, reason: arbitrateReason },
      {
        onSuccess: () => {
          toast.success("已提交仲裁申请");
          closeArbitrateModal();
          refreshAllData();
        },
      }
    );
  };

  // 防抖处理
  const debouncedHandleCancel = useDebounceFn(
    (bountyId: unknown) => handleCancel(bountyId as number),
    800
  );
  const debouncedHandleConfirm = useDebounceFn(
    (submissionId: unknown) => handleConfirm(submissionId as number),
    800
  );
  const debouncedOpenArbitrateModal = useDebounceFn(
    (submissionId: unknown) => openArbitrateModal(submissionId as number),
    800
  );
  const debouncedCloseArbitrateModal = useDebounceFn(closeArbitrateModal, 800);
  const debouncedHandleArbitrate = useDebounceFn(handleArbitrate, 800);

  return (
    <Navbar name="个人中心">
      <DashboardLayout title="我的悬赏">
        <div className="bg-white rounded-xl shadow p-6">
          <Toaster position="top-center" />
          {/* 选项卡 */}
          <div className="mb-4 flex border-b">
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "published"
                  ? "border-b-2 border-teal-700 text-teal-700"
                  : "text-gray-500 hover:text-teal-700"
              } cursor-pointer`}
              onClick={() => setActiveTab("published")}
            >
              我发布的悬赏
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "appended"
                  ? "border-b-2 border-teal-700 text-teal-700"
                  : "text-gray-500 hover:text-teal-700"
              } cursor-pointer`}
              onClick={() => setActiveTab("appended")}
            >
              我追加的悬赏
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "submitted"
                  ? "border-b-2 border-teal-700 text-teal-700"
                  : "text-gray-500 hover:text-teal-700"
              } cursor-pointer`}
              onClick={() => setActiveTab("submitted")}
            >
              我提交的悬赏
            </button>
          </div>
          {/* 发布悬赏按钮 */}
          {activeTab === "published" && (
            <div className="flex justify-between mb-4">
              <b className="text-lg">我的悬赏</b>
              <PublishBountyButton onSuccess={refreshAllData} />
            </div>
          )}
          {/* 表格 */}
          <div className="bg-white rounded-xl shadow p-6">
            {activeTab === "published" && (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto whitespace-nowrap">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left min-w-[120px]">
                        标题
                      </th>
                      <th className="px-4 py-2 text-left min-w-[200px]">
                        描述
                      </th>
                      <th className="px-4 py-2 text-left min-w-[100px]">
                        初始金额
                      </th>
                      <th className="px-4 py-2 text-left min-w-[100px]">
                        当前金额
                      </th>
                      <th className="px-4 py-2 text-left min-w-[80px]">状态</th>
                      <th className="px-4 py-2 text-left min-w-[150px]">
                        操作
                      </th>
                      <th className="px-4 py-2 text-left min-w-[80px]">下载</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoadingMyBounties ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                          加载中...
                        </td>
                      </tr>
                    ) : bounties.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                          暂无数据
                        </td>
                      </tr>
                    ) : (
                      bounties.map((item, index) => (
                        <tr key={`published-${item.bountyId}-${index}`}>
                          <td className="px-4 py-2">{item.name}</td>
                          <td className="px-4 py-2">
                            <div className="max-w-[200px] overflow-x-auto whitespace-nowrap">
                              {item.description}
                            </div>
                          </td>
                          <td className="px-4 py-2">{item.reward_amount}元</td>
                          <td className="px-4 py-2">{item.total_amount} 元</td>
                          <td className="px-4 py-2">{item.status}</td>
                          <td className="px-4 py-2 space-x-2">
                            {/* pending显示追加和取消 */}
                            {item.status === "pending" && (
                              <div className="flex flex-col space-y-2">
                                <AppendBountyButton
                                  bountyId={item.bountyId || 0}
                                  onSuccess={refreshAllData}
                                  className={`${BUTTON_STYLES.STANDARD.padding} w-auto inline-block`}
                                />
                                <button
                                  className="px-4 py-2 cursor-pointer bg-[#F1F4F3] text-[#556B66] rounded-lg hover:bg-[#E0E5E3] transition-colors shadow-sm"
                                  onClick={() =>
                                    debouncedHandleCancel(item.bountyId)
                                  }
                                >
                                  <span>取消求种</span>
                                </button>
                              </div>
                            )}
                            {/* unconfirmed显示确认资源和仲裁 */}
                            {item.status === "unconfirmed" && (
                              <div className="flex flex-col space-y-2">
                                <button
                                  className={`bg-gradient-to-r from-[#5E8B7E] to-[#4F7A6F] cursor-pointer text-white rounded-lg shadow-md hover:shadow-lg hover:from-[#4F7A6F] hover:to-[#3D685F] transition-all duration-300 px-4 py-2 inline-block flex items-center justify-center gap-1.5`}
                                  onClick={() =>
                                    debouncedHandleConfirm(item.submissionId)
                                  }
                                >
                                  <Check size={16} />
                                  确认资源
                                </button>
                                <button
                                  className={`bg-gradient-to-r from-[#5E8B7E] to-[#4F7A6F] cursor-pointer text-white rounded-lg shadow-md hover:shadow-lg hover:from-[#4F7A6F] hover:to-[#3D685F] transition-all duration-300 px-4 py-2 inline-block flex items-center justify-center gap-1.5`}
                                  onClick={() =>
                                    debouncedOpenArbitrateModal(item.submissionId)
                                  }
                                >
                                  <FileUp size={16} />
                                  申请仲裁
                                </button>
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-2">
                            {(item.status === "unconfirmed" ||
                              item.status === "approved" ||
                              item.status === "under_review") && (
                              <DownloadBountyButton id={item.torrentId || 0} />
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
            {activeTab === "appended" && (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto whitespace-nowrap">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left min-w-[120px]">
                        悬赏标题
                      </th>
                      <th className="px-4 py-2 text-left min-w-[200px]">
                        描述
                      </th>
                      <th className="px-4 py-2 text-left min-w-[100px]">
                        发布者
                      </th>
                      <th className="px-4 py-2 text-left min-w-[100px]">
                        当前金额
                      </th>
                      <th className="px-4 py-2 text-left min-w-[80px]">状态</th>
                      <th className="px-4 py-2 text-left min-w-[150px]">
                        操作
                      </th>
                      <th className="px-4 py-2 text-left min-w-[80px]">下载</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appendedBounties.map((item, index) => (
                      <tr key={`appended-${item.bountyId}-${index}`}>
                        <td className="px-4 py-2">{item.name}</td>
                        <td className="px-4 py-2">
                          <div className="max-w-[200px] overflow-x-auto whitespace-nowrap">
                            {item.description}
                          </div>
                        </td>
                        <td className="px-4 py-2">{item.publisher}</td>
                        <td className="px-4 py-2">
                          {item.contributedAmount} 元
                        </td>
                        <td className="px-4 py-2">{item.status}</td>
                        <td className="px-4 py-2 space-x-2">
                          {item.status === "pending" && (
                            <div className="flex space-x-2">
                              <AppendBountyButton
                                bountyId={item.bountyId || 0}
                                onSuccess={refreshAllData}
                                className="inline-block"
                              />
                              <SubmitSeedButton
                                bountyId={item.bountyId || 0}
                                onSuccess={refreshAllData}
                                className="inline-block"
                              />
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          {(item.status === "unconfirmed" ||
                            item.status === "approved" ||
                            item.status === "under_review") && (
                            <DownloadBountyButton id={item.torrentId || 0} />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {activeTab === "submitted" && (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto whitespace-nowrap">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left min-w-[120px]">
                        悬赏标题
                      </th>
                      <th className="px-4 py-2 text-left min-w-[200px]">
                        描述
                      </th>
                      <th className="px-4 py-2 text-left min-w-[100px]">
                        发布者
                      </th>
                      <th className="px-4 py-2 text-left min-w-[100px]">
                        当前金额
                      </th>
                      <th className="px-4 py-2 text-left min-w-[80px]">状态</th>
                      <th className="px-4 py-2 text-left min-w-[80px]">下载</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submittedBounties.map((item, index) => (
                      <tr key={`submitted-${item.bountyId}-${index}`}>
                        <td className="px-4 py-2">{item.name}</td>
                        <td className="px-4 py-2">
                          <div className="max-w-[200px] overflow-x-auto whitespace-nowrap">
                            {item.description}
                          </div>
                        </td>
                        <td className="px-4 py-2">{item.publisher}</td>
                        <td className="px-4 py-2">{item.total_amount} 元</td>
                        <td className="px-4 py-2">{item.status}</td>
                        <td className="px-4 py-2">
                          {(item.status === "unconfirmed" ||
                            item.status === "approved" ||
                            item.status === "under_review") && (
                            <DownloadBountyButton id={item.torrentId || 0} />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          {/* 仲裁弹窗 */}
          {showArbitrateModal && (
            <div
              className="fixed inset-0 flex items-center justify-center z-50"
              style={{ background: "rgba(0,0,0,0.5)" }}
            >
              <div className="bg-white p-6 rounded-2xl shadow-lg w-96 border border-[#E0E5E3]">
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#E0E5E3]">
                  <h2 className="text-lg font-bold text-[#3D4D49] flex items-center">
                    <div className="h-5 w-1 bg-gradient-to-b from-[#5E8B7E] to-[#4F7A6F] rounded-full mr-2 shadow-sm"></div>
                    申请仲裁
                  </h2>
                  <button
                    onClick={debouncedCloseArbitrateModal}
                    className="text-[#6B7C79] hover:text-[#3D4D49] transition-colors p-1 rounded-full hover:bg-[#F1F4F3]"
                  >
                    <X size={18} />
                  </button>
                </div>
                <textarea
                  className="border border-[#E0E5E3] p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E8B7E] transition shadow-sm bg-[#F9FAF9] mb-5"
                  placeholder="请输入仲裁理由"
                  value={arbitrateReason}
                  onChange={(e) => setArbitrateReason(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={debouncedCloseArbitrateModal}
                    className="px-4 py-2 bg-[#F1F4F3] text-[#556B66] rounded-lg hover:bg-[#E0E5E3] transition-colors shadow-sm"
                  >
                    取消
                  </button>
                  <button
                    onClick={debouncedHandleArbitrate}
                    className={`px-4 py-2 bg-gradient-to-r from-[#5E8B7E] to-[#4F7A6F] text-white rounded-lg hover:from-[#4F7A6F] hover:to-[#3D685F] transition-colors shadow-md flex items-center gap-1.5 ${
                      !arbitrateReason ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={!arbitrateReason}
                  >
                    <FileUp size={16} />
                    确认仲裁
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