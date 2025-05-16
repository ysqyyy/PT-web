"use client";

import DashboardLayout from "../../../../components/DashboardLayout";
import ProfileCard from "../../../../components/user/profile/ProfileCard";
import MessageList from "../../../../components/user/profile/MessageList";

function updateInformation(username: string, avatarUrl: string, bio: string) {
  user.username = username;
  user.avatarUrl = avatarUrl;
  user.bio = bio;
  return true;
}
const user = {
  username: "John Doe",
  email: "johndoe@example.com",
  avatarUrl: "/avatar.png",
  bio: "我是一个开发者，喜欢编程和学习新技术。",
  registrationDate: "2025-04-15",
};
export default function ProfilePage() {
  return (
    <DashboardLayout title="我的资料">
      <div className="flex">
        <div>
          <ProfileCard
            username={user.username}
            email={user.email}
            avatarUrl={user.avatarUrl} // 头像图片路径
            bio={user.bio}
            registrationDate={user.registrationDate}
            updateInformation={updateInformation}
          />
        </div>
        <div className="ml-100">
          <MessageList />
        </div>
      </div>
    </DashboardLayout>
  );
}
