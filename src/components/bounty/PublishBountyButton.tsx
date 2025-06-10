import React, { useState } from "react";
import { BUTTON_STYLES } from "@/constants/buttonStyles";
import toast from "react-hot-toast";
import { publishBounty } from "@/api/bounties";

interface PublishBountyButtonProps {
  onSuccess?: () => void;
  className?: string;
}

export default function PublishBountyButton({
  onSuccess,
  className = '',
}: PublishBountyButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);

  const openModal = () => {
    setTitle("");
    setAmount("");
    setDesc("");
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setTitle("");
    setAmount("");
    setDesc("");
  };
  const handlePublish = async () => {
    if (!title || !amount) return;
    setLoading(true);
    try {
      await publishBounty(title, Number(amount), desc);
      toast.success("已发布悬赏");
      closeModal();
      onSuccess?.();
    } catch (err) {
      toast.error("发布失败");
      console.error("发布悬赏失败:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className={`${BUTTON_STYLES.STANDARD.padding} ${BUTTON_STYLES.COLORS.primary.bg} text-white rounded ${BUTTON_STYLES.COLORS.primary.hover} ${className}`}
        onClick={openModal}
      >
        发布悬赏
      </button>
      {showModal && (
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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-medium">金额</label>
              <input
                type="number"
                className="border p-2 w-full"
                placeholder="请输入悬赏金额"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={1}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">资源描述</label>
              <textarea
                className="border p-2 w-full"
                placeholder="请输入资源描述"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeModal}
                className={`${BUTTON_STYLES.STANDARD.padding} bg-gray-300 rounded hover:bg-gray-400`}
                disabled={loading}
              >
                取消
              </button>
              <button
                onClick={handlePublish}
                className={`${BUTTON_STYLES.STANDARD.padding} ${BUTTON_STYLES.COLORS.primary.bg} text-white rounded ${BUTTON_STYLES.COLORS.primary.hover}`}
                disabled={!title || !amount || loading}
              >
                {loading ? "发布中..." : "确认发布"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
