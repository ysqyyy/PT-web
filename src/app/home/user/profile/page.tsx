"use client";
import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import DashboardLayout from "@/components/DashboardLayout";
import Navbar from "@/components/Navbar";
import UserProfileCard from "@/components/user/UserProfileCard";
import ImageUpload from "@/components/user/ImageUpload";
import BeginnerHandbook from "@/components/user/BeginnerHandbook";
import { useUser } from "@/hooks/useUser";

export default function ProfilePage() {
  // 使用React Query封装的用户相关hook
  const {
    useUserProfile,
    updateProfileMutation,
    uploadAvatarMutation,
    updatePasswordMutation,
  } = useUser();
  const { data: userProfile, isLoading, error } = useUserProfile();

  // 编辑资料相关状态
  const [isOpen, setIsOpen] = useState(false);
  const [editUsername, setUsername] = useState("");
  const [editBio, setBio] = useState("");
  const [editAvatarFile, setEditAvatarFile] = useState<File | null>(null);
  const [editAvatarPreview, setEditAvatarPreview] = useState("");

  // 修改密码相关状态
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // 打开编辑表单并初始化数据
  const handleOpenEditForm = () => {
    if (userProfile) {
      setUsername(userProfile.username);
      setBio(userProfile.bio);
      setEditAvatarPreview(userProfile.avatarUrl || "/default-avatar.svg");
      setIsOpen(true);
    }
  };
  // 处理头像上传预览
  const handleAvatarChange = (file: File | null, previewUrl: string) => {
    setEditAvatarFile(file);
    setEditAvatarPreview(previewUrl);
  };

  // 保存修改信息
  const handleSaveProfile = async () => {
    if (!userProfile) return;

    // 如果有选择新头像，先上传头像
    let avatarUrl = userProfile.avatarUrl;
    if (editAvatarFile) {
      // 使用uploadAvatarMutation上传头像
      const response = await uploadAvatarMutation.mutateAsync(editAvatarFile);
      avatarUrl = response;
    }

    await updateProfileMutation.mutateAsync({
      username: editUsername,
      avatarUrl,
      bio: editBio,
    });
    setIsOpen(false);
  };
  // 处理修改密码
  const handleUpdatePassword = async () => {
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

    // 使用updatePasswordMutation修改密码
    await updatePasswordMutation.mutateAsync({
      oldPassword,
      newPassword,
    });

    setIsPasswordOpen(false);
    // 清空密码字段
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <Navbar name="个人中心">
      <Toaster position="top-center" />
      <DashboardLayout title="我的资料">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">正在加载用户资料...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-red-500">获取用户资料失败，请稍后重试</p>
          </div>
        ) : userProfile ? (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3">
              {/* 使用新的用户资料卡片组件 */}
              <UserProfileCard
                userProfile={userProfile}
                onEditClick={handleOpenEditForm}
                onPasswordClick={() => setIsPasswordOpen(true)}
                isLoading={isLoading}
              />
            </div>
            <div className="w-full md:w-2/3">
              {/* 新手手册组件 */}
              <div className="bg-white rounded-xl shadow p-6 transition-all hover:shadow-md">
                <BeginnerHandbook />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">未找到用户资料</p>
          </div>
        )}
      </DashboardLayout>{" "}
      {/* 编辑资料弹窗 */}
      {isOpen && userProfile && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: "rgba(0, 0, 0, 0.6)" }}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
            <div className="bg-gradient-to-r from-[#5E8B7E] to-[#4F7A6F] text-white rounded-t-xl py-4 px-6 flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center">
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                编辑资料
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white cursor-pointer hover:text-gray-200 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {/* 添加头像上传组件 */}
                <div className="flex flex-col items-center mb-4">
                  <ImageUpload
                    initialImageUrl={editAvatarPreview}
                    onImageChange={handleAvatarChange}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    用户名
                  </label>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    placeholder="请输入用户名"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    个人简介
                  </label>
                  <textarea
                    value={editBio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    placeholder="请输入个人简介"
                  ></textarea>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-5 py-2.5 rounded-lg cursor-pointer border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
                    disabled={
                      updateProfileMutation.isPending ||
                      uploadAvatarMutation.isPending
                    }
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className={`bg-gradient-to-r cursor-pointer from-[#5E8B7E] to-[#4F7A6F] text-white px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg hover:from-[#4F7A6F] hover:to-[#3D685F] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 ${
                      updateProfileMutation.isPending ||
                      uploadAvatarMutation.isPending
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={
                      updateProfileMutation.isPending ||
                      uploadAvatarMutation.isPending
                    }
                  >
                    {updateProfileMutation.isPending ||
                    uploadAvatarMutation.isPending
                      ? "保存中..."
                      : "保存"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}{" "}
      {/* 修改密码弹窗 */}
      {isPasswordOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: "rgba(0, 0, 0, 0.6)" }}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
            <div className="bg-gradient-to-r from-[#5E8B7E] to-[#4F7A6F] text-white rounded-t-xl py-4 px-6 flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center">
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
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                修改密码
              </h2>
              <button
                onClick={() => setIsPasswordOpen(false)}
                className="text-white cursor-pointer hover:text-gray-200 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    当前密码
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      placeholder="请输入当前密码"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    新密码
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      placeholder="请输入新密码"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    确认密码
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      placeholder="请再次输入新密码"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setIsPasswordOpen(false)}
                    className="px-5 py-2.5 cursor-pointer rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
                    disabled={updatePasswordMutation.isPending}
                  >
                    取消
                  </button>
                  <button
                    onClick={handleUpdatePassword}
                    className={`bg-gradient-to-r cursor-pointer from-[#5E8B7E] to-[#4F7A6F] text-white px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg hover:from-[#4F7A6F] hover:to-[#3D685F] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 ${
                      updatePasswordMutation.isPending
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={updatePasswordMutation.isPending}
                  >
                    {updatePasswordMutation.isPending ? "保存中..." : "保存"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Navbar>
  );
}
