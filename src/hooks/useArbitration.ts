// hooks/useArbitration.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { arbitrationApi } from "@/apinew/arbitrationApi";
import { ArbitrationBounty } from "@/types/bounty";
import { toast } from "react-hot-toast";

/**
 * 仲裁功能相关的 hook
 */
export function useArbitration() {
  const queryClient = useQueryClient();

  // 获取仲裁列表
  const useArbitrationBounties = () =>
    useQuery({
      queryKey: ["arbitration", "bounties"],
      queryFn: async () => {
        try {
          const response = await arbitrationApi.getArbitrationBounties().promise;          // 转换为前端需要的格式
          return response.data.map((item: {
            submission: {
              submissionId: number;
              torrentId?: number;
              refuseReason?: string;
            };
            bounty: {
              bountyTitle: string;
              bountyDescription: string;
              bountyStatus: string;
            };
            creatorName: string;
          }) => ({
            submissionId: item.submission.submissionId,
            torrentId: item.submission?.torrentId,
            name: item.bounty.bountyTitle,
            description: item.bounty.bountyDescription,
            status: item.bounty.bountyStatus,
            publisher: item.creatorName,
            reason: item.submission?.refuseReason,
          } as ArbitrationBounty));
        } catch (error) {
          console.error("获取仲裁列表失败:", error);
          throw error;
        }
      },
      staleTime: 5 * 60 * 1000, // 5分钟缓存
      refetchOnWindowFocus: false,
    });

  // 驳回仲裁
  const rejectArbitrationMutation = useMutation({
    mutationFn: async (submissionId: number) => {
      return arbitrationApi.rejectArbitration(submissionId);
    },
    onSuccess: () => {
      toast.success("已驳回仲裁请求");
      // 重新获取仲裁列表
      queryClient.invalidateQueries({ queryKey: ["arbitration", "bounties"] });
    },
    onError: (error) => {
      console.error("驳回仲裁失败:", error);
      toast.error(
        `操作失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
    },
  });

  // 同意仲裁
  const approveArbitrationMutation = useMutation({
    mutationFn: async (submissionId: number) => {
      return arbitrationApi.approveArbitration(submissionId);
    },
    onSuccess: () => {
      toast.success("已同意仲裁请求");
      // 重新获取仲裁列表
      queryClient.invalidateQueries({ queryKey: ["arbitration", "bounties"] });
    },
    onError: (error) => {
      console.error("同意仲裁失败:", error);
      toast.error(
        `操作失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
    },
  });

  return {
    useArbitrationBounties,
    rejectArbitrationMutation,
    approveArbitrationMutation,
  };
}
