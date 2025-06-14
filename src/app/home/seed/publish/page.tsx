"use client";
import React, { useState } from "react";
import Navbar from "../../../../components/Navbar";
import { useRouter } from "next/navigation";
import { Upload, Button, message, Input, Select } from "antd";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { UploadOutlined } from "@ant-design/icons"; // 移除了 PlusOutlined
import { publishSeed } from "@/api/seed";
import { publishSeedData } from "@/types/seed";
import { BUTTON_STYLES } from "@/constants/buttonStyles";
import { tagMap } from "@/constants/tags";
const { TextArea } = Input;
const { Option } = Select;

export default function SeedPublish() {
  const router = useRouter();  const [formData, setFormData] = useState<publishSeedData>({
    name: "",
    description: "",
    // imgUrl: "", // 图片上传已注释
    tags: [], // 确保初始化为空数组而不是 undefined
    price: 0,
    category: "电影",
  });
  const [fileList, setFileList] = useState<UploadFile[]>([]);
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
    if (fileList.length === 0) {
      message.error("请上传种子文件");
      return;
    }
    if (!formData.name) {
      message.error("请填写种子名称");
      return;
    }
    setUploading(true);
    try {
      const file = fileList[0]?.originFileObj;
      if (!file) {
        message.error("文件上传失败");
        return;
      }
      const res = await publishSeed(file, formData);
      //返回值判断
      if (res.success) {
        setPublishSuccess(true);
        message.success("种子发布成功，即将返回种子列表页面");

        // 显示全局加载进度条（如果您的项目中使用了 NProgress 或类似库）
        // NProgress.start();

        // 添加短暂延迟，让用户能够看到成功消息
        setTimeout(() => {
          router.push("/home/seed");
        }, 1500);
      } else {
        message.error("种子发布失败");
      }
    } catch (error) {
      console.error("种子发布失败:", error);
      message.error("种子发布失败");
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
  };

  return (
    <Navbar name="种子中心">
      {" "}
      <style jsx global>{`
        /* 图片上传相关样式已注释
        .upload-picture-card-wrapper .ant-upload-select {
          width: 150px !important;
          height: 150px !important;
        }
        .upload-picture-card-wrapper .ant-upload-list-item {
          width: 150px !important;
          height: 150px !important;
        }
        */
        .custom-primary-button {
          background-color: #0f766e !important;
          border-color: #0f766e !important;
          color: white !important;
          padding: 8px 32px !important;
          height: auto !important;
        }
        .custom-primary-button:hover {
          background-color: #134e4a !important;
          border-color: #134e4a !important;
        }
        .custom-gray-button {
          background-color: #6b7280 !important;
          border-color: #6b7280 !important;
          color: white !important;
          padding: 8px 32px !important;
          height: auto !important;
        }
        .custom-gray-button:hover {
          background-color: #4b5563 !important;
          border-color: #4b5563 !important;
        }
      `}</style>{" "}
      <div className="bg-white rounded-lg shadow-lg p-8">
        {" "}
        <h1 className="text-2xl font-bold mb-8 text-teal-700 pb-2 border-b border-gray-200">
          发布种子
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <fieldset disabled={uploading || publishSuccess}>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* 名称 */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-teal-500 transition-all duration-300 h-full flex flex-col justify-between">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        名称 <span className="text-red-500">*</span>
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
                    <div className="text-xs text-gray-500 mt-2">
                      清晰、简洁的名称有助于用户发现资源
                    </div>
                  </div>
                  {/* 文件上传区域 */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-teal-500 transition-all duration-300 h-full flex flex-col justify-between">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        种子文件 <span className="text-red-500">*</span>
                      </label>
                      <Upload
                        fileList={fileList}
                        onChange={handleFileChange}
                        beforeUpload={() => false}
                        accept=".torrent"
                        maxCount={1}
                      >
                        <Button
                          icon={<UploadOutlined />}
                          className={`${BUTTON_STYLES.COLORS.secondary.bg} ${BUTTON_STYLES.COLORS.secondary.hover} text-white`}
                          size="large"
                        >
                          选择.torrent文件
                        </Button>
                      </Upload>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      请选择.torrent格式的种子文件
                    </div>
                  </div>
                </div>

                {/* 价格和分类在同一行 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* 价格 */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-teal-500 transition-all duration-300 h-full flex flex-col justify-between">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                        addonAfter="积分"
                        size="large"
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      输入0表示免费资源
                    </div>
                  </div>

                  {/* 分类 */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-teal-500 transition-all duration-300 h-full flex flex-col justify-between">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                      >
                        {presets.categories.map((category) => (
                          <Option key={category} value={category}>
                            {category}
                          </Option>
                        ))}
                      </Select>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      选择合适的分类可以帮助用户更快找到您的资源
                    </div>
                  </div>
                </div>
              </div>{" "}
              {/* 右侧封面图片（占1列） - 已注释 */}
              {/* <div className="md:row-span-2 flex flex-col justify-start h-full">
              <div className="border border-gray-200 rounded-lg hover:border-teal-500 transition-all duration-300 flex flex-col items-center justify-center h-full p-4 bg-gray-50">
                <Upload
                  listType="picture-card"
                  fileList={
                    formData.imgUrl
                      ? [
                          {
                            uid: "-1",
                            name: "image.png",
                            status: "done",
                            url: formData.imgUrl,
                          },
                        ]
                      : []
                  }
                  beforeUpload={(file) => {
                    const isImage = file.type.startsWith("image/");
                    if (!isImage) {
                      message.error("只能上传图片文件!");
                      return false;
                    }

                    // 将图片转换为 Base64
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => {
                      setFormData({
                        ...formData,
                        imgUrl: reader.result as string,
                      });
                    };
                    return false;
                  }}
                  onRemove={() => {
                    setFormData({ ...formData, imgUrl: "" });
                  }}
                  className="upload-picture-card-wrapper"
                >
                  {!formData.imgUrl && (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <PlusOutlined style={{ fontSize: "24px" }} />
                      <div style={{ marginTop: 8 }}>上传封面</div>
                    </div>
                  )}
                </Upload>
                <p className="text-xs text-gray-500 mt-4 text-center">
                  添加一张高质量的封面图能够提升资源的吸引力
                </p>
              </div>
            </div> */}
            </div>            {/* 标签 */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-teal-500 transition-all duration-300">              <label className="block text-sm font-semibold text-gray-700 mb-2">
                标签 <span className="text-xs font-normal text-gray-500">(最多选择5个)</span>
              </label>
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
                    className={`cursor-pointer px-3 py-1.5 rounded-full text-sm ${
                      (formData.tags || []).includes(tag)
                        ? "bg-teal-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    } transition-colors duration-200`}
                  >
                    {tag}
                  </div>
                ))}
              </div>
              <div className="flex items-center mt-3">
                <div className="text-sm text-gray-500 mr-2">已选标签:</div>
                {(formData.tags || []).length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {(formData.tags || []).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 bg-teal-50 text-teal-700 text-xs rounded-md"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              tags: (formData.tags || []).filter((t) => t !== tag),
                            });
                          }}
                          className="ml-1 text-teal-500 hover:text-teal-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-gray-400">未选择任何标签</span>
                )}
              </div>
              <div className="text-xs text-gray-500 mt-3">
                添加标签有助于其他用户更容易找到您的资源
              </div>
            </div>
            {/* 描述 */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-teal-500 transition-all duration-300">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
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
            </div>{" "}
          </fieldset>

          {/* 成功提示信息 */}
          {publishSuccess && (
            <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
              <div className="flex items-center">
                <span className="mr-2 text-lg">✓</span>
                <span>种子发布成功！正在准备返回种子列表页面...</span>
              </div>
            </div>
          )}

          {/* 按钮区域 */}
          <div className="flex justify-end gap-4 pt-6">
            <Button
              onClick={() => router.push("/home/seed")}
              className="custom-gray-button"
              size="large"
              disabled={uploading || publishSuccess}
            >
              取消
            </Button>
            <Button
              htmlType="submit"
              loading={uploading}
              disabled={publishSuccess}
              className={`${
                publishSuccess
                  ? "bg-green-600 hover:bg-green-700"
                  : "custom-primary-button"
              }`}
              size="large"
              icon={publishSuccess ? <span className="mr-2">✓</span> : null}
            >
              {uploading ? "发布中..." : publishSuccess ? "发布成功" : "发布"}
            </Button>
          </div>
        </form>
      </div>
    </Navbar>
  );
}
