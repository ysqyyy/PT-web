import { UserProfile } from "@/types/user";
import Image from 'next/image';

// 用户等级标签映射
const LEVEL_LABELS: Record<number, { label: string; color: string }> = {
  0: { label: "新手", color: "bg-gray-100 text-gray-600" },
  1: { label: "初级用户", color: "bg-green-100 text-green-600" },
  2: { label: "中级用户", color: "bg-blue-100 text-blue-600" },
  3: { label: "高级用户", color: "bg-purple-100 text-purple-600" },
  4: { label: "专家", color: "bg-yellow-100 text-yellow-600" },
  5: { label: "大师", color: "bg-red-100 text-red-600" },
  6: { label: "传奇", color: "bg-teal-100 text-teal-600" },
  7: { label: "神话", color: "bg-pink-100 text-pink-600" },
};

interface UserProfileCardProps {
  userProfile: UserProfile;
  onEditClick?: () => void;
  onPasswordClick?: () => void;
  isLoading?: boolean;
}

export default function UserProfileCard({
  userProfile,
  onEditClick,
  onPasswordClick,
  isLoading = false,
}: UserProfileCardProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "未知";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (err) {
      console.error("日期格式错误:", dateString, err);
      return dateString;
    }
  };

  // 获取用户等级标签和颜色
  const levelInfo = LEVEL_LABELS[userProfile.level] || {
    label: `Lv.${userProfile.level}`,
    color: "bg-gray-100 text-gray-600",
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow p-6 animate-pulse">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-gray-200"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-3 bg-gray-200 rounded w-48"></div>
            <div className="h-3 bg-gray-200 rounded w-40"></div>
          </div>
        </div>
        <div className="space-y-2 mt-4">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-full"></div>
        </div>
        <div className="mt-6 h-10 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-xl shadow p-6 transition-all hover:shadow-md">
      {/* 头部：头像和基本信息 */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <Image
            src={userProfile.avatarUrl || "/default-avatar.svg"}
            alt={`${userProfile.username}的头像`}
            width={80}
            height={80}
            className="w-20 h-20 rounded-full object-cover border-2 border-teal-100 shadow-md"
            onError={(e) => {
              // TypeScript 类型断言更安全的方式
              const imgElement = e.target as HTMLImageElement;
              imgElement.src = "/default-avatar.svg";
            }}
          />
          <span
            className={`absolute bottom-0 right-0 px-2 py-1 text-xs font-medium rounded-full ${levelInfo.color} shadow-sm`}
          >
            {levelInfo.label}
          </span>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            {userProfile.username}
          </h2>
          <p className="text-gray-500 text-sm flex items-center mt-1">
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
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            {userProfile.email}
          </p>
          <p className="text-gray-400 text-sm flex items-center">
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            注册于 {formatDate(userProfile.registrationDate)}
          </p>
        </div>
      </div>      {/* 用户简介 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-700 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 text-teal-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          个人简介
        </h3>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          {userProfile.bio ? (
            <p className="text-gray-700 whitespace-pre-line">
              {userProfile.bio}
            </p>
          ) : (
            <p className="text-gray-400 italic">
              这个人很懒，还没有填写个人简介...
            </p>
          )}
        </div>
      </div>      {/* 用户详细信息 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
          <p className="text-sm text-gray-500 mb-1">用户ID</p>
          <p className="font-medium text-gray-700">{userProfile.id}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
          <p className="text-sm text-gray-500 mb-1">用户等级</p>
          <p className="font-medium text-gray-700">
            <span
              className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${levelInfo.color} shadow-sm`}
            >
              {levelInfo.label}
            </span>
          </p>
        </div>
      </div>      
      {/* 编辑按钮 */}
      {onEditClick && (
        <div className="space-y-3">
          <button
            type="button"
            className="w-full cursor-pointer bg-gradient-to-r from-[#5E8B7E] to-[#4F7A6F] text-white py-3 rounded-lg shadow-md hover:shadow-lg hover:from-[#4F7A6F] hover:to-[#3D685F] transition-all duration-300 flex items-center justify-center"
            onClick={onEditClick}
          >
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
            修改个人信息
          </button>
          
          {/* 修改密码按钮 */}
          {onPasswordClick && (
            <button
              type="button"
              className="w-full cursor-pointer border-2 border-[#5E8B7E] text-[#5E8B7E] bg-white py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
              onClick={onPasswordClick}
            >
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
            </button>
          )}
        </div>
      )}
    </div>
  );
}
