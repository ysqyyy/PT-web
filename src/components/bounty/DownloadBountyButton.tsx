import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDebounceFn } from "@/hooks/useDebounceFn";
import { downloadResource } from "@/api/download";
import { BUTTON_STYLES } from "@/constants/buttonStyles";

interface DownloadBountyButtonProps {
  id: number;
  type?: 'bounty' | 'resource';
  bgColor?: string;
  hoverColor?: string;
  onSuccess?: () => void; // 下载成功后的回调函数，可选参数
}

export default function DownloadBountyButton({
  id,
  type = 'bounty',
  bgColor = BUTTON_STYLES.COLORS.secondary.bg,
  hoverColor = BUTTON_STYLES.COLORS.secondary.hover,
  onSuccess,
}: DownloadBountyButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  // 下载资源
  const handleDownload = async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      if (type === 'bounty') {
        await downloadResource(id, 'bounty');
      } else {
        await downloadResource(id, 'resource');
      }
      
      toast.success("资源下载已开始");
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
