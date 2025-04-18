"use client";

import React, { useState } from "react";

interface ProfileCardProps {
  username: string;
  email: string;
  avatarUrl: string;
  bio: string;
  registrationDate: string;
  updateInformation: (
    username: string,
    avatarUrl: string,
    bio: string
  ) => boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  username,
  email,
  avatarUrl,
  bio,
  registrationDate,
  updateInformation,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editUsername, setUsername] = useState(username);
  const [editBio, setBio] = useState(bio);

  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-md mx-auto">
      <div className="flex items-center gap-4 mb-6">
        {/* 头像 */}
        <img
          src={avatarUrl}
          alt="头像"
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <h2 className="text-xl font-semibold">{username}</h2>
          <p className="text-gray-500 text-sm">{email}</p>
          <p className="text-gray-400 text-sm">注册时间：{registrationDate}</p>
        </div>
      </div>

      {/* 简介 */}
      <div>
        <h3 className="text-lg font-semibold mb-2">简介</h3>
        <p className="text-gray-600">{bio}</p>
      </div>
      <button
        type="submit"
        className="w-full bg-teal-700 text-white py-2 rounded-md mt-5 hover:bg-teal-800 transition-colors"
        onClick={() => setIsOpen(true)}
      >
        修改信息
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg w-full max-w-md">
            <h2 className="text-lg bg-teal-800 text-white rounded font-bold pt-4 pb-4 pl-4">编辑资料</h2>
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">

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
              >
                取消
              </button>
              <button
                onClick={() => {
                  updateInformation(editUsername, avatarUrl, editBio);
                  setIsOpen(false);
                }}
                className="bg-teal-700 text-white px-4 py-2 rounded-md hover:bg-teal-800"
              >
                保存
              </button>
            </div>
          </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default ProfileCard;
