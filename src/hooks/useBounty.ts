import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bountyApi } from '@/apinew/bountyApi';
import toast from 'react-hot-toast';
import { BountyListItem, MyBounty, AppendedBounty, SubmittedBounty } from '@/types/bounty';

/**
 * 悬赏相关的 hook，包含获取悬赏列表、发布悬赏、追加悬赏、提交种子等功能
 */
export function useBounty() {
  const queryClient = useQueryClient();

  // 获取我的悬赏列表
  const useMyBounties = () => 
    useQuery({
      queryKey: ['myBounties'],
      queryFn: async () => {
        try {
          const response = await bountyApi.getMyBounties().promise;
          const data = response;
          const bounties: MyBounty[] = data.map((item: any) => ({
            bountyId: item.bounty?.bountyId, // 追加/取消悬赏用
            torrentId: item.submission?.torrentId, // 下载用
            submissionId: item.submission?.submissionId, // 申请仲裁用
            name: item.bounty?.bountyTitle,
            description: item.bounty?.bountyDescription,
            status: item.bounty?.bountyStatus,
            reward_amount: item.bounty?.rewardAmount,
            total_amount: item.bounty?.totalAmount,
          }));
          return bounties;
        } catch (error) {
          console.error('获取我的悬赏列表失败:', error);
          throw error;
        }
      },
      staleTime: 5 * 60 * 1000, // 5分钟缓存
    });

  // 获取我追加的悬赏列表
  const useMyAppendedBounties = () => 
    useQuery({
      queryKey: ['myAppendedBounties'],
      queryFn: async () => {
        try {
          const response = await bountyApi.getMyAppendedBounties().promise;
          const data = response;
          const bounties: AppendedBounty[] = data.map((item: any) => ({
            bountyId: item.bounty?.bountyId, // 追加悬赏用 提交种子用
            torrentId: item.submission?.torrentId, // 下载用
            submissionId: item.submission?.submissionId,
            name: item.bounty?.bountyTitle,
            description: item.bounty?.bountyDescription,
            status: item.bounty?.bountyStatus,
            contributedAmount: item.contribution?.contributedAmount,
            publisher: item?.creatorName,
          }));
          return bounties;
        } catch (error) {
          console.error('获取我追加的悬赏列表失败:', error);
          throw error;
        }
      },
      staleTime: 5 * 60 * 1000, // 5分钟缓存
    });

  // 获取我提交的悬赏列表
  const useMySubmittedBounties = () => 
    useQuery({
      queryKey: ['mySubmittedBounties'],
      queryFn: async () => {
        try {
          const response = await bountyApi.getMySubmittedBounties().promise;
          const data = response;
          const bounties: SubmittedBounty[] = data.map((item: any) => ({
            bountyId: item.bounty.bountyId,
            torrentId: item.submission.torrentId, // 下载用
            submissionId: item.submission.submissionId,
            name: item.bounty.bountyTitle,
            description: item.bounty.bountyDescription,
            status: item.bounty.bountyStatus,
            publisher: item.creatorName,
            total_amount: item.bounty.totalAmount,
          }));
          return bounties;
        } catch (error) {
          console.error('获取我提交的悬赏列表失败:', error);
          throw error;
        }
      },
      staleTime: 5 * 60 * 1000, // 5分钟缓存
    });

  // 获取所有悬赏列表
  const useBountyList = () => 
    useQuery({
      queryKey: ['bountyList'],
      queryFn: async () => {
        try {
          const response = await bountyApi.getBountyList().promise;
          const data = response;
          const bounties: BountyListItem[] = data.map((item: any) => ({
            bountyId: item.bounty?.bountyId, // 追加悬赏用 提交种子用
            submissionId: item.submission?.submissionId,
            torrentId: item.submission?.torrentId, // 下载用
            name: item.bounty.bountyTitle,
            description: item.bounty.bountyDescription,
            status: item.bounty.bountyStatus,
            total_amount: item.bounty.totalAmount,
            publisher: item.creatorName,
          }));
          return bounties;
        } catch (error) {
          console.error('获取悬赏列表失败:', error);
          throw error;
        }
      },
      staleTime: 3 * 60 * 1000, // 3分钟缓存
    });

  // 追加悬赏的mutation
  const appendBountyMutation = useMutation({
    mutationFn: async ({ bountyId, amount }: { bountyId: number; amount: number }) => {
      return await bountyApi.appendBounty(bountyId, amount).promise;
    },
    onSuccess: () => {
      toast.success('追加悬赏成功');
      // 更新相关查询缓存
      queryClient.invalidateQueries({ queryKey: ['myBounties'] });
      queryClient.invalidateQueries({ queryKey: ['myAppendedBounties'] });
      queryClient.invalidateQueries({ queryKey: ['bountyList'] });
    },
    onError: (error) => {
      console.error('追加悬赏失败:', error);
      toast.error('追加悬赏失败，请稍后重试');
    },
  });

  // 取消悬赏的mutation
  const cancelBountyMutation = useMutation({
    mutationFn: async (bountyId: number) => {
      return await bountyApi.cancelBounty(bountyId).promise;
    },
    onSuccess: () => {
      toast.success('取消悬赏成功');
      // 更新相关查询缓存
      queryClient.invalidateQueries({ queryKey: ['myBounties'] });
      queryClient.invalidateQueries({ queryKey: ['bountyList'] });
    },
    onError: (error) => {
      console.error('取消悬赏失败:', error);
      toast.error('取消悬赏失败，请稍后重试');
    },
  });

  // 确认悬赏的mutation
  const confirmBountyMutation = useMutation({
    mutationFn: async (submissionId: number) => {
      return await bountyApi.confirmBounty(submissionId).promise;
    },
    onSuccess: () => {
      toast.success('确认悬赏成功');
      // 更新相关查询缓存
      queryClient.invalidateQueries({ queryKey: ['myBounties'] });
      queryClient.invalidateQueries({ queryKey: ['mySubmittedBounties'] });
      queryClient.invalidateQueries({ queryKey: ['bountyList'] });
    },
    onError: (error) => {
      console.error('确认悬赏失败:', error);
      toast.error('确认悬赏失败，请稍后重试');
    },
  });

  // 申请仲裁的mutation
  const arbitrateBountyMutation = useMutation({
    mutationFn: async ({ submissionId, reason }: { submissionId: number; reason: string }) => {
      return await bountyApi.arbitrateBounty(submissionId, reason).promise;
    },
    onSuccess: () => {
      toast.success('申请仲裁成功');
      // 更新相关查询缓存
      queryClient.invalidateQueries({ queryKey: ['myBounties'] });
      queryClient.invalidateQueries({ queryKey: ['mySubmittedBounties'] });
    },
    onError: (error) => {
      console.error('申请仲裁失败:', error);
      toast.error('申请仲裁失败，请稍后重试');
    },
  });

  // 发布悬赏的mutation
  const publishBountyMutation = useMutation({
    mutationFn: async ({ 
      title, 
      bounty, 
      description, 
      category, 
      tags 
    }: { 
      title: string; 
      bounty: number; 
      description: string; 
      category: string; 
      tags?: string[] 
    }) => {
      return await bountyApi.publishBounty(title, bounty, description, category, tags).promise;
    },
    onSuccess: () => {
      toast.success('发布悬赏成功');
      // 更新相关查询缓存
      queryClient.invalidateQueries({ queryKey: ['myBounties'] });
      queryClient.invalidateQueries({ queryKey: ['bountyList'] });
    },
    onError: (error) => {
      console.error('发布悬赏失败:', error);
      toast.error('发布悬赏失败，请稍后重试');
    },
  });

  // 提交种子的mutation
  const submitSeedMutation = useMutation({
    mutationFn: async ({ bountyId, seedFile }: { bountyId: number; seedFile: File | null }) => {
      if (!seedFile) {
        throw new Error('请选择种子文件');
      }
      return await bountyApi.submitSeed(bountyId, seedFile);
    },
    onSuccess: () => {
      toast.success('提交种子成功');
      // 更新相关查询缓存
      queryClient.invalidateQueries({ queryKey: ['mySubmittedBounties'] });
      queryClient.invalidateQueries({ queryKey: ['myAppendedBounties'] });
      queryClient.invalidateQueries({ queryKey: ['bountyList'] });
    },
    onError: (error) => {
      console.error('提交种子失败:', error);
      toast.error('提交种子失败，请稍后重试');
    },
  });

  return {
    // 查询钩子
    useMyBounties,
    useMyAppendedBounties,
    useMySubmittedBounties,
    useBountyList,
    
    // Mutation钩子
    appendBountyMutation,
    cancelBountyMutation,
    confirmBountyMutation,
    arbitrateBountyMutation,
    publishBountyMutation,
    submitSeedMutation,
  };
}
