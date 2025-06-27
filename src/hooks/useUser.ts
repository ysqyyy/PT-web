// hooks/useUser.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/apinew/userApi";
import { UserProfile, UpdateProfileParams } from "@/types/user";
import { toast } from "react-hot-toast";

/**
 * 用户相关功能的 hook，包含获取用户资料、更新资料、获取消息、修改密码等功能
 */
export function useUser() {
  const queryClient = useQueryClient();

  // 获取用户资料
  const useUserProfile = () =>
    useQuery({
      queryKey: ["userProfile"],
      queryFn: async () => {
        try {
          const response = await userApi.getUserProfile().promise;
          const data = response.data;

          // 转换为 UserProfile 格式
          const userProfile: UserProfile = {
            id: data.user_id || 0,
            username: data.user_name,
            email: data.email,
            bio: data.bio || "",
            avatarUrl: data.avatar_url || "",
            registrationDate: data.created_time || "",
            level: data.level || 0,
          };

          return userProfile;
        } catch (error) {
          console.error("获取用户资料失败:", error);
          throw error;
        }
      },
      staleTime: 5 * 60 * 1000, // 5分钟缓存
      refetchOnWindowFocus: false,
    });

  // 上传头像
  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      const response = await userApi.uploadAvatar(file).promise;
      return response.data;
    },
    onSuccess: (avatarUrl) => {
      toast.success("头像上传成功");
      // 不在这里直接更新用户资料，让调用者决定如何使用上传后的URL
      return avatarUrl;
    },
    onError: (error) => {
      console.error("上传头像失败:", error);
      toast.error(
        `上传失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
      throw error;
    },
  });

  // 更新用户资料
  const updateProfileMutation = useMutation({
    mutationFn: async (params: UpdateProfileParams) => {
      return userApi.updateUserProfile(params);
    },
    onMutate: (params: UpdateProfileParams) => {
      //乐观更新用户资料
      const previousProfile = queryClient.getQueryData<UserProfile>([
        "userProfile",
      ]);
      if (previousProfile) {
        const updatedProfile: UserProfile = {
          ...previousProfile,
          username: params.username,
          avatarUrl: params.avatarUrl,
          bio: params.bio,
        };
        queryClient.setQueryData(["userProfile"], updatedProfile);
      }
    },
    // 成功后重新获取用户资料
    onSuccess: () => {
      toast.success("资料更新成功");
    },
    onError: (error) => {
      console.error("更新用户资料失败:", error);
      // 如果更新失败，回滚到之前的用户资料
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      toast.error(
        `更新失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
    },
  });

  // 修改用户密码
  const updatePasswordMutation = useMutation({
    mutationFn: async ({
      oldPassword,
      newPassword,
    }: {
      oldPassword: string;
      newPassword: string;
    }) => {
      return userApi.updateUserPassword(oldPassword, newPassword);
    },
    onSuccess: () => {
      toast.success("密码修改成功");
    },
    onError: (error) => {
      console.error("修改密码失败:", error);
      toast.error(
        `修改失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
    },
  });

  return {
    useUserProfile,
    uploadAvatarMutation,
    updateProfileMutation,
    updatePasswordMutation,
  };
}
