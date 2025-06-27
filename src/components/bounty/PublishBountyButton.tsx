import React, { useState } from "react";
import { BUTTON_STYLES } from "@/constants/buttonStyles";
import toast from "react-hot-toast";
import { categoryMap } from "@/constants/categories";
import { tagMap } from "@/constants/tags";
import { Coins, X, Tag, FileText, HelpCircle } from "lucide-react";
import { useBounty } from "@/hooks/useBounty";

interface PublishBountyButtonProps {
  onSuccess?: () => void;
  className?: string;
}

export default function PublishBountyButton({
  onSuccess,
  className = "",
}: PublishBountyButtonProps) {
  const { publishBountyMutation } = useBounty();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const openModal = () => {
    setTitle("");
    setAmount("");
    setDesc("");
    setCategory("");
    setSelectedTags([]);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setTitle("");
    setAmount("");
    setDesc("");
    setCategory("");
    setSelectedTags([]);
  };
  const handlePublish = async () => {
    if (!title || !amount || !category) {
      toast.error("请填写完整信息");
      return;
    }
    await publishBountyMutation.mutateAsync({
      title,
      bounty: Number(amount),
      description: desc,
      category,
      tags: selectedTags,
    });
    closeModal();
    onSuccess?.();
  };

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((id) => id !== tagId));
    } else {
      if (selectedTags.length < 5) {
        setSelectedTags([...selectedTags, tagId]);
      } else {
        toast.error("最多选择5个标签");
      }
    }
  };

  return (
    <>
      {" "}
      <button
        data-testid="publish-bounty-btn"
        className={`${BUTTON_STYLES.STANDARD.padding} bg-gradient-to-r from-[#5E8B7E] to-[#4F7A6F] cursor-pointer text-white rounded-lg shadow-md hover:shadow-lg hover:from-[#4F7A6F] hover:to-[#3D685F] transition-all duration-300 px-4 py-2 ${className}`}
        onClick={openModal}
      >
        <span className="flex items-center gap-1.5">
          <Coins size={16} />
          发布悬赏
        </span>
      </button>
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 overflow-y-auto pt-10 pb-10"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="bg-white p-8 rounded-2xl shadow-xl w-[550px] max-h-[90vh] overflow-y-auto border border-[#E0E5E3]">
            <div className="flex justify-between items-center mb-5 border-b pb-3">
              <h2 className="text-2xl font-bold text-[#3D4D49] flex items-center">
                <div className="h-6 w-1 bg-gradient-to-b from-[#5E8B7E] to-[#4F7A6F] rounded-full mr-3 shadow-sm"></div>
                发布悬赏
              </h2>
              <button
                onClick={closeModal}
                className="text-[#6B7C79] cursor-pointer hover:text-[#3D4D49] transition-colors p-1 rounded-full hover:bg-[#F1F4F3]"
              >
                <X size={20} />
              </button>
            </div>

            {/* 资源标题 */}
            <div className="mb-5">
              <label className="block mb-2 font-medium text-[#3D4D49] flex items-center">
                <FileText size={16} className="mr-1.5 text-[#5E8B7E]" />
                资源标题 <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                className="border border-[#E0E5E3] p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E8B7E] transition shadow-sm bg-[#F9FAF9]"
                placeholder="请输入您想要的资源标题"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* 分类选择 */}
            <div className="mb-5">
              <label className="block mb-2 font-medium text-[#3D4D49] flex items-center">
                <Tag size={16} className="mr-1.5 text-[#5E8B7E]" />
                分类 <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                className="border border-[#E0E5E3] p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E8B7E] transition shadow-sm bg-[#F9FAF9]"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">请选择分类</option>
                {Object.entries(categoryMap).map(([name, id]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* 标签选择 */}
            <div className="mb-5">
              <label className="block mb-2 font-medium text-[#3D4D49] flex items-center">
                <Tag size={16} className="mr-1.5 text-[#5E8B7E]" />
                标签{" "}
                <span className="text-[#8CA29F] text-sm ml-1">(最多5个)</span>
              </label>
              <div className="flex flex-wrap gap-2 mt-1 bg-[#F9FAF9] p-3 rounded-lg border border-[#E0E5E3]">
                {Object.entries(tagMap).map(([id, name]) => (
                  <div
                    key={id}
                    onClick={() => toggleTag(id)}
                    className={`px-3 py-1.5 rounded-full text-sm cursor-pointer transition duration-200 shadow-sm ${
                      selectedTags.includes(id)
                        ? "bg-gradient-to-r from-[#5E8B7E] to-[#4F7A6F] text-white"
                        : "bg-[#F1F4F3] text-[#556B66] hover:bg-[#E0E5E3]"
                    }`}
                  >
                    {name}
                  </div>
                ))}
              </div>
            </div>

            {/* 悬赏金额 */}
            <div className="mb-5">
              <label className="block mb-2 font-medium text-[#3D4D49] flex items-center">
                <Coins size={16} className="mr-1.5 text-[#5E8B7E]" />
                悬赏金额 <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  className="border border-[#E0E5E3] p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E8B7E] transition shadow-sm bg-[#F9FAF9]"
                  placeholder="请输入悬赏金额"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min={1}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8CA29F]">
                  积分
                </span>
              </div>
            </div>

            {/* 资源描述 */}
            <div className="mb-6">
              <label className="block mb-2 font-medium text-[#3D4D49] flex items-center">
                <HelpCircle size={16} className="mr-1.5 text-[#5E8B7E]" />
                资源描述
              </label>
              <textarea
                className="border border-[#E0E5E3] p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E8B7E] transition shadow-sm bg-[#F9FAF9]"
                placeholder="请详细描述您需要的资源，如资源版本、清晰度、字幕要求等"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={4}
              />
            </div>

            {/* 操作按钮 */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-[#E0E5E3]">
              <button
                onClick={closeModal}
                className="px-5 py-2 bg-[#F1F4F3] text-[#556B66] cursor-pointer rounded-lg hover:bg-[#E0E5E3] transition duration-200 shadow-sm"
                disabled={ publishBountyMutation.isPending}
              >
                取消
              </button>
              <button
                onClick={handlePublish}
                className={`px-5 py-2 bg-gradient-to-r from-[#5E8B7E] to-[#4F7A6F] text-white cursor-pointer rounded-lg hover:from-[#4F7A6F] hover:to-[#3D685F] transition duration-200 shadow-md flex items-center gap-2 ${
                  !title || !amount || !category || publishBountyMutation.isPending
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={!title || !amount || !category ||  publishBountyMutation.isPending}
              >
                { publishBountyMutation.isPending ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-1"></div>
                    发布中...
                  </>
                ) : (
                  <>
                    <Coins size={16} />
                    确认发布
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
