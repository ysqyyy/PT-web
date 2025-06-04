"use client";

import { useState, useEffect } from "react";
import type { MyBounty, AppendedBounty, SubmittedBounty } from "@/types/bounty";
import DashboardLayout from "@/components/DashboardLayout";
import {
  getMyBounties,
  cancelBounty,
  confirmBounty,
  arbitrateBounty,
  publishBounty,
  getMyAppendedBounties,
  getMySubmittedBounties,
} from "@/api/bounties";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import { useDebounceFn } from "@/hooks/useDebounceFn";
import AppendBountyButton from "@/components/bounty/AppendBountyButton";
import SubmitSeedButton from "@/components/bounty/SubmitSeedButton";
import DownloadBountyButton from "@/components/bounty/DownloadBountyButton";
import { BUTTON_STYLES } from "@/constants/buttonStyles";

export default function MyBountiesPage() {
  const [bounties, setBounties] = useState<MyBounty[]>([]);
  const [appendedBounties, setAppendedBounties] = useState<AppendedBounty[]>(
    []
  );
  const [submittedBounties, setSubmittedBounties] = useState<SubmittedBounty[]>(
    []
  );
  const [activeTab, setActiveTab] = useState<
    "published" | "appended" | "submitted"
  >("published");
  // 发布悬赏表单弹窗相关状态
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishTitle, setPublishTitle] = useState("");
  const [publishAmount, setPublishAmount] = useState("");
  const [publishDesc, setPublishDesc] = useState("");
  // 仲裁弹窗相关状态
  const [showArbitrateModal, setShowArbitrateModal] = useState(false);
  const [arbitrateId, setArbitrateId] = useState<number | null>(null);
  const [arbitrateReason, setArbitrateReason] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    getMyBounties().then(setBounties);
    getMyAppendedBounties().then(setAppendedBounties);
    getMySubmittedBounties().then(setSubmittedBounties);
  };
  // 取消求种请求
  const handleCancel = async (id: number) => {
    if (!window.confirm("确定要取消该求种请求吗？")) return;
    await cancelBounty(id);
    toast.success("已取消求种请求");
    loadData();
  };
  // 确认资源成功
  const handleConfirm = async (id: number) => {
    if (!window.confirm("确定要确认资源吗？")) return;
    await confirmBounty(id);
    toast.success("已确认资源成功");
    loadData();
  }; // 打开仲裁弹窗
  const openArbitrateModal = (id: number) => {
    setArbitrateId(id);
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
    await arbitrateBounty(arbitrateId, arbitrateReason);
    toast.success("已提交仲裁申请");
    closeArbitrateModal();
    loadData();
  }; // 打开发布悬赏弹窗
  const openPublishModal = () => {
    setPublishTitle("");
    setPublishAmount("");
    setPublishDesc("");
    setShowPublishModal(true);
  };
  // 关闭发布悬赏弹窗
  const closePublishModal = () => {
    setShowPublishModal(false);
    setPublishTitle("");
    setPublishAmount("");
    setPublishDesc("");
  };
  // 发布悬赏（弹窗提交）
  const handlePublish = async () => {
    if (!publishTitle || !publishAmount) return;
    await publishBounty(publishTitle, Number(publishAmount), publishDesc);
    toast.success("已发布悬赏");
    closePublishModal();
    loadData();
  }; // 取消求种请求 - 防抖处理
  const debouncedHandleCancel = useDebounceFn(
    (id: unknown) => handleCancel(id as number),
    800
  );
  // 确认资源成功 - 防抖处理
  const debouncedHandleConfirm = useDebounceFn(
    (id: unknown) => handleConfirm(id as number),
    800
  );
  // 打开发布悬赏弹窗 - 防抖处理
  const debouncedOpenPublishModal = useDebounceFn(openPublishModal, 800);
  // 关闭发布悬赏弹窗 - 防抖处理
  const debouncedClosePublishModal = useDebounceFn(closePublishModal, 800);
  // 发布悬赏（弹窗提交）- 防抖处理
  const debouncedHandlePublish = useDebounceFn(handlePublish, 800);
  // 打开仲裁弹窗 - 防抖处理
  const debouncedOpenArbitrateModal = useDebounceFn(
    (id: unknown) => openArbitrateModal(id as number),
    800
  ); // 关闭仲裁弹窗 - 防抖处理
  const debouncedCloseArbitrateModal = useDebounceFn(closeArbitrateModal, 800); // 仲裁（弹窗提交）- 防抖处理
  const debouncedHandleArbitrate = useDebounceFn(handleArbitrate, 800);

  return (
    <Navbar name="个人中心">
      <DashboardLayout title="我的悬赏">
        <div className="bg-white rounded-xl shadow p-6">
          <Toaster position="top-center" /> {/* 选项卡 */}
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
          </div>          {/* 发布悬赏按钮 */}
          {activeTab === "published" && (
            <div className="flex justify-between mb-4">
              <b className="text-lg">我的悬赏</b>
              <button
                className={`${BUTTON_STYLES.STANDARD.padding} ${BUTTON_STYLES.COLORS.primary.bg} text-white rounded ${BUTTON_STYLES.COLORS.primary.hover}`}
                onClick={debouncedOpenPublishModal}
              >
                发布悬赏
              </button>
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
                    {bounties.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-2">{item.name}</td>
                        <td className="px-4 py-2">
                          <div className="max-w-[200px] overflow-x-auto whitespace-nowrap">
                            {item.description}
                          </div>
                        </td>
                        <td className="px-4 py-2">{item.reward_amount} 元</td>
                        <td className="px-4 py-2">{item.total_amount} 元</td>
                        <td className="px-4 py-2">{item.status}</td>
                        <td className="px-4 py-2 space-x-2">
                          {/* 进行中显示追加和取消 */}                          {item.status === "进行中" && (
                            <>
                              <AppendBountyButton
                                bountyId={item.id}
                                bgColor={BUTTON_STYLES.COLORS.primary.bg}
                                hoverColor={BUTTON_STYLES.COLORS.primary.hover}
                                onSuccess={loadData}
                              />
                              <button
                                className={`${BUTTON_STYLES.STANDARD.padding} ${BUTTON_STYLES.COLORS.gray.bg} text-white rounded ${BUTTON_STYLES.COLORS.gray.hover}`}
                                onClick={() => debouncedHandleCancel(item.id)}
                              >
                                取消求种
                              </button>
                            </>
                          )}
                          {/* 待确认显示确认资源和仲裁 */}
                          {item.status === "待确认" && (
                            <>
                              <button
                                className={`${BUTTON_STYLES.STANDARD.padding} ${BUTTON_STYLES.COLORS.primary.bg} text-white rounded ${BUTTON_STYLES.COLORS.primary.hover}`}
                                onClick={() => debouncedHandleConfirm(item.id)}
                              >
                                确认资源
                              </button>
                              <button
                                className={`${BUTTON_STYLES.STANDARD.padding} ${BUTTON_STYLES.COLORS.gray.bg} text-white rounded ${BUTTON_STYLES.COLORS.gray.hover} ml-1`}
                                onClick={() =>                                  debouncedOpenArbitrateModal(item.id)
                                }
                              >
                                申请仲裁
                              </button>
                            </>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          {(item.status === "待确认" ||
                            item.status === "已完成" ||
                            item.status === "待仲裁") && (
                            <DownloadBountyButton
                              id={item.id}
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>                </table>
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
                      <th className="px-4 py-2 text-left min-w-[80px]">状态</th>                      <th className="px-4 py-2 text-left min-w-[150px]">
                        操作
                      </th>
                      <th className="px-4 py-2 text-left min-w-[80px]">下载</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appendedBounties.map((item) => (
                      <tr key={item.id}>                        <td className="px-4 py-2">{item.name}</td>
                        <td className="px-4 py-2">
                          <div className="max-w-[200px] overflow-x-auto whitespace-nowrap">
                            {item.description}
                          </div>
                        </td>
                        <td className="px-4 py-2">{item.publisher}</td>
                        <td className="px-4 py-2">{item.total_amount} 元</td>
                        <td className="px-4 py-2">{item.status}</td>
                        <td className="px-4 py-2 space-x-2">
                          {item.status === "进行中" && (
                            <>
                              <div className="flex gap-1">
                                <AppendBountyButton
                                  bountyId={item.id}
                                  bgColor={BUTTON_STYLES.COLORS.primary.bg}
                                  hoverColor={
                                    BUTTON_STYLES.COLORS.primary.hover
                                  }
                                  onSuccess={loadData}
                                />
                                <SubmitSeedButton
                                  bountyId={item.id}
                                  bgColor={BUTTON_STYLES.COLORS.gray.bg}
                                  hoverColor={BUTTON_STYLES.COLORS.gray.hover}
                                  onSuccess={loadData}
                                />
                              </div>
                            </>                          )}
                        </td>
                        <td className="px-4 py-2">
                          {(item.status === "待确认" ||
                            item.status === "已完成") && (
                            <DownloadBountyButton
                              id={item.id}
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>              </div>
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
                      <th className="px-4 py-2 text-left min-w-[150px]">
                        操作
                      </th>                      <th className="px-4 py-2 text-left min-w-[80px]">下载</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submittedBounties.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-2">{item.name}</td>
                        <td className="px-4 py-2">                          <div className="max-w-[200px] overflow-x-auto whitespace-nowrap">
                            {item.description}
                          </div>
                        </td>
                        <td className="px-4 py-2">{item.publisher}</td>
                        <td className="px-4 py-2">{item.total_amount} 元</td>
                        <td className="px-4 py-2">{item.status}</td>
                        <td className="px-4 py-2 space-x-2">
                          {item.status === "进行中" && (
                            <SubmitSeedButton
                              bountyId={item.id}
                              onSuccess={loadData}
                            />
                          )}
                        </td>
                        <td className="px-4 py-2">
                          {(item.status === "待确认" ||
                            item.status === "已完成" ||
                            item.status === "待仲裁") && (
                            <DownloadBountyButton
                              id={item.id}
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          {/* 发布悬赏弹窗 */}
          {showPublishModal && (
            <div
              className="fixed inset-0 flex items-center justify-center z-50"
              style={{ background: "rgba(0,0,0,0.15)" }}
            >
              <div className="bg-white p-6 rounded-2xl shadow-lg w-96">
                <h2 className="text-lg font-bold mb-4">发布悬赏</h2>
                <div className="mb-3">
                  <label className="block mb-1 font-medium">资源标题</label>
                  <input
                    type="text"
                    className="border p-2 w-full"
                    placeholder="请输入资源标题"
                    value={publishTitle}
                    onChange={(e) => setPublishTitle(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="block mb-1 font-medium">金额</label>
                  <input
                    type="number"
                    className="border p-2 w-full"
                    placeholder="请输入悬赏金额"
                    value={publishAmount}
                    onChange={(e) => setPublishAmount(e.target.value)}
                    min={1}
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-medium">资源描述</label>
                  <textarea
                    className="border p-2 w-full"
                    placeholder="请输入资源描述"
                    value={publishDesc}
                    onChange={(e) => setPublishDesc(e.target.value)}
                    rows={3}
                  />                  </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={debouncedClosePublishModal}
                    className={`${BUTTON_STYLES.STANDARD.padding} bg-gray-300 rounded hover:bg-gray-400`}
                  >
                    取消
                  </button>
                  <button
                    onClick={debouncedHandlePublish}
                    className={`${BUTTON_STYLES.STANDARD.padding} ${BUTTON_STYLES.COLORS.primary.bg} text-white rounded ${BUTTON_STYLES.COLORS.primary.hover}`}
                    disabled={!publishTitle || !publishAmount}
                  >
                    确认发布
                  </button>
                </div>              </div>
            </div>
          )}
          {/* 仲裁弹窗 */}
          {showArbitrateModal && (
            <div
              className="fixed inset-0 flex items-center justify-center z-50"
              style={{ background: "rgba(0,0,0,0.15)" }}
            >
              <div className="bg-white p-6 rounded-2xl shadow-lg w-96">
                <h2 className="text-lg font-bold mb-4">申请仲裁</h2>
                <textarea
                  className="border p-2 w-full mb-4"
                  placeholder="请输入仲裁理由"
                  value={arbitrateReason}
                  onChange={(e) => setArbitrateReason(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={debouncedCloseArbitrateModal}
                    className={`${BUTTON_STYLES.STANDARD.padding} bg-gray-300 rounded hover:bg-gray-400`}
                  >
                    取消
                  </button>
                  <button
                    onClick={debouncedHandleArbitrate}
                    className={`${BUTTON_STYLES.STANDARD.padding} ${BUTTON_STYLES.COLORS.primary.bg} text-white rounded ${BUTTON_STYLES.COLORS.primary.hover}`}
                    disabled={!arbitrateReason}
                  >
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
