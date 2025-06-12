// 定义用户资料相关的类型
export interface UserProfile {
  id: number;             // 用户ID
  username: string;       // 用户名
  email: string;          // 邮箱
  avatarUrl: string;      // 头像URL
  bio: string;            // 个人简介
  registrationDate: string; // 注册日期
  level: number;         // 用户等级
}
// 定义用户信息相关的类型
export interface UserInfo {
  user_id: number;
  user_name: string;
  avatar_url: string;
  role: string;
  user_status: string | null;
  user_level: number;
}

// 定义用户消息相关的类型
export interface UserMessage {
  id: number;             // 消息ID
  content: string;        // 消息内容
  date: string;           // 消息日期
  read: boolean;          // 是否已读
}

// 更新用户资料请求参数
export interface UpdateProfileParams {
  username: string;
  avatarUrl: string;
  bio: string;
}
