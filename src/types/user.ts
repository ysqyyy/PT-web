// 定义用户资料相关的类型
export interface UserProfile {
  username: string;       // 用户名
  email: string;          // 邮箱
  avatarUrl: string;      // 头像URL
  bio: string;            // 个人简介
  registrationDate: string; // 注册日期
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
