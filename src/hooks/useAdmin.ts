// hooks/useAdmin.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/apinew/adminApi";
import { toast } from "react-hot-toast";
/**
 * 管理员功能相关的 hook，包含用户管理、举报管理、查看数据分析等功能
 */
export function useAdmin() {
  const queryClient = useQueryClient();

  // 获取所有用户
  const useAllUsers = () =>
    useQuery({
      queryKey: ["admin", "users"],
      queryFn: async () => {
        try {
          const response = await adminApi.getAllUsers().promise;
          return response.data || [];
        } catch (error) {
          console.error("获取用户列表失败:", error);
          throw error;
        }
      },
      staleTime: 5 * 60 * 1000, // 5分钟缓存
      refetchOnWindowFocus: false,
    });

  // 设置用户等级
  const setUserLevelMutation = useMutation({
    mutationFn: async ({
      userId,
      level,
    }: {
      userId: number;
      level: number;
    }) => {
      return adminApi.setUserLevel(userId, level);
    },
    onSuccess: () => {
      toast.success("用户等级设置成功");
      // 重新获取用户列表
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (error) => {
      console.error("设置用户等级失败:", error);
      toast.error(
        `设置失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
    },
  });

  // 获取所有待处理举报
  const useAllReports = () =>
    useQuery({
      queryKey: ["admin", "reports"],
      queryFn: async () => {
        try {
          const response = await adminApi.getAllReports().promise;
          return response.data || [];
        } catch (error) {
          console.error("获取举报列表失败:", error);
          throw error;
        }
      },
      staleTime: 5 * 60 * 1000, // 5分钟缓存
      refetchOnWindowFocus: false,
    });

  // 处理举报
  const handleReportMutation = useMutation({
    mutationFn: async ({
      reportId,
      userId,
      commentId,
    }: {
      reportId: number;
      userId: number;
      commentId: number;
    }) => {
      return adminApi.handleReport(reportId, userId, commentId);
    },
    onSuccess: () => {
      toast.success("举报处理成功");
      // 重新获取举报列表
      queryClient.invalidateQueries({ queryKey: ["admin", "reports"] });
    },
    onError: (error) => {
      console.error("处理举报失败:", error);
      toast.error(
        `处理失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
    },
  });

  // 检查是否为管理员
  const isAdmin = (userRole?: string) => {
    return userRole === "admin" || userRole === "super_admin";
  };

  // 获取数据分析仪表盘数据
  const useAnalyticsDashboard = () =>
    useQuery({
      queryKey: ["admin", "analytics"],
      queryFn: async () => {
        try {
          const response = await adminApi.getAnalyticsDashboard().promise;
          return (
            response || {
              totalDownload: 0,
              userMonthlyUpload: [0, 0, 0, 0],
              userMonthlyDownload: [0, 0, 0, 0],
              allMonthlyUpload: [0, 0, 0, 0],
              allMonthlyDownload: [0, 0, 0, 0],
              totalTorrentCount: 0,
              activeUserCount: 0,
            }
          );
        } catch (error) {
          console.error("获取数据分析失败:", error);
          throw error;
        }
      },
      staleTime: 10 * 60 * 1000, // 10分钟缓存
      refetchOnWindowFocus: false,
    });

  return {
    useAllUsers,
    setUserLevelMutation,
    useAllReports,
    handleReportMutation,
    isAdmin,
    useAnalyticsDashboard,
  };
}
