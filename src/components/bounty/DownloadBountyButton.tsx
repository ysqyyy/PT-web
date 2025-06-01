import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDebounceFn } from "@/hooks/useDebounceFn";
import { downloadBountyResource } from "@/api/bounties";
import { BUTTON_STYLES } from "@/constants/buttonStyles";

interface DownloadBountyButtonProps {
  bountyId: number;
  bgColor?: string; // 按钮背景色，可选参数，默认为teal-600
  hoverColor?: string; // 鼠标悬停时的背景色，可选参数，默认为teal-700
  onSuccess?: () => void; // 下载成功后的回调函数，可选参数
}

export default function DownloadBountyButton({
  bountyId,
  bgColor = "bg-teal-600",
  hoverColor = "hover:bg-teal-700",
  onSuccess,
}: DownloadBountyButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  // 下载资源
  const handleDownload = async () => {
    if (!bountyId) return;
    
    try {
      setIsLoading(true);
      await downloadBountyResource(bountyId);
      toast.success("资源下载已开始");
      
      // 如果有成功回调函数，则调用
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("下载错误:", error);
      toast.error("下载失败，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  // 下载资源 - 防抖处理
  const debouncedHandleDownload = useDebounceFn(handleDownload, 800);

  return (
    <button
      className={`${BUTTON_STYLES.STANDARD.padding} ${bgColor} text-white rounded ${hoverColor} flex items-center cursor-pointer`}
      onClick={debouncedHandleDownload}
      disabled={isLoading}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 mr-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>
      {isLoading ? "下载中..." : "下载"}
    </button>
  );
}
