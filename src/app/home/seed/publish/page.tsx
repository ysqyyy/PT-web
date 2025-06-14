"use client";
import React, { useState } from "react";
import Navbar from "../../../../components/Navbar";
import { useRouter } from "next/navigation";
import { Upload, Button, message, Input, Select } from "antd";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { UploadOutlined } from "@ant-design/icons";
import { publishSeed } from "@/api/seed";
import { publishSeedData } from "@/types/seed";
import { tagMap } from "@/constants/tags";
const { TextArea } = Input;
const { Option } = Select;

export default function SeedPublish() {
  const router = useRouter();
  const [formData, setFormData] = useState<publishSeedData>({
    name: "",
    description: "",
    tags: [],
    price: 0,
    category: "电影",
  });
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [normalFileList, setNormalFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // 获取所有标签
  const allTags = Object.values(tagMap);

  const presets = {
    categories: [
      "电影",
      "剧集",
      "音乐",
      "动漫",
      "游戏",
      "综艺",
      "体育",
      "纪录片",
    ],
  };
  // 提交表单，发布种子
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 检查是否有任何一种文件
    const hasTorrentFile = fileList.length > 0;
    const hasNormalFile = normalFileList.length > 0;

    if (!hasTorrentFile && !hasNormalFile) {
      message.error({
        content: "请上传文件",
        style: {
          borderRadius: "0.75rem",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        },
        duration: 3,
      });
      return;
    }

    if (!formData.name) {
      message.error({
        content: "请填写种子名称",
        style: {
          borderRadius: "0.75rem",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        },
        duration: 3,
      });
      return;
    }

    setUploading(true);
    try {
      // 根据文件类型选择对应的文件
      const file = hasTorrentFile
        ? fileList[0]?.originFileObj
        : normalFileList[0]?.originFileObj;

      if (!file) {
        message.error({
          content: "文件上传失败",
          style: {
            borderRadius: "0.75rem",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
          },
          duration: 3,
        });
        return;
      }

      // 在formData中添加文件类型标记
      const updatedFormData = {
        ...formData,
        fileType: hasTorrentFile ? "torrent" : "normal",
      };

      const res = await publishSeed(file, updatedFormData);
      //返回值判断
      if (res.success) {
        setPublishSuccess(true);
        message.success({
          content: "种子发布成功，即将返回种子列表页面",
          style: {
            borderRadius: "0.75rem",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
          },
          duration: 3,
        });

        setTimeout(() => {
          router.push("/home/seed");
        }, 1500);
      } else {
        message.error({
          content: "种子发布失败",
          style: {
            borderRadius: "0.75rem",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
          },
          duration: 3,
        });
      }
    } catch (error) {
      console.error("种子发布失败:", error);
      message.error({
        content: "种子发布失败",
        style: {
          borderRadius: "0.75rem",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        },
        duration: 3,
      });
    } finally {
      setUploading(false);
    }
  };

  // 文件上传相关操作
  const handleFileChange: UploadProps["onChange"] = (info) => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-1); // 限制只能上传一个文件

    // 检查文件类型
    newFileList = newFileList.filter((file) => {
      const isValidType =
        file.type === "application/x-bittorrent" ||
        (file.name && file.name.endsWith(".torrent"));
      if (!isValidType) {
        message.error("只能上传.torrent文件");
        return false;
      }
      return true;
    });

    setFileList(newFileList);
    setNormalFileList([]); // 清空另一个文件上传区
  };

  // 处理普通文件上传
  const handleNormalFileChange: UploadProps["onChange"] = (info) => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-1); // 限制只能上传一个文件

    setNormalFileList(newFileList);
    setFileList([]); // 清空另一个文件上传区
  };

  return (
    <Navbar name="种子中心">
      <style jsx global>{`
        .ant-input,
        .ant-input-number,
        .ant-select-selector,
        .ant-input-affix-wrapper {
          border-radius: 0.75rem !important;
          border-color: #e0e5e3 !important;
          background-color: #f9faf9 !important;
          transition: all 0.3s ease !important;
          padding: 0.6rem 1rem !important;
        }
        .ant-input:hover,
        .ant-input-number:hover,
        .ant-select-selector:hover,
        .ant-input-affix-wrapper:hover {
          border-color: #5e8b7e !important;
          transform: translateY(-1px) !important;
        }

        .ant-input:focus,
        .ant-input-number:focus,
        .ant-select-selector:focus,
        .ant-input-affix-wrapper:focus,
        .ant-input-focused,
        .ant-input-number-focused,
        .ant-select-focused .ant-select-selector,
        .ant-input-affix-wrapper-focused {
          border-color: #5e8b7e !important;
          box-shadow: 0 0 0 2px rgba(94, 139, 126, 0.2) !important;
          transform: translateY(-1px) !important;
        }
        .ant-select-selector {
          height: auto !important;
          padding: 0.5rem 1rem !important;
        }

        .ant-select-dropdown {
          border-radius: 0.75rem !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
          border: 1px solid #e0e5e3 !important;
          padding: 0.5rem !important;
        }

        .ant-select-item {
          border-radius: 0.5rem !important;
          padding: 0.5rem 0.75rem !important;
          transition: all 0.2s ease !important;
        }

        .ant-select-item-option-selected {
          background-color: #eff6f4 !important;
          color: #5e8b7e !important;
          font-weight: 500 !important;
        }

        .ant-select-item-option-active {
          background-color: #f1f4f3 !important;
        }

        .ant-btn {
          border-radius: 0.75rem !important;
          height: auto !important;
          padding: 0.6rem 1.2rem !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          transition: all 0.3s ease !important;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08) !important;
        }
        .ant-upload-list-item {
          border-radius: 0.5rem !important;
          overflow: hidden !important;
          margin-top: 0.75rem !important;
          border: 1px solid #e0e5e3 !important;
          background-color: white !important;
          padding: 0.25rem !important;
          transition: all 0.3s ease !important;
        }

        .ant-upload-list-item:hover {
          border-color: #5e8b7e !important;
          box-shadow: 0 2px 6px rgba(94, 139, 126, 0.15) !important;
          transform: translateY(-2px) !important;
        }

        .ant-upload-list-item-name {
          padding: 0 0.5rem !important;
          color: #3d4d49 !important;
          font-weight: 500 !important;
        }

        .ant-upload-list-item-card-actions {
          opacity: 0.8 !important;
          transition: opacity 0.2s ease !important;
        }

        .ant-upload-list-item:hover .ant-upload-list-item-card-actions {
          opacity: 1 !important;
        }

        .morandy-primary-button {
          background: linear-gradient(145deg, #5e8b7e, #4f7a6f) !important;
          border-color: #5e8b7e !important;
          color: white !important;
          padding: 0.7rem 2rem !important;
          font-weight: 500 !important;
          box-shadow: 0 4px 10px rgba(79, 122, 111, 0.2) !important;
        }

        .morandy-primary-button:hover {
          background: linear-gradient(145deg, #4f7a6f, #416a60) !important;
          border-color: #4f7a6f !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 6px 15px rgba(79, 122, 111, 0.25) !important;
        }

        .morandy-secondary-button {
          background: linear-gradient(145deg, #a2b1af, #8ca29f) !important;
          border-color: #a2b1af !important;
          color: white !important;
          padding: 0.7rem 2rem !important;
          font-weight: 500 !important;
          box-shadow: 0 4px 10px rgba(162, 177, 175, 0.2) !important;
        }

        .morandy-secondary-button:hover {
          background: linear-gradient(145deg, #8ca29f, #778c8a) !important;
          border-color: #8ca29f !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 6px 15px rgba(162, 177, 175, 0.25) !important;
        }

        .morandy-gray-button {
          background: linear-gradient(145deg, #a8b2b0, #94a3a0) !important;
          border-color: #a8b2b0 !important;
          color: white !important;
          padding: 0.7rem 2rem !important;
          font-weight: 500 !important;
          box-shadow: 0 4px 10px rgba(168, 178, 176, 0.2) !important;
        }

        .morandy-gray-button:hover {
          background: linear-gradient(145deg, #94a3a0, #7f908d) !important;
          border-color: #94a3a0 !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 6px 15px rgba(168, 178, 176, 0.25) !important;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-in {
          animation: fadeIn 0.5s ease forwards;
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(94, 139, 126, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(94, 139, 126, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(94, 139, 126, 0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .animate-pulse-once {
          animation: pulse 2s ease-out forwards;
        }

        @keyframes slideInFromBottom {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .slide-in-bottom {
          animation: slideInFromBottom 0.5s ease-out forwards;
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        .loading-shimmer {
          background: linear-gradient(
            to right,
            #f6f9f8 8%,
            #e9f0ee 18%,
            #f6f9f8 33%
          );
          background-size: 1000px 100%;
          animation: shimmer 2s infinite linear;
        }
      `}</style>{" "}
      <div className="bg-gradient-to-b from-[#F6F9F8] to-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-8 max-w-5xl mx-auto fade-in">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E0E5E3]">
          <h1 className="text-2xl font-bold text-[#3D4D49] flex items-center">
            <svg
              className="w-6 h-6 mr-2 text-[#5E8B7E]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              ></path>
            </svg>
            发布种子
          </h1>
          <div className="text-sm text-[#6B7C79] bg-[#F1F4F3] px-3 py-1.5 rounded-full flex items-center shadow-sm">
            <svg
              className="w-4 h-4 mr-1.5 text-[#5E8B7E]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span className="font-medium">提示:</span>{" "}
            完整的信息可以提高资源被找到的几率
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          <fieldset disabled={uploading || publishSuccess}>
            <div className="grid grid-cols-1 gap-8">
              <div className="space-y-6">
                <div
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  style={{ animationDelay: "0.1s" }}
                  className="slide-in-bottom"
                >
                  {/* 名称 */}
                  <div className="bg-[#F9FAF9] p-5 rounded-xl border border-[#E0E5E3] hover:border-[#5E8B7E] hover:shadow-md transition-all duration-300 h-full flex flex-col justify-between group">
                    <div>
                      <label className="flex items-center text-sm font-semibold text-[#3D4D49] mb-3 group-hover:text-[#5E8B7E] transition-colors">
                        <svg
                          className="w-4 h-4 mr-1.5 text-[#5E8B7E]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                          ></path>
                        </svg>
                        名称 <span className="text-[#E67E65] ml-1">*</span>
                      </label>
                      <Input
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full"
                        required
                        placeholder="请输入种子名称"
                        size="large"
                      />
                    </div>
                    <div className="text-xs text-[#6B7C79] mt-3 flex items-center">
                      <svg
                        className="w-3.5 h-3.5 mr-1 text-[#A2B1AF]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      清晰、简洁的名称有助于用户发现资源
                    </div>
                  </div>
                  {/* 文件上传区域 */}
                  <div className="bg-[#F9FAF9] p-5 rounded-xl border border-[#E0E5E3] hover:border-[#5E8B7E] hover:shadow-md transition-all duration-300 h-full flex flex-col justify-between group">
                    <div>
                      <label className="flex items-center text-sm font-semibold text-[#3D4D49] mb-3 group-hover:text-[#5E8B7E] transition-colors">
                        <svg
                          className="w-4 h-4 mr-1.5 text-[#5E8B7E]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                          ></path>
                        </svg>
                        文件上传 <span className="text-[#E67E65] ml-1">*</span>
                      </label>

                      <div className="space-y-4">
                        {" "}
                        {/* Torrent文件上传 */}
                        <div
                          className={`border border-dashed rounded-xl p-4 transition-all duration-300 
                          ${
                            fileList.length > 0
                              ? "bg-[#EFF6F4] border-[#5E8B7E] shadow-sm animate-pulse-once"
                              : "border-[#D0D8D6] bg-white hover:border-[#A2B1AF] hover:shadow-sm"
                          }`}
                        >
                          <p className="text-sm font-medium text-[#3D4D49] mb-3 flex items-center">
                            <svg
                              className="w-4 h-4 mr-1.5 text-[#5E8B7E]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              ></path>
                            </svg>
                            种子文件 (.torrent)
                          </p>
                          <Upload
                            fileList={fileList}
                            onChange={handleFileChange}
                            beforeUpload={() => false}
                            accept=".torrent"
                            maxCount={1}
                            className="flex justify-center"
                          >
                            <Button
                              icon={<UploadOutlined />}
                              className="morandy-secondary-button"
                              size="large"
                            >
                              选择.torrent文件
                            </Button>
                          </Upload>
                        </div>
                        <div className="flex items-center justify-center">
                          <div className="h-px bg-[#E0E5E3] flex-grow"></div>
                          <div className="px-3 text-sm text-[#8CA29F] font-medium">
                            或者
                          </div>
                          <div className="h-px bg-[#E0E5E3] flex-grow"></div>
                        </div>
                        {/* 普通文件上传 */}
                        <div
                          className={`border border-dashed rounded-xl p-4 transition-all duration-300 
                          ${
                            normalFileList.length > 0
                              ? "bg-[#EFF6F4] border-[#5E8B7E] shadow-sm animate-pulse-once"
                              : "border-[#D0D8D6] bg-white hover:border-[#A2B1AF] hover:shadow-sm"
                          }`}
                        >
                          <p className="text-sm font-medium text-[#3D4D49] mb-3 flex items-center">
                            <svg
                              className="w-4 h-4 mr-1.5 text-[#5E8B7E]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                              ></path>
                            </svg>
                            普通文件
                          </p>
                          <Upload
                            fileList={normalFileList}
                            onChange={handleNormalFileChange}
                            beforeUpload={() => false}
                            maxCount={1}
                            className="flex justify-center"
                          >
                            <Button
                              icon={<UploadOutlined />}
                              className="morandy-primary-button"
                              size="large"
                            >
                              选择普通文件
                            </Button>
                          </Upload>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-[#6B7C79] mt-3 flex items-center">
                      <svg
                        className="w-3.5 h-3.5 mr-1 text-[#A2B1AF]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      请选择一种文件类型上传，二选一即可
                    </div>
                  </div>{" "}
                </div>
                {/* 价格和分类在同一行 */}
                <div
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 slide-in-bottom"
                  style={{ animationDelay: "0.1s" }}
                >
                  {/* 价格 */}
                  <div className="bg-[#F9FAF9] p-5 rounded-xl border border-[#E0E5E3] hover:border-[#5E8B7E] hover:shadow-md transition-all duration-300 h-full flex flex-col justify-between group">
                    <div>
                      <label className="flex items-center text-sm font-semibold text-[#3D4D49] mb-3 group-hover:text-[#5E8B7E] transition-colors">
                        <svg
                          className="w-4 h-4 mr-1.5 text-[#5E8B7E]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                        价格
                      </label>
                      <Input
                        type="number"
                        min={0}
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            price: Number(e.target.value),
                          })
                        }
                        className="w-full"
                        placeholder="请输入价格（0表示免费）"
                        addonAfter={
                          <span className="text-[#5E8B7E] font-medium">
                            积分
                          </span>
                        }
                        size="large"
                      />
                    </div>
                    <div className="text-xs text-[#6B7C79] mt-3 flex items-center">
                      <svg
                        className="w-3.5 h-3.5 mr-1 text-[#A2B1AF]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      输入0表示免费资源
                    </div>
                  </div>

                  {/* 分类 */}
                  <div className="bg-[#F9FAF9] p-5 rounded-xl border border-[#E0E5E3] hover:border-[#5E8B7E] hover:shadow-md transition-all duration-300 h-full flex flex-col justify-between group">
                    <div>
                      <label className="flex items-center text-sm font-semibold text-[#3D4D49] mb-3 group-hover:text-[#5E8B7E] transition-colors">
                        <svg
                          className="w-4 h-4 mr-1.5 text-[#5E8B7E]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                          ></path>
                        </svg>
                        分类
                      </label>
                      <Select
                        value={formData.category}
                        onChange={(value) =>
                          setFormData({ ...formData, category: value })
                        }
                        className="w-full"
                        placeholder="请选择分类"
                        size="large"
                        dropdownClassName="rounded-xl border border-[#E0E5E3] shadow-lg"
                      >
                        {presets.categories.map((category) => (
                          <Option key={category} value={category}>
                            {category}
                          </Option>
                        ))}
                      </Select>
                    </div>
                    <div className="text-xs text-[#6B7C79] mt-3 flex items-center">
                      <svg
                        className="w-3.5 h-3.5 mr-1 text-[#A2B1AF]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      选择合适的分类可以帮助用户更快找到您的资源
                    </div>
                  </div>
                </div>{" "}
              </div>
            </div>{" "}
            {/* 标签 */}
            <div
              className="bg-[#F9FAF9] p-5 rounded-xl border border-[#E0E5E3] hover:border-[#5E8B7E] hover:shadow-md transition-all duration-300 group slide-in-bottom"
              style={{ animationDelay: "0.2s" }}
            >
              <label className="flex items-center text-sm font-semibold text-[#3D4D49] mb-3 group-hover:text-[#5E8B7E] transition-colors">
                <svg
                  className="w-4 h-4 mr-1.5 text-[#5E8B7E]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  ></path>
                </svg>
                标签{" "}
                <span className="text-xs font-normal text-[#8CA29F] ml-1">
                  (最多选择5个)
                </span>
              </label>
              <div className="p-4 bg-white rounded-lg border border-[#E0E5E3] mb-4 shadow-sm">
                <div className="flex flex-wrap gap-2 mb-3">
                  {allTags.map((tag) => (
                    <div
                      key={tag}
                      onClick={() => {
                        const currentTags = [...(formData.tags || [])];
                        if (currentTags.includes(tag)) {
                          // 如果已选中，则移除
                          setFormData({
                            ...formData,
                            tags: currentTags.filter((t) => t !== tag),
                          });
                        } else {
                          // 如果未选中，则添加
                          // 限制最多选择5个标签
                          if (currentTags.length >= 5) {
                            message.warning("最多只能选择5个标签");
                            return;
                          }
                          setFormData({
                            ...formData,
                            tags: [...currentTags, tag],
                          });
                        }
                      }}
                      className={`cursor-pointer px-3 py-1.5 rounded-full text-sm transition-all duration-300 ${
                        (formData.tags || []).includes(tag)
                          ? "bg-gradient-to-r from-[#5E8B7E] to-[#4F7A6F] text-white shadow-md transform hover:scale-105 hover:shadow-lg"
                          : "bg-[#F1F4F3] text-[#556B66] hover:bg-[#E6EAE8] hover:shadow-sm hover:translate-y-[-2px]"
                      }`}
                    >
                      {(formData.tags || []).includes(tag) ? (
                        <span className="flex items-center">
                          <svg
                            className="w-3 h-3 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          {tag}
                        </span>
                      ) : (
                        tag
                      )}
                    </div>
                  ))}
                </div>
              </div>{" "}
              <div className="bg-[#EFF6F4] rounded-lg p-4 border border-[#D5E3DE] shadow-sm">
                <div className="flex items-start">
                  <div className="flex items-center text-sm font-medium text-[#3D4D49] mr-3 mt-1">
                    <svg
                      className="w-4 h-4 mr-1.5 text-[#5E8B7E]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      ></path>
                    </svg>
                    已选标签:
                  </div>
                  {(formData.tags || []).length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {(formData.tags || []).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-[#5E8B7E] to-[#4F7A6F] text-white text-sm rounded-full shadow-md transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFormData({
                                ...formData,
                                tags: (formData.tags || []).filter(
                                  (t) => t !== tag
                                ),
                              });
                            }}
                            className="ml-2 bg-white text-[#5E8B7E] rounded-full w-5 h-5 flex items-center justify-center hover:bg-[#F1F4F3] transition-colors"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center text-sm text-[#8CA29F] italic">
                      <svg
                        className="w-4 h-4 mr-1.5 text-[#A2B1AF]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      未选择任何标签
                    </div>
                  )}
                </div>
              </div>
              <div className="text-xs text-[#6B7C79] mt-3 flex items-center">
                <svg
                  className="w-3.5 h-3.5 mr-1 text-[#A2B1AF]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                添加标签有助于其他用户更容易找到您的资源
              </div>
            </div>{" "}
            {/* 描述 */}
            <div
              className="bg-[#F9FAF9] p-5 rounded-xl border border-[#E0E5E3] hover:border-[#5E8B7E] hover:shadow-md transition-all duration-300 group slide-in-bottom"
              style={{ animationDelay: "0.3s" }}
            >
              <label className="flex items-center text-sm font-semibold text-[#3D4D49] mb-3 group-hover:text-[#5E8B7E] transition-colors">
                <svg
                  className="w-4 h-4 mr-1.5 text-[#5E8B7E]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h7"
                  ></path>
                </svg>
                描述
              </label>
              <TextArea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full"
                rows={5}
                placeholder="资源的详细描述，包括内容简介、格式信息、字幕情况等"
              />
              <div className="text-xs text-[#6B7C79] mt-3 flex items-center">
                <svg
                  className="w-3.5 h-3.5 mr-1 text-[#A2B1AF]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                详细的资源描述能够帮助用户了解资源内容和质量
              </div>
            </div>{" "}
          </fieldset>{" "}
          {/* 成功提示信息 */}
          {publishSuccess && (
            <div className="mb-6 p-5 bg-[#EFF6F4] text-[#3D6259] rounded-xl border border-[#D5E3DE] shadow-sm animate-fadeIn">
              <div className="flex items-center">
                <div className="bg-[#5E8B7E] text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 shadow-sm animate-pulse-once">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <span className="font-medium">
                  种子发布成功！正在准备返回种子列表页面...
                </span>
              </div>
            </div>
          )}{" "}
          {/* 按钮区域 */}
          <div className="flex justify-end gap-4 pt-6 border-t border-[#E0E5E3] mt-8">
            <Button
              onClick={() => router.push("/home/seed")}
              className="morandy-gray-button"
              size="large"
              disabled={uploading || publishSuccess}
            >
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  ></path>
                </svg>
                取消
              </span>
            </Button>
            <Button
              htmlType="submit"
              loading={uploading}
              disabled={publishSuccess}
              className={
                publishSuccess
                  ? "bg-[#5E8B7E] hover:bg-[#4F7A6F] text-white shadow-lg"
                  : "morandy-primary-button"
              }
              size="large"
              icon={
                publishSuccess ? (
                  <svg
                    className="w-5 h-5 mr-1.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                ) : uploading ? null : (
                  <svg
                    className="w-5 h-5 mr-1.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    ></path>
                  </svg>
                )
              }
            >
              {uploading ? (
                <span className="flex items-center">
                  <span className="loading-shimmer h-4 w-4 rounded-full mr-2"></span>
                  发布中...
                </span>
              ) : publishSuccess ? (
                "发布成功"
              ) : (
                "发布种子"
              )}
            </Button>
          </div>
        </form>
      </div>
    </Navbar>
  );
}
