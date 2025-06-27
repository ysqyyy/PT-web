import request from '../utils/request';
import { AnalyticsData } from '@/types/analytics';

// 响应类型定义
export interface UsersResponse {
  code: number;
  message: string;
  data: UserItem[];
}

export interface ReportsResponse {
  code: number;
  message: string;
  data: ReportItem[];
}

export interface ActionResponse {
  code: number;
  message: string;  
  data: {
    success: boolean;
  };
}

export interface ReviewsResponse {
  code: number;
  message: string;
  data: {
    list: Array<{
      torrentId: number;
      torrentName: string;
      torrentDescription: string;
      uploaderName: string;
      uploadTime: string;
    }>;
  };
}

// 用户信息类型
export interface UserItem {
  userId: number;
  userName: string;
  userLevel: number;
  role: string;
  userStatus: string | null;
  createdTime: string | null;
}

// 举报信息类型
export interface ReportItem {
  reportId: number;
  commentId: number;
  commentContent: string;
  reportedUserId: number;
  reportedUserName: string;
  reportedUserStatus: string;
  reason: string;
  createTime: string;
}

// API 层只负责与服务器通信，不处理业务逻辑
export const adminApi = {
  /**
   * 获取所有用户
   */
  getAllUsers: () => 
    request.get<UsersResponse>('/api/admin/users'),
  
  /**
   * 设置用户等级
   * @param userId 用户ID
   * @param level 等级
   */
  setUserLevel: (userId: number, level: number) => 
    request.post<ActionResponse>('/api/admin/user/level', { userId, level }),
  
  /**
   * 获取所有待处理举报
   */
  getAllReports: () => 
    request.get<ReportsResponse>('/api/values/comments/report/pending'),
  
  /**
   * 处理举报
   * @param reportId 举报ID
   * @param userId 用户ID
   * @param commentId 评论ID
   */
  handleReport: (reportId: number, userId: number, commentId: number) => 
    request.post<ActionResponse>('/api/values/comments/report/handle', {
      reportId,
      userId,
      commentId,
    }),
    
  /**
   * 获取数据分析仪表盘数据
   */
  getAnalyticsDashboard: () => 
    request.get<AnalyticsData>('/analyse/summary'),
    
  /**
   * 获取待审核资源列表
   */
  getPendingReviews: () => 
    request.get<ReviewsResponse>('/api/admin/torrents/pending'),
  
  /**
   * 批准资源
   * @param id 资源ID
   */
  approveResource: (id: number) => 
    request.post<ActionResponse>('/api/admin/review', {
      torrentId: id,
      action: "approve"
    }),
  
  /**
   * 拒绝资源
   * @param id 资源ID
   * @param reason 拒绝原因
   */
  rejectResource: (id: number, reason: string) => 
    request.post<ActionResponse>('/api/admin/review', {
      torrentId: id,
      action: "reject",
      reason: reason
    })
};
