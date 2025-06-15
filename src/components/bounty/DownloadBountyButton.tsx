import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDebounceFn } from "@/hooks/useDebounceFn";
import { downloadResource } from "@/api/download";
import { BUTTON_STYLES } from "@/constants/buttonStyles";
import { Download } from "lucide-react";

interface DownloadBountyButtonProps {
  id: number;
  bgColor?: string; // 保留参数以便兼容现有调用，但在组件内部不使用
  hoverColor?: string; // 保留参数以便兼容现有调用，但在组件内部不使用
  onSuccess?: () => void; // 下载成功后的回调函数，可选参数
}

export default function DownloadBountyButton({
  id,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  bgColor = BUTTON_STYLES.COLORS.secondary.bg, // 接收但不使用该参数
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hoverColor = BUTTON_STYLES.COLORS.secondary.hover, // 接收但不使用该参数
  onSuccess,
}: DownloadBountyButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  // 下载资源
  const handleDownload = async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      const url = await downloadResource(id);
      toast.success("资源下载已开始");
      // 使用window.confirm显示下载URL
      window.confirm(`磁力链接: ${url}`);
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
      className={`${BUTTON_STYLES.STANDARD.padding} bg-gradient-to-r from-[#5E8B7E] to-[#4F7A6F] text-white rounded-lg shadow-md hover:shadow-lg hover:from-[#4F7A6F] hover:to-[#3D685F] transition-all duration-300 py-2 px-4 flex items-center justify-center gap-1.5 cursor-pointer ${isLoading ? 'opacity-70' : ''}`}
      onClick={debouncedHandleDownload}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
          <span>下载中...</span>
        </>
      ) : (
        <>
          <Download size={16} />
          <span>下载</span>
        </>
      )}
    </button>
  );
}
