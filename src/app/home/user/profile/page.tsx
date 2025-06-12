"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import Navbar from "@/components/Navbar";
import UserProfileCard from "@/components/user/UserProfileCard";
import ImageUpload from "@/components/user/ImageUpload";
import { getUserProfile, updateUserProfile, getUserMessages, updateUserPassword } from "@/api/user";
import { uploadAvatar } from "@/api/upload";
import type {
  UserProfile,
  UpdateProfileParams,
  UserMessage,
} from "@/types/user";
import { toast, Toaster } from "react-hot-toast";

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // 编辑资料相关状态
  const [isOpen, setIsOpen] = useState(false);
  const [editUsername, setUsername] = useState("");
  const [editBio, setBio] = useState("");
  const [editAvatarFile, setEditAvatarFile] = useState<File | null>(null);
  const [editAvatarPreview, setEditAvatarPreview] = useState("");  const [isUpdating, setIsUpdating] = useState(false);

  // 修改密码相关状态
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // 消息列表相关状态
  const [messages, setMessages] = useState<UserMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState<boolean>(true);
  const [messagesError, setMessagesError] = useState<string | null>(null);
  useEffect(() => {
    fetchUserProfile();
    fetchMessages();
  }, []);
  // 获取用户资料
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const profile = await getUserProfile();
      setUserProfile(profile);

      // 初始化编辑表单的值
      setUsername(profile.username);
      setBio(profile.bio);
      setEditAvatarPreview(profile.avatarUrl || "/default-avatar.svg");

      setError(null);
    } catch (err) {
      console.error("获取用户资料失败:", err);
      setError("获取用户资料失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };
  // 获取用户消息
  const fetchMessages = async () => {
    try {
      setMessagesLoading(true);
      const data = await getUserMessages();
      setMessages(data);
      setMessagesError(null);
    } catch (err) {
      console.error("获取消息失败:", err);
      setMessagesError("获取消息失败，请稍后重试");
    } finally {
      setMessagesLoading(false);
    }
  };
  // 处理头像上传预览
  const handleAvatarChange = (file: File | null, previewUrl: string) => {
    setEditAvatarFile(file);
    console.log("选择的头像文件:", file);
    // 仍然保存预览URL，用于UI显示，但不再用于实际更新
    setEditAvatarPreview(previewUrl);
  };  // 保存修改信息
  const handleSaveProfile = async () => {
    if (!userProfile) return;

    try {
      setIsUpdating(true);

      // 如果有选择新头像，先上传头像
      let avatarUrl = userProfile.avatarUrl;
      if (editAvatarFile) {
        try {
          console.log("开始上传头像文件:", editAvatarFile);
          const url = await uploadAvatar(editAvatarFile);
          avatarUrl = url;
          toast.success("头像上传成功");
        } catch (err) {
          console.error("上传头像失败:", err);
          toast.error("头像上传失败，请稍后重试");
        }
      }

      const updateParams: UpdateProfileParams = {
        username: editUsername,
        avatarUrl: avatarUrl,
        bio: editBio,
      };
      await updateUserProfile(updateParams);
      toast.success("资料更新成功");
      setIsOpen(false);
      // 重新获取用户资料以更新界面
      fetchUserProfile();
    } catch (error) {
      console.error("更新资料失败:", error);
      toast.error("更新资料失败，请稍后重试");
    } finally {
      setIsUpdating(false);
    }
  };

  // 处理修改密码
  const handleUpdatePassword = async () => {
    // 表单验证
    console.log("当前密码:", oldPassword);
    if (!oldPassword) {
      toast.error("请输入当前密码");
      return;
    }
    if (!newPassword) {
      toast.error("请输入新密码");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("两次输入的新密码不一致");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("新密码长度不能少于6位");
      return;
    }

    try {
      setIsUpdatingPassword(true);
      await updateUserPassword(oldPassword, newPassword);
      toast.success("密码修改成功");
      setIsPasswordOpen(false);
      // 清空密码字段
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("修改密码失败:", error);
      toast.error("修改密码失败，请检查当前密码是否正确");
    } finally {
      setIsUpdatingPassword(false);
    }
  };  return (
    <Navbar name="个人中心">
      <Toaster position="top-center" />
      <DashboardLayout title="我的资料">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">正在加载用户资料...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-red-500">{error}</p>
          </div>
        ) : userProfile ? (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3">              {/* 使用新的用户资料卡片组件 */}
              <UserProfileCard
                userProfile={userProfile}
                onEditClick={() => setIsOpen(true)}
                onPasswordClick={() => setIsPasswordOpen(true)}
                isLoading={loading}
              />
            </div>
            <div className="w-full md:w-2/3">
              {/* 消息列表 */}
              <div className="bg-white p-6 rounded-xl shadow-lg max-w-2xl mx-auto">
                <h2 className="text-xl font-semibold mb-4">系统消息</h2>

                {/* 加载状态 */}
                {messagesLoading ? (
                  <div className="text-center py-4">加载中...</div>
                ) : messagesError ? (
                  <div className="text-center py-4 text-red-500">
                    {messagesError}
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {messages.length > 0 ? (
                      messages.map((message) => (
                        <li
                          key={message.id}
                          className={`p-4 rounded-lg shadow ${
                            message.read
                              ? "bg-gray-100"
                              : "bg-blue-50 border-l-4 border-blue-500"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <p className="text-gray-700">{message.content}</p>
                            <span className="text-xs text-gray-500">
                              {message.date}
                            </span>
                          </div>
                        </li>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        没有系统消息。
                      </div>
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">未找到用户资料</p>
          </div>
        )}
      </DashboardLayout>

      {/* 编辑资料弹窗 */}
      {isOpen && userProfile && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: "rgba(0, 0, 0, 0.4)" }}
        >
          <div className="bg-white rounded shadow-lg w-full max-w-md">
            <h2 className="text-lg bg-teal-800 text-white rounded-t font-bold pt-4 pb-4 pl-4">
              编辑资料
            </h2>
            <div className="bg-white p-6 rounded-b shadow-lg w-full max-w-md">
              <div className="space-y-6">
                {/* 添加头像上传组件 */}
                <div className="flex flex-col items-center mb-4">
                  <ImageUpload
                    initialImageUrl={editAvatarPreview}
                    onImageChange={handleAvatarChange}
                  />
                </div>

                <div className="flex items-center justify-center">
                  <label className="whitespace-nowrap flex:2 text-sm font-bold mr-5">
                    用户名
                  </label>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setUsername(e.target.value)}
                    className="flex:3 w-full p-2 border rounded-md"
                  />
                </div>
                <div className="flex items-center justify-center">
                  <label className="whitespace-nowrap block text-sm font-bold mr-5">
                    简介
                  </label>
                  <textarea
                    rows={3}
                    value={editBio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-600 hover:underline"
                  disabled={isUpdating}
                >
                  取消
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="bg-teal-700 text-white px-4 py-2 rounded-md hover:bg-teal-800 disabled:bg-teal-300"
                  disabled={isUpdating}
                >
                  {isUpdating ? "保存中..." : "保存"}
                </button>
              </div>
            </div>          </div>
        </div>
      )}

      {/* 修改密码弹窗 */}
      {isPasswordOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: "rgba(0, 0, 0, 0.4)" }}
        >
          <div className="bg-white rounded shadow-lg w-full max-w-md">
            <h2 className="text-lg bg-teal-800 text-white rounded-t font-bold pt-4 pb-4 pl-4">
              修改密码
            </h2>
            <div className="bg-white p-6 rounded-b shadow-lg w-full max-w-md">
              <div className="space-y-6">
                <div className="flex items-center justify-center">
                  <label className="whitespace-nowrap flex:2 text-sm font-bold mr-5">
                    当前密码
                  </label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="flex:3 w-full p-2 border rounded-md"
                    placeholder="请输入当前密码"
                  />
                </div>
                <div className="flex items-center justify-center">
                  <label className="whitespace-nowrap flex:2 text-sm font-bold mr-5">
                    新密码
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="flex:3 w-full p-2 border rounded-md"
                    placeholder="请输入新密码"
                  />
                </div>
                <div className="flex items-center justify-center">
                  <label className="whitespace-nowrap block text-sm font-bold mr-5">
                    确认密码
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    placeholder="请再次输入新密码"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsPasswordOpen(false)}
                  className="text-gray-600  cursor-pointer hover:underline"
                  disabled={isUpdatingPassword}
                >
                  取消
                </button>
                <button
                  onClick={handleUpdatePassword}
                  className="bg-teal-700 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-teal-800 disabled:bg-teal-300"
                  disabled={isUpdatingPassword}
                >
                  {isUpdatingPassword ? "保存中..." : "保存"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Navbar>
  );
}
