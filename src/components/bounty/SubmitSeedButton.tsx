import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDebounceFn } from "@/hooks/useDebounceFn";
import { submitSeed } from "@/api/bounties";
import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { BUTTON_STYLES } from "@/constants/buttonStyles";
import { FileUp, X, Check } from "lucide-react";

interface SubmitSeedButtonProps {
  bountyId: number;
  bgColor?: string; // 保留参数以便兼容现有调用，但在组件内部不使用
  hoverColor?: string; // 保留参数以便兼容现有调用，但在组件内部不使用
  onSuccess?: () => void;
  className?: string; // 添加className参数
}

export default function SubmitSeedButton({
  bountyId,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  bgColor = BUTTON_STYLES.COLORS.primary.bg, // 接收但不使用该参数
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hoverColor = BUTTON_STYLES.COLORS.primary.hover, // 接收但不使用该参数
  onSuccess,
  className = '',
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
  const debouncedHandleSubmitSeed = useDebounceFn(handleSubmitSeed, 800);  return (
    <>
      <button
        onClick={debouncedOpenSeedModal}
        className={` bg-gradient-to-r from-[#5E8B7E] to-[#4F7A6F] cursor-pointer text-white rounded-lg shadow-md hover:shadow-lg hover:from-[#4F7A6F] hover:to-[#3D685F] transition-all duration-300 px-4 py-2 ${className}`}
      >
        <span className="flex items-center justify-center gap-1.5">
          <FileUp size={16} />
          提交种子
        </span>
      </button>

      {/* 提交种子弹窗 */}
      {showSeedModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="bg-white p-6 rounded-2xl shadow-lg w-96 border border-[#E0E5E3]">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#E0E5E3]">
              <h2 className="text-lg font-bold text-[#3D4D49] flex items-center">
                <div className="h-5 w-1 bg-gradient-to-b from-[#5E8B7E] to-[#4F7A6F] rounded-full mr-2 shadow-sm"></div>
                提交种子
              </h2>
              <button 
                onClick={debouncedCloseSeedModal} 
                className="text-[#6B7C79]  cursor-pointer hover:text-[#3D4D49] transition-colors p-1 rounded-full hover:bg-[#F1F4F3]"
                disabled={isSubmitting}
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="bg-[#F9FAF9] p-4 rounded-lg border border-[#E0E5E3] mb-5">
              <Upload
                beforeUpload={beforeUpload}
                accept=".torrent"
                maxCount={1}
                showUploadList={!!seedFile}
                fileList={seedFile ? [{ uid: "-1", name: seedFile.name, status: 'done' }] : []}
                onRemove={() => setSeedFile(null)}
                className="upload-list-inline"
              >
                <Button 
                  icon={<UploadOutlined />} 
                  style={{ 
                    background: seedFile ? '#F1F4F3' : 'linear-gradient(to right, #5E8B7E, #4F7A6F)',
                    borderColor: seedFile ? '#E0E5E3' : '#4F7A6F',
                    color: seedFile ? '#3D4D49' : 'white',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  {seedFile ? '更换文件' : '选择.torrent文件'}
                </Button>
              </Upload>
              
              {!seedFile && (
                <div className="mt-3 text-sm text-[#8CA29F] italic">
                  请选择一个有效的 .torrent 文件
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={debouncedCloseSeedModal}
                className="px-4 py-2  cursor-pointer bg-[#F1F4F3] text-[#556B66] rounded-lg hover:bg-[#E0E5E3] transition-colors shadow-sm"
                disabled={isSubmitting}
              >
                取消
              </button>
              <button
                onClick={debouncedHandleSubmitSeed}
                className={`px-4 py-2 bg-gradient-to-r from-[#5E8B7E] to-[#4F7A6F] text-white rounded-lg hover:from-[#4F7A6F] hover:to-[#3D685F] transition-colors shadow-md flex items-center gap-1.5 ${
                  (!seedFile || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={!seedFile || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    提交中...
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    确认提交
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
