"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import Navbar from "@/components/Navbar";
import { getUserProfile, updateUserProfile, getUserMessages } from "@/api/user";
import type { UserProfile, UpdateProfileParams, UserMessage } from "@/types/user";
import { toast } from "react-hot-toast";

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // 编辑资料相关状态
  const [isOpen, setIsOpen] = useState(false);
  const [editUsername, setUsername] = useState("");
  const [editBio, setBio] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  
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
  
  // 处理保存资料
  const handleSaveProfile = async () => {
    if (!userProfile) return;
    
    try {
      setIsUpdating(true);
      const updateParams: UpdateProfileParams = {
        username: editUsername,
        avatarUrl: userProfile.avatarUrl,
        bio: editBio
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
  };  return (
    <Navbar name="个人中心">
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
            <div className="w-full md:w-1/3">
              {/* 用户资料卡片*/}
              <div className="bg-white rounded-xl shadow p-6 max-w-md mx-auto">
                <div className="flex items-center gap-4 mb-6">
                  {/* 头像 */}
                  <img
                    src={userProfile.avatarUrl}
                    alt="头像"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="text-xl font-semibold">{userProfile.username}</h2>
                    <p className="text-gray-500 text-sm">{userProfile.email}</p>
                    <p className="text-gray-400 text-sm">注册时间：{userProfile.registrationDate}</p>
                  </div>
                </div>

                {/* 简介 */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">简介</h3>
                  <p className="text-gray-600">{userProfile.bio}</p>                </div>
                <button
                  type="submit"
                  className="w-full border border-teal-700 text-teal-700 py-2 rounded-md mt-5 hover:bg-teal-50 transition-colors"
                  onClick={() => setIsOpen(true)}
                >
                  修改信息
                </button>               
               {/* 编辑资料弹窗 */}
                {isOpen && (
                  <div 
                    className="fixed inset-0 flex items-center justify-center z-50"
                    style={{ background: "rgba(0, 0, 0, 0.4)" }}
                  >
                    <div className="bg-white rounded shadow-lg w-full max-w-md">
                      <h2 className="text-lg bg-teal-800 text-white rounded-t font-bold pt-4 pb-4 pl-4">编辑资料</h2>
                      <div className="bg-white p-6 rounded-b shadow-lg w-full max-w-md">

                      <div className="space-y-4">
                        <div className="flex items-center justify-center">
                          <label className="whitespace-nowrap flex:2 text-sm font-bold mr-5">用户名</label>
                          <input
                            type="text"
                            value={editUsername}
                            onChange={(e) => setUsername(e.target.value)}
                            className="flex:3 w-full p-2 border rounded-md"
                          />
                        </div>
                        <div className="flex items-center justify-center">
                          <label className="whitespace-nowrap block text-sm font-bold mr-5">简介</label>
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
                    </div>
                    </div>
                  </div>
                )}
              </div>
            </div>           
             <div className="w-full md:w-2/3">
              {/* 消息列表 */}
              <div className="bg-white p-6 rounded-xl shadow-lg max-w-2xl mx-auto">
                <h2 className="text-xl font-semibold mb-4">系统消息</h2>

                {/* 加载状态 */}
                {messagesLoading ? (
                  <div className="text-center py-4">加载中...</div>
                ) : messagesError ? (
                  <div className="text-center py-4 text-red-500">{messagesError}</div>
                ) : (
                  <ul className="space-y-4">
                    {messages.length > 0 ? (
                      messages.map((message) => (
                        <li 
                          key={message.id} 
                          className={`p-4 rounded-lg shadow ${message.read ? 'bg-gray-100' : 'bg-blue-50 border-l-4 border-blue-500'}`}
                        >
                          <div className="flex justify-between items-start">
                            <p className="text-gray-700">{message.content}</p>
                            <span className="text-xs text-gray-500">{message.date}</span>
                          </div>
                        </li>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500">没有系统消息。</div>
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
    </Navbar>
  );
}