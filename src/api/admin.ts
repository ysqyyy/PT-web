import request from "@/utils/request";

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

// 获取所有用户
export const getAllUsers = async (): Promise<UserItem[]> => {
    const res = await request.get("http://localhost:8080/api/admin/users");
    return res.data || [];
};

// 设置用户等级
export const setUserLevel = async (userId: number, level: number) => {
    return request.post("http://localhost:8080/api/admin/user/level", { userId, level });
};

// 获取所有待处理举报
export const getAllReports = async (): Promise<ReportItem[]> => {
    const res = await request.get("http://localhost:8080/api/values/comments/report/pending");
    return res.data || [];
};

// 处理举报
export const handleReport = async (reportId: number, userId: number, commentId: number) => {
    return request.post("http://localhost:8080/api/values/comments/report/handle", {
        reportId,
        userId,
        commentId,
    });
};