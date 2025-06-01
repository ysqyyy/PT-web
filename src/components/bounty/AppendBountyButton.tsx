import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDebounceFn } from "@/hooks/useDebounceFn";
import { appendBounty } from "@/api/bounties";
import { BUTTON_STYLES } from "@/constants/buttonStyles";

interface AppendBountyButtonProps {
  bountyId: number;
  bgColor?: string; // 按钮背景色，可选参数，默认为gray-600
  hoverColor?: string; // 鼠标悬停时的背景色，可选参数，默认为gray-700
  onSuccess?: () => void; // 追加成功后的回调函数，可选参数
}

export default function AppendBountyButton({
  bountyId,
  bgColor = "bg-gray-600",
  hoverColor = "hover:bg-gray-700",
  onSuccess,
}: AppendBountyButtonProps) {
  // 追加悬赏相关状态
  const [appendAmount, setAppendAmount] = useState<string>("");
  const [showAppendModal, setShowAppendModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 打开追加悬赏弹窗
  const openAppendModal = () => {
    setAppendAmount("");
    setShowAppendModal(true);
  };

  // 关闭追加悬赏弹窗
  const closeAppendModal = () => {
    setShowAppendModal(false);
    setAppendAmount("");
  };

  // 追加悬赏（弹窗提交）
  const handleAppend = async () => {
    if (!bountyId || !appendAmount) return;
    
    try {
      setIsLoading(true);
      await appendBounty(bountyId, Number(appendAmount));
      toast.success("已追加悬赏");
      closeAppendModal();
      // 如果有成功回调函数，则调用
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("追加悬赏失败:", error);
      toast.error("追加悬赏失败，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  // 追加悬赏（弹窗提交）- 防抖处理
  const debouncedHandleAppend = useDebounceFn(handleAppend, 800);
  // 打开追加悬赏弹窗 - 防抖处理
  const debouncedOpenAppendModal = useDebounceFn(openAppendModal, 800);

  return (
    <>
      <button
        className={`${BUTTON_STYLES.STANDARD.padding} ${bgColor} text-white rounded ${hoverColor} mb-1 cursor-pointer`}
        onClick={debouncedOpenAppendModal}
      >
        追加悬赏
      </button>

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
              disabled={isLoading}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeAppendModal}
                className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400"
                disabled={isLoading}
              >
                取消
              </button>
              <button
                onClick={debouncedHandleAppend}
                className="px-4 py-1 bg-teal-800 text-white rounded hover:bg-teal-900"
                disabled={!appendAmount || isLoading}
              >
                {isLoading ? "处理中..." : "确认追加"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
