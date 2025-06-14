import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDebounceFn } from "@/hooks/useDebounceFn";
import { appendBounty } from "@/api/bounties";
import { BUTTON_STYLES } from "@/constants/buttonStyles";
import { X, Check, Coins } from "lucide-react";

interface AppendBountyButtonProps {
  bountyId: number;
  bgColor?: string; // 为了向后兼容，保留但不使用
  hoverColor?: string; // 为了向后兼容，保留但不使用
  onSuccess?: () => void; // 追加成功后的回调函数，可选参数
  className?: string; // 添加className参数
}

export default function AppendBountyButton({
  bountyId,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  bgColor = BUTTON_STYLES.COLORS.gray.bg, // 为了向后兼容，保留但不使用
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hoverColor = BUTTON_STYLES.COLORS.gray.hover, // 接收但不使用该参数
  onSuccess,
  className = '',
}: AppendBountyButtonProps) {
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
  const debouncedOpenAppendModal = useDebounceFn(openAppendModal, 800);  return (
    <>
      <button
        className={`bg-gradient-to-r from-[#5E8B7E] to-[#4F7A6F] cursor-pointer text-white rounded-lg shadow-md hover:shadow-lg hover:from-[#4F7A6F] hover:to-[#3D685F] transition-all duration-300 px-4 py-2 ${className}`}
        onClick={debouncedOpenAppendModal}
      >
        <span className="flex items-center justify-center gap-1.5">
          <Coins size={16} />
          追加悬赏
        </span>
      </button>

      {/* 追加悬赏弹窗 */}
      {showAppendModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="bg-white p-6 rounded-2xl shadow-lg w-96 border border-[#E0E5E3]">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#E0E5E3]">
              <h2 className="text-lg font-bold text-[#3D4D49] flex items-center">
                <div className="h-5 w-1 bg-gradient-to-b from-[#5E8B7E] to-[#4F7A6F] rounded-full mr-2 shadow-sm"></div>
                追加悬赏
              </h2>
              <button 
                onClick={closeAppendModal} 
                className="text-[#6B7C79] hover:text-[#3D4D49] transition-colors p-1 rounded-full hover:bg-[#F1F4F3]"
                disabled={isLoading}
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="mb-5">
              <label className="block mb-2 font-medium text-[#3D4D49] flex items-center">
                <Coins size={16} className="mr-1.5 text-[#5E8B7E]" />
                追加金额
              </label>
              <div className="relative">
                <input
                  type="number"
                  className="border border-[#E0E5E3] p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E8B7E] transition shadow-sm bg-[#F9FAF9]"
                  placeholder="请输入追加悬赏金额"
                  value={appendAmount}
                  onChange={(e) => setAppendAmount(e.target.value)}
                  min={1}
                  disabled={isLoading}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8CA29F]">
                  积分
                </span>
              </div>
              <p className="mt-2 text-sm text-[#8CA29F]">追加后的积分将增加到悬赏总额中</p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeAppendModal}
                className="px-4 py-2 bg-[#F1F4F3] text-[#556B66] rounded-lg hover:bg-[#E0E5E3] transition-colors shadow-sm"
                disabled={isLoading}
              >
                取消
              </button>
              <button
                onClick={debouncedHandleAppend}
                className={`px-4 py-2 bg-gradient-to-r from-[#5E8B7E] to-[#4F7A6F] text-white rounded-lg hover:from-[#4F7A6F] hover:to-[#3D685F] transition-colors shadow-md flex items-center gap-1.5 ${
                  (!appendAmount || isLoading) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={!appendAmount || isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    追加中...
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    确认追加
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
