// pages/dashboard/bounties.tsx
"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../../components/DashboardLayout";
import {
  getMyBounties,
  appendBounty,
  cancelBounty,
  confirmBounty,
  arbitrateBounty,
  publishBounty,
} from "../../../api/bounties";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";

// 示例数据类型和数据
interface MyBounty {
  id: number;
  title: string;
  amount: number;
  status: string;
}

export default function MyBountiesPage() {
  const [bounties, setBounties] = useState<MyBounty[]>([]);
  // 追加悬赏弹窗相关状态
  const [showAppendModal, setShowAppendModal] = useState(false);
  const [appendId, setAppendId] = useState<number | null>(null);
  const [appendAmount, setAppendAmount] = useState("");
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
    getMyBounties().then(setBounties);
  }, []);

  // 打开追加悬赏弹窗
  const openAppendModal = (id: number) => {
    setAppendId(id);
    setAppendAmount("");
    setShowAppendModal(true);
  };
  // 关闭追加悬赏弹窗
  const closeAppendModal = () => {
    setShowAppendModal(false);
    setAppendId(null);
    setAppendAmount("");
  };
  // 追加悬赏（弹窗提交）
  const handleAppend = async () => {
    if (!appendId || !appendAmount) return;
    await appendBounty(appendId, Number(appendAmount));
    toast.success("已追加悬赏");
    closeAppendModal();
  };
  // 取消求种请求
  const handleCancel = async (id: number) => {
    if (!window.confirm("确定要取消该求种请求吗？")) return;
    await cancelBounty(id);
    toast.success("已取消求种请求");
  };
  // 确认资源成功
  const handleConfirm = async (id: number) => {
    if (!window.confirm("确定要确认资源吗？")) return;
    await confirmBounty(id);
    toast.success("已确认资源成功");
  };
  // 打开仲裁弹窗
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
  };
  // 打开发布悬赏弹窗
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
  };

  return (
    <Navbar name="个人中心">
      <DashboardLayout title="我的悬赏">
        <div className="bg-white rounded-xl shadow p-6">
          <Toaster position="top-center" />
          {/* 发布悬赏按钮 */}
          <div className="flex justify-between mb-4">
            <b className="text-lg">我的悬赏</b>
            <button
              className="px-3 py-1 bg-teal-700 text-white rounded hover:bg-teal-900"
              onClick={openPublishModal}
            >
              发布悬赏
            </button>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">悬赏标题</th>
                  <th className="px-4 py-2 text-left">金额</th>
                  <th className="px-4 py-2 text-left">状态</th>
                  <th className="px-4 py-2 text-left">操作</th>
                </tr>
              </thead>
              <tbody>
                {bounties.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-2">{item.title}</td>
                    <td className="px-4 py-2">{item.amount} 元</td>
                    <td className="px-4 py-2">{item.status}</td>
                    <td className="px-4 py-2 space-x-2">
                      {/* 进行中显示追加和取消 */}
                      {item.status === "进行中" && (
                        <>
                          <button
                            className="px-3 py-1 bg-teal-700 text-white rounded hover:bg-teal-900"
                            onClick={() => openAppendModal(item.id)}
                          >
                            追加悬赏
                          </button>
                          <button
                            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                            onClick={() => handleCancel(item.id)}
                          >
                            取消求种
                          </button>
                        </>
                      )}
                      {/* 待确认显示确认资源和仲裁 */}
                      {item.status === "待确认" && (
                        <>
                          <button
                            className="px-3 py-1 bg-teal-700 text-white rounded hover:bg-teal-900"
                            onClick={() => handleConfirm(item.id)}
                          >
                            确认资源
                          </button>
                          <button
                            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                            onClick={() => openArbitrateModal(item.id)}
                          >
                            申请仲裁
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* 追加悬赏弹窗 */}
          {showAppendModal && (
            <div
              className="fixed inset-0 flex items-center justify-center z-50"
              style={{ background: "rgba(0,0,0,0.15)" }}
            >
              <div className="bg-white p-6 rounded-2xl shadow-lg w-80">
                <h2 className="text-lg font-bold mb-4">追加悬赏</h2>
                <input
                  type="number"
                  className="border p-2 w-full mb-4"
                  placeholder="请输入追加悬赏金额"
                  value={appendAmount}
                  onChange={(e) => setAppendAmount(e.target.value)}
                  min={1}
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={closeAppendModal}
                    className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleAppend}
                    className="px-4 py-1 bg-teal-800 text-white rounded hover:bg-teal-900"
                    disabled={!appendAmount}
                  >
                    确认追加
                  </button>
                </div>
              </div>
            </div>
          )}
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
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={closePublishModal}
                    className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    取消
                  </button>
                  <button
                    onClick={handlePublish}
                    className="px-4 py-1 bg-teal-700 text-white rounded hover:bg-teal-900"
                    disabled={!publishTitle || !publishAmount}
                  >
                    确认发布
                  </button>
                </div>
              </div>
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
                    onClick={closeArbitrateModal}
                    className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleArbitrate}
                    className="px-4 py-1 bg-teal-700 text-white rounded hover:bg-teal-800"
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
