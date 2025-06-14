import React, { useState } from "react";
import { BUTTON_STYLES } from "@/constants/buttonStyles";
import toast from "react-hot-toast";
import { publishBounty } from "@/api/bounties";
import { categoryMap } from "@/constants/categories";
import { tagMap } from "@/constants/tags";

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
  const [category, setCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

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
    
    setLoading(true);
    try {
      await publishBounty(title, Number(amount), desc, category, selectedTags);
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

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
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
      <button
        className={`${BUTTON_STYLES.STANDARD.padding} ${BUTTON_STYLES.COLORS.primary.bg} cursor-pointer text-white rounded ${BUTTON_STYLES.COLORS.primary.hover} ${className}`}
        onClick={openModal}
      >
        发布悬赏
      </button>
      
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 overflow-y-auto pt-10 pb-10"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="bg-white p-8 rounded-2xl shadow-xl w-[550px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-5 text-gray-800 border-b pb-3">发布悬赏</h2>
            
            {/* 资源标题 */}
            <div className="mb-4">
              <label className="block mb-2 font-medium text-gray-700">资源标题 <span className="text-red-500">*</span></label>
              <input
                type="text"
                className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="请输入您想要的资源标题"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            {/* 分类选择 */}
            <div className="mb-4">
              <label className="block mb-2 font-medium text-gray-700">分类 <span className="text-red-500">*</span></label>
              <select
                className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">请选择分类</option>
                {Object.entries(categoryMap).map(([name, id]) => (
                  <option key={id} value={id}>{name}</option>
                ))}
              </select>
            </div>
            
            {/* 标签选择 */}
            <div className="mb-4">
              <label className="block mb-2 font-medium text-gray-700">标签 (最多5个)</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {Object.entries(tagMap).map(([id, name]) => (
                  <div 
                    key={id}
                    onClick={() => toggleTag(id)}
                    className={`px-3 py-1 rounded-full text-sm cursor-pointer transition duration-200 ${
                      selectedTags.includes(id) 
                        ? 'bg-teal-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {name}
                  </div>
                ))}
              </div>
            </div>
            
            {/* 悬赏金额 */}
            <div className="mb-4">
              <label className="block mb-2 font-medium text-gray-700">悬赏金额 <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  type="number"
                  className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="请输入悬赏金额"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min={1}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  积分
                </span>
              </div>
            </div>
            
            {/* 资源描述 */}
            <div className="mb-5">
              <label className="block mb-2 font-medium text-gray-700">资源描述</label>
              <textarea
                className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="请详细描述您需要的资源，如资源版本、清晰度、字幕要求等"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={4}
              />
            </div>
            
            {/* 操作按钮 */}
            <div className="flex justify-end space-x-3 pt-3 border-t">
              <button
                onClick={closeModal}
                className="px-5 py-2 bg-gray-200 text-gray-700 cursor-pointer rounded-lg hover:bg-gray-300 transition duration-200"
                disabled={loading}
              >
                取消
              </button>
              <button
                onClick={handlePublish}
                className={`px-5 py-2 bg-teal-600 text-white cursor-pointer rounded-lg hover:bg-teal-700 transition duration-200 ${
                  (!title || !amount || !category || loading) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={!title || !amount || !category || loading}
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
