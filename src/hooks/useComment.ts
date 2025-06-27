import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { commentApi } from "@/apinew/commentApi";
import { Comment, CommentReply } from "@/types/comment";
import toast from "react-hot-toast";

/**
 * 评论相关的 hook，包含获取评论、发表评论、回复评论、点赞评论、举报评论等功能
 */
export function useComment() {
  const queryClient = useQueryClient();

  /**
   * 更新评论的点赞状态（工具函数）
   */
  const updateCommentsLikes = (
    comments: Comment[],
    targetId: number,
    newLikesCount: number,
    newLikedStatus: boolean,
    isReply: boolean = false,
    parentId?: number
  ): Comment[] => {
    // 如果是回复的点赞状态更新
    if (isReply && parentId) {
      return comments.map((comment) =>
        comment.id === parentId
          ? {
              ...comment,
              replies: (comment.replies || []).map((reply) =>
                reply.id === targetId
                  ? { ...reply, likes: newLikesCount, isLiked: newLikedStatus }
                  : reply
              ),
            }
          : comment
      );
    }

    // 如果是评论的点赞状态更新
    return comments.map((comment) =>
      comment.id === targetId
        ? { ...comment, likes: newLikesCount, isLiked: newLikedStatus }
        : comment
    );
  };

  // 获取种子评论
  const useSeedComments = (seedId: number | undefined) =>
    useQuery({
      queryKey: ["seedComments", seedId],
      queryFn: async () => {
        if (!seedId) return [];

        const response = await commentApi.getSeedComments(seedId).promise;
        // 将API响应转换为业务所需的Comment[]类型
        if (response.data?.comments) {
          // 使用类型断言而不是类型注解
          return response.data.comments.map(
            (item) =>
              ({
                id: item.comment_id,
                content: item.content,
                author: {
                  id: item.user_info.user_id,
                  username: item.user_info.username,
                  avatar: item.user_info.avatar_url,
                  level: item.user_info.level || "",
                },
                createdAt: item.comment_createtime,
                likes: item.likes_count,
                isLiked: item.user_liked,
                replies: item.replies
                  ? item.replies.map(
                      (reply) =>
                        ({
                          id: reply.comment_id,
                          parentId: reply.parent_id,
                          content: reply.content,
                          likes: reply.likes_count,
                          isLiked: reply.user_liked,
                          author: {
                            id: reply.user_info.user_id,
                            username: reply.user_info.username,
                            avatar: reply.user_info.avatar_url,
                            level: reply.user_info.level || "",
                          },
                          createdAt: reply.comment_createtime,
                        } as CommentReply)
                    )
                  : [],
                replyCount: item.replies ? item.replies.length : 0,
              } as Comment)
          );
        }
        return [];
      },
      enabled: !!seedId,
      staleTime: 3 * 60 * 1000, // 3分钟缓存
      refetchOnWindowFocus: true,
    });

  // 发表评论的mutation
  const postCommentMutation = useMutation({
    mutationFn: async ({
      seedId,
      content,
    }: {
      seedId: number;
      content: string;
    }) => {
      return await commentApi.postComment(seedId, content).promise;
    },
    onMutate: async ({ seedId, content }) => {
      // 取消任何正在进行的重新获取
      await queryClient.cancelQueries({ queryKey: ["seedComments", seedId] });

      // 保存之前的状态，以便在错误时恢复
      const previousComments = queryClient.getQueryData<Comment[]>([
        "seedComments",
        seedId,
      ]);

      // 创建一个临时的评论对象用于乐观更新
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
        const tempId = Date.now(); // 使用时间戳作为临时ID
        const optimisticComment: Comment = {
          id: tempId,
          content: content,
          author: {
            id: userInfo.user_id,
            username: userInfo.user_name,
            avatar: userInfo.avatar_url,
            level: userInfo.user_level || "",
          },
          createdAt: new Date().toISOString(),
          likes: 0,
          isLiked: false,
          replies: [],
          replyCount: 0,
        };

        // 乐观地更新查询数据
        queryClient.setQueryData<Comment[]>(
          ["seedComments", seedId],
          (oldComments = []) => [optimisticComment, ...oldComments]
        );
      } catch (error) {
        console.error("乐观更新失败:", error);
      }

      // 返回上下文对象，包含之前的评论数据
      return { previousComments };
    },
    onSuccess: () => {
      toast.success("评论发表成功");
    },
    onError: (error, variables, context) => {
      console.error("发表评论失败:", error);
      toast.error("评论发表失败，请稍后重试");

      // 如果存在上下文，恢复到之前的评论数据
      if (context?.previousComments) {
        queryClient.setQueryData<Comment[]>(
          ["seedComments", variables.seedId],
          context.previousComments
        );
      }
    },
  });

  // 回复评论的mutation
  const replyCommentMutation = useMutation({
    mutationFn: async ({
      seedId,
      commentId,
      content,
    }: {
      seedId: number;
      commentId: number;
      content: string;
    }) => {
      return await commentApi.replyToComment(seedId, commentId, content)
        .promise;
    },
    onMutate: async ({ seedId, commentId, content }) => {
      // 取消任何正在进行的重新获取
      await queryClient.cancelQueries({ queryKey: ["seedComments", seedId] });

      // 保存之前的状态，以便在错误时恢复
      const previousComments = queryClient.getQueryData<Comment[]>([
        "seedComments",
        seedId,
      ]);

      // 创建一个临时的回复对象用于乐观更新
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
        const tempId = Date.now(); // 使用时间戳作为临时ID
        const optimisticReply: CommentReply = {
          id: tempId,
          parentId: commentId,
          content: content,
          author: {
            id: userInfo.user_id,
            username: userInfo.user_name,
            avatar: userInfo.avatar_url,
            level: userInfo.user_level || "",
          },
          createdAt: new Date().toISOString(),
          likes: 0,
          isLiked: false,
        };

        // 乐观地更新查询数据，将新回复添加到对应评论的回复列表中
        queryClient.setQueryData<Comment[]>(
          ["seedComments", seedId],
          (oldComments = []) =>
            oldComments.map((comment) =>
              comment.id === commentId
                ? {
                    ...comment,
                    replies: [...(comment.replies || []), optimisticReply],
                    replyCount: (comment.replyCount || 0) + 1,
                  }
                : comment
            )
        );
      } catch (error) {
        console.error("乐观更新失败:", error);
      }

      // 返回上下文对象，包含之前的评论数据
      return { previousComments };
    },
    onSuccess: () => {
      toast.success("回复发表成功");
    },
    onError: (error, variables, context) => {
      console.error("回复评论失败:", error);
      toast.error("回复发表失败，请稍后重试");

      // 如果存在上下文，恢复到之前的评论数据
      if (context?.previousComments) {
        queryClient.setQueryData<Comment[]>(
          ["seedComments", variables.seedId],
          context.previousComments
        );
      }
    },
  });
   // 点赞/取消点赞评论的mutation
  const likeCommentMutation = useMutation({
    mutationFn: async ({
      commentId,
      isLiked,
    }: {
      commentId: number;
      isLiked: boolean;
      seedId: number;
    }) => {
      if (isLiked) {
        return await commentApi.unlikeComment(commentId).promise;
      } else {
        return await commentApi.likeComment(commentId).promise;
      }
    },
    onMutate: async ({ commentId, isLiked, seedId }) => {
      // 取消任何正在进行的重新获取
      await queryClient.cancelQueries({ queryKey: ["seedComments", seedId] });

      // 保存之前的状态，以便在错误时恢复
      const previousComments = queryClient.getQueryData<Comment[]>([
        "seedComments",
        seedId,
      ]);

      // 计算新的点赞数和点赞状态
      const newLikedStatus = !isLiked;

      // 乐观地更新查询数据
      queryClient.setQueryData<Comment[]>(
        ["seedComments", seedId],
        (oldComments = []) =>
          oldComments.map((comment) =>
            comment.id === commentId
              ? {
                  ...comment,
                  likes: isLiked
                    ? Math.max(0, comment.likes - 1)
                    : comment.likes + 1,
                  isLiked: newLikedStatus,
                }
              : comment
          )
      );

      // 返回上下文对象，包含之前的评论数据
      return { previousComments };
    },
    onSuccess: () => {
      toast.success("操作成功");
    },
    onError: (error, variables, context) => {
      console.error("点赞操作失败:", error);
      toast.error("操作失败，请稍后重试");

      // 如果存在上下文，恢复到之前的评论数据
      if (context?.previousComments) {
        queryClient.setQueryData<Comment[]>(
          ["seedComments", variables.seedId],
          context.previousComments
        );
      }
    },
  });
  // 给回复点赞/取消点赞的mutation
  const likeReplyMutation = useMutation({
    mutationFn: async ({
      replyId,
      isLiked,
    }: {
      replyId: number;
      isLiked: boolean;
      parentId: number;
      seedId: number;
    }) => {
      if (isLiked) {
        return await commentApi.unlikeComment(replyId).promise;
      } else {
        return await commentApi.likeComment(replyId).promise;
      }
    },
    onMutate: async ({ replyId, isLiked, parentId, seedId }) => {
      // 取消任何正在进行的重新获取
      await queryClient.cancelQueries({ queryKey: ["seedComments", seedId] });

      // 保存之前的状态，以便在错误时恢复
      const previousComments = queryClient.getQueryData<Comment[]>([
        "seedComments",
        seedId,
      ]);

      // 计算新的点赞状态
      const newLikedStatus = !isLiked;

      // 乐观地更新查询数据
      queryClient.setQueryData<Comment[]>(
        ["seedComments", seedId],
        (oldComments = []) =>
          updateCommentsLikes(
            oldComments,
            replyId,
            isLiked ? -1 : 1, // 临时的点赞数变化
            newLikedStatus,
            true,
            parentId
          )
      );

      // 返回上下文对象，包含之前的评论数据
      return { previousComments };
    },
    onSuccess: (response, variables) => {
      if (response.code === 0) {
        const { isLiked } = variables;
        toast.success(isLiked ? "已取消点赞" : "点赞成功");
      } else {
        toast.error(response.message || "操作失败");
      }
    },
    onError: (error, variables, context) => {
      console.error("点赞操作失败:", error);
      toast.error("操作失败，请稍后重试");

      // 如果存在上下文，恢复到之前的评论数据
      if (context?.previousComments) {
        queryClient.setQueryData<Comment[]>(
          ["seedComments", variables.seedId],
          context.previousComments
        );
      }
    },
  });
  // 举报评论的mutation
  const reportCommentMutation = useMutation({
    mutationFn: async ({
      commentId,
      reason,
    }: {
      commentId: number;
      reason: string;
    }) => {
      return await commentApi.reportComment(commentId, reason).promise;
    },
    onSuccess: (response) => {
      if (response.code === 0 && response.data?.success) {
        toast.success("举报成功！");
      } else {
        toast.error(response.message || "举报失败");
      }
    },
    onError: (error) => {
      console.error("举报评论失败:", error);
      toast.error("举报失败，请稍后重试");
    },
  });

  return {
    useSeedComments,
    postCommentMutation,
    replyCommentMutation,
    likeCommentMutation,
    likeReplyMutation,
    reportCommentMutation,
  };
}
