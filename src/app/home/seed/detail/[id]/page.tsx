"use client";
import React, { useState } from "react";
import Navbar from "../../../../../components/Navbar";
import { useParams, useRouter } from "next/navigation";
import { useSeed } from "@/hooks/useSeed";
import CommentSection from "@/components/comment/CommentSection";
import DownloadBountyButton from "@/components/bounty/DownloadBountyButton";
import { BUTTON_STYLES } from "@/constants/buttonStyles";
import { toast, Toaster } from "react-hot-toast";
import { getConversations } from "@/api/message";
import { Conversation } from "@/types/message";
import request from "@/utils/request";
export default function SeedDetailPage() {
  const params = useParams();
  const router = useRouter();
  const seedId = params?.id?.toString();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [urlload, setUrlLoad] = useState<string>("");
  
  // 使用useSeed hook
  const { useSeedDetail, rateSeedMutation } = useSeed();
  
  // 获取种子详情
  const { data: seedDetail, isLoading, isError, refetch } = useSeedDetail(seedId ? Number(seedId) : 0);
  
  // 处理评分
  const { mutate: rateSeed } = rateSeedMutation;// 初始化评分
  React.useEffect(() => {
    if (seedDetail?.score) {
      setRating(seedDetail.score);
    }
  }, [seedDetail]);

  // 获取磁力链接
  React.useEffect(() => {
    const fetchMagnetLink = async () => {
      if (!seedId) return;
      
      try {
        const response = await request.get(`http://localhost:8080/torrent/download/${seedId}`).promise;
        console.log("获取磁力链接响应:", response);
        if (response && response.data) {
          console.log("种子详情磁力链接:", response.data.magnetUrl);
          setUrlLoad(response.data.magnetUrl || "");
        }
      } catch (error) {
        console.error("获取磁力链接失败:", error);
      }
    };
    
    fetchMagnetLink();
  }, [seedId]);

  // 提交评分
  const handleSubmitRating = async () => {
    if (rating === 0) {
      toast.error("请选择评分");
      return;
    }

    try {
      rateSeed(
        { seedId: Number(seedId), rating },
        {
          onSuccess: () => {
            toast.success(`感谢您的评分: ${rating}星`, {
              duration: 2000,
              icon: '⭐',
            });
            
            // 刷新数据
            refetch();
          },
          onError: (error) => {
            console.error("评分失败:", error);
            toast.error("评分失败");
          }
        }
      );
    } catch (error) {
      console.error("评分失败:", error);
      toast.error("评分失败");
    }
  };
  // 处理私信
  const handleSendMessage = async () => {
    if (!seedDetail?.publisherId) {
      toast.error("无法获取发布者信息");
      return;
    }

    try {
      const conversations: Conversation[] = await getConversations();
      console.log("getConversations 返回 (直接数组):", conversations);

      const publisherId = seedDetail.publisherId;
      console.log("发布者 ID:", publisherId);

      // 修复：将 publisherId 转换为字符串进行比较
      const existingConversation = conversations.find(
        (conv: Conversation) => conv.participantId === publisherId.toString()
      );
      console.log("找到的现有会话:", existingConversation);

      if (existingConversation) {
        router.push(
          `/home/user/message?conversation=${existingConversation.id}`
        );
      } else {
        toast("目前无法直接创建新会话，请先发送消息以建立对话。");
      }
    } catch (error) {
      console.error("处理私信失败:", error);
      toast.error("处理私信失败，请稍后再试。");
    }
  };

  if (isLoading) {
    return (
      <Navbar name="种子详情">
        <Toaster position="top-center" />
        <div className="bg-white rounded-lg shadow p-6 text-center">
          加载中...
        </div>
      </Navbar>
    );
  }
  
  if (isError || !seedDetail) {
    return (
      <Navbar name="种子中心">
        <Toaster position="top-center" />
        <div className="bg-white rounded-lg shadow p-6 text-center">
          未找到种子信息
          <div className="mt-3">
            <button 
              onClick={() => refetch()}
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
            >
              重试
            </button>
          </div>
        </div>
      </Navbar>
    );
  }

  return (
    <Navbar name="种子中心">
      <Toaster position="top-center" />
      <div className="bg-white rounded-lg shadow p-6">
        {/* 种子标题区域 */}
        <div className="mb-6 pb-4">
          <h1 className="text-2xl font-bold mb-2">{seedDetail.name}</h1>
          <div className="text-gray-600 mb-3">
            {seedDetail.tags &&
              seedDetail.tags.map((tag, index) => (
                <span key={index} className="mx-1">
                  [{tag}]
                </span>
              ))}
          </div>
          {/* 电影简介 - 移到标题下方 */}
          {seedDetail.description && (
            <div className="mt-4 mb-2 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-md font-semibold mb-2 text-teal-500 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                剧情简介
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                {seedDetail.description}
              </p>
            </div>
          )}
        </div>
        {/* 操作按钮区域 */}
        <div className="flex flex-wrap gap-4 mb-6 pb-4">
          <div className="flex-1">
            <div className="text-sm text-gray-500 mb-1">
              发种人：{seedDetail.publisherName}
            </div>
            <div className="text-sm text-gray-500 mb-1">
              磁力链接：{urlload}
            </div>
            <div className="flex flex-wrap gap-2">
              <DownloadBountyButton id={seedDetail.torrentId}/>
              <button
                  onClick={handleSendMessage}

                  className={`${BUTTON_STYLES.STANDARD.padding} cursor-pointer bg-gradient-to-r from-[#5E8B7E] to-[#4F7A6F] text-white rounded flex items-center`}
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
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
                私信发布者
              </button>
            </div>
          </div>
        </div>
        {/* 种子基本信息 */}
        <div className="mb-6 bg-gray-50 rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-gray-700 pb-2">
            种子信息
          </h2>

          {/* 标签展示区域 */}
          {seedDetail.tags && seedDetail.tags.length > 0 && (
            <div className="mb-4 pb-4 border-b border-gray-200">
              <div className="text-sm text-gray-500 mb-2">标签</div>
              <div className="flex flex-wrap gap-2">
                {seedDetail.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-teal-50 text-teal-600 rounded-full text-sm border border-teal-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white p-3 rounded-md shadow-sm flex flex-col justify-between transition-all hover:shadow-md">
              <div className="text-sm text-gray-500 mb-1">大小</div>
              <div className="font-medium text-blue-600">{seedDetail.size}</div>
            </div>
            <div className="bg-white p-3 rounded-md shadow-sm flex flex-col justify-between transition-all hover:shadow-md">
              <div className="text-sm text-gray-500 mb-1">原价</div>
              <div className="font-medium text-blue-600">
                {seedDetail.price}
              </div>
            </div>
            <div className="bg-white p-3 rounded-md shadow-sm flex flex-col justify-between transition-all hover:shadow-md">
              <div className="text-sm text-gray-500 mb-1">发布时间</div>
              <div className="font-medium text-blue-600">
                {seedDetail.publishTime}
              </div>
            </div>
            <div className="bg-white p-3 rounded-md shadow-sm flex flex-col justify-between transition-all hover:shadow-md">
              <div className="text-sm text-gray-500 mb-1">下载限制</div>
              <div className="font-medium text-blue-600">
                {seedDetail.downloadLimit || "无限制"}
              </div>
            </div>
            <div className="bg-white p-3 rounded-md shadow-sm flex flex-col justify-between transition-all hover:shadow-md">
              <div className="text-sm text-gray-500 mb-1">下载次数</div>
              <div className="font-medium text-blue-600">
                {seedDetail.downloadCount}
              </div>
            </div>
          </div>
        </div>        {/* 资源评分区域 */}
        <div className="mb-6 pb-4 bg-gray-50 p-5 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-gray-700 pb-2 border-b border-gray-200">资源评分</h2>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="mr-4 bg-white p-3 rounded-lg shadow-sm">
                <span className="text-3xl font-bold text-teal-600">
                  {seedDetail.score || 0}
                </span>
                <span className="text-gray-500">/5分</span>
              </div>
              <div className="text-gray-500">
                共有 <span className="font-medium">{seedDetail.scoreCount || 0}</span> 人评分
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex items-center mr-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className="text-2xl focus:outline-none transition-all duration-200"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    {star <= (hoverRating || rating) ? (
                      <span className="text-yellow-400">★</span>
                    ) : (
                      <span className="text-gray-300 hover:text-yellow-200">☆</span>
                    )}
                  </button>
                ))}
              </div>
              <button
                className={`bg-gradient-to-r from-[#5E8B7E] to-[#4F7A6F] cursor-pointer text-white rounded-lg shadow-md hover:shadow-lg hover:from-[#4F7A6F] hover:to-[#3D685F] transition-all duration-300 px-4 py-2`}
                onClick={handleSubmitRating}
              >
                提交评分
              </button>
            </div>
          </div>
        </div>
        {/* 评论区域 - 使用 CommentSection 组件 */}
        <div className="pt-6">
          {seedId && <CommentSection seedId={Number(seedId)} />}
        </div>
      </div>
    </Navbar>
  );
}
