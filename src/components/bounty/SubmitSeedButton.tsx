import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDebounceFn } from "@/hooks/useDebounceFn";
import { submitSeed } from "@/api/bounties";
import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { BUTTON_STYLES } from "@/constants/buttonStyles";
interface SubmitSeedButtonProps {
  bountyId: number;
  bgColor?: string;
  hoverColor?: string;
  onSuccess?: () => void;
}

export default function SubmitSeedButton({
  bountyId,
  bgColor = BUTTON_STYLES.COLORS.primary.bg,
  hoverColor = BUTTON_STYLES.COLORS.primary.hover,
  onSuccess,
}: SubmitSeedButtonProps) {
  // 弹窗相关状态
  const [showSeedModal, setShowSeedModal] = useState(false);
  const [seedFile, setSeedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // antd Upload 组件的自定义 beforeUpload
  const beforeUpload = (file: File) => {
    setSeedFile(file);
    return false; // 阻止自动上传
  };

  // 打开提交种子弹窗
  const openSeedModal = () => {
    setSeedFile(null);
    setShowSeedModal(true);
  };

  // 关闭弹窗
  const closeSeedModal = () => {
    setShowSeedModal(false);
    setSeedFile(null);
  };

  // 提交种子响应（支持文件上传）
  const handleSubmitSeed = async () => {
    if (!bountyId || !seedFile) return;
    
    try {
      setIsSubmitting(true);
      await submitSeed(bountyId, seedFile);
      toast.success("已提交种子");
      closeSeedModal();
      
      // 如果有成功回调函数，则调用
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("提交种子失败:", error);
      toast.error("提交种子失败，请稍后重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 防抖处理
  const debouncedOpenSeedModal = useDebounceFn(openSeedModal, 800);
  const debouncedCloseSeedModal = useDebounceFn(closeSeedModal, 800);
  const debouncedHandleSubmitSeed = useDebounceFn(handleSubmitSeed, 800);

  return (
    <>
      <button
        onClick={debouncedOpenSeedModal}
        className={`${BUTTON_STYLES.STANDARD.padding} ${bgColor} text-white rounded ${hoverColor} mb-1 cursor-pointer`}
      >
        提交种子
      </button>

      {/* 提交种子弹窗 */}
      {showSeedModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: "rgba(0,0,0,0.15)" }}
        >
          <div className="bg-white p-6 rounded-2xl shadow-lg w-80">
            <h2 className="text-lg font-bold mb-4">提交种子</h2>
            <Upload
              beforeUpload={beforeUpload}
              // accept=".torrent"
              maxCount={1}
              showUploadList={!!seedFile}
              fileList={seedFile ? [{ uid: "-1", name: seedFile.name }] : []}
              onRemove={() => setSeedFile(null)}
            >
              <Button icon={<UploadOutlined />}>选择.torrent文件</Button>
            </Upload>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={debouncedCloseSeedModal}
                className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400"
                disabled={isSubmitting}
              >
                取消
              </button>
              <button
                onClick={debouncedHandleSubmitSeed}
                className="px-4 py-1 bg-teal-700 text-white rounded hover:bg-teal-900"
                disabled={!seedFile || isSubmitting}
              >
                {isSubmitting ? "提交中..." : "确认提交"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
