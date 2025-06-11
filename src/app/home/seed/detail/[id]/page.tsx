"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../../../../../components/Navbar";
import { useParams } from "next/navigation";
import { message } from "antd";
import { getSeedDetail, rateSeed } from "@/api/seed";
import CommentSection from "@/components/comment/CommentSection";
import { SeedDetail } from "@/types/seed";
import DownloadBountyButton from "@/components/bounty/DownloadBountyButton";
import { BUTTON_STYLES } from "@/constants/buttonStyles";

export default function SeedDetailPage() {
  const params = useParams();
  const seedId = params?.id?.toString();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [seedDetail, setSeedDetail] = useState<SeedDetail | null>(null);
  const [loading, setLoading] = useState(false);

  // 获取种子详情
  useEffect(() => {
    const fetchData = async () => {
      if (!seedId) return;

      setLoading(true);
      try {
        const detailRes = await getSeedDetail(Number(seedId));

        if (detailRes) {
          setSeedDetail(detailRes);
          setRating(detailRes.score || 0);
        }
      } catch (error) {
        console.error("获取数据失败:", error);
        message.error("获取种子详情失败");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [seedId]);

  // 提交评分
  const handleSubmitRating = async () => {
    if (rating === 0) {
      message.error("请选择评分");
      return;
    }

    try {
      const res = await rateSeed(Number(seedId), rating);
      if (res.success) {
        message.success(`感谢您的评分: ${rating}星`);
        if (seedDetail) {
          setSeedDetail({
            ...seedDetail,
            score: rating,
            scoreCount: (seedDetail.scoreCount || 0) + 1,
          });
        }
      }
    } catch (error) {
      console.error("评分失败:", error);
      message.error("评分失败");
    }
  };

  if (loading) {
    return (
      <Navbar name="种子详情">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          加载中...
        </div>
      </Navbar>
    );
  }

  if (!seedDetail) {
    return (
      <Navbar name="种子中心">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          未找到种子信息
        </div>
      </Navbar>
    );
  }

  return (
    <Navbar name="种子中心">
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
              发种人：{seedDetail.publisherName} ({seedDetail.publisherLevel})
            </div>
            <div className="flex flex-wrap gap-2">
              <DownloadBountyButton id={seedDetail.id} type="resource" />
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                收藏
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                奖励保种积分
              </button>
            </div>
          </div>
        </div>
        {/* 种子基本信息 */}
        <div className="mb-6 bg-gray-50 rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-gray-700 pb-2">
            种子信息
          </h2>
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
        </div>
        {/* 资源评分区域 */}
        <div className="mb-6 pb-4 flex justify-between items-center">
          <div className="flex items-center mb-4">
            <div className="mr-4">
              <span className="text-3xl font-bold">
                {seedDetail.score || 0}
              </span>
              <span className="text-gray-500">/5分</span>
            </div>
            <div className="text-gray-500">
              {seedDetail.scoreCount || 0}人评分
            </div>
          </div>

          <div className="mb-4 flex items-center">
            <div className="flex items-center mr-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className="text-2xl focus:outline-none"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  {star <= (hoverRating || rating) ? "★" : "☆"}
                </button>
              ))}
            </div>
            <button
              className={`${BUTTON_STYLES.STANDARD.padding} ${BUTTON_STYLES.COLORS.secondary.bg} text-white cursor-pointer rounded ${BUTTON_STYLES.COLORS.secondary.hover}`}
              onClick={handleSubmitRating}
            >
              提交评分
            </button>
          </div>
        </div>
        {/* 评论区域 - 使用新的 CommentSection 组件 */}
        <div className="pt-6">
          {seedId && <CommentSection seedId={Number(seedId)} />}
        </div>
      </div>
    </Navbar>
  );
}
