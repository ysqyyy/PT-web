// hooks/useSeed.ts
import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { seedApi } from "@/api/seedApi"; 
import type { publishSeedData, SeedDetail, getSeedListParams } from "@/types/seed";
import { getCategoryNameById } from "@/constants/categories";
import { getTagNameById } from "@/constants/tags";

// 定义API返回的记录类型
interface SeedRecord {
  torrentId: number;
  torrentName: string;
  torrentDescription: string;
  torrentSize: string | number;
  downloadCount: number;
  torrentStatus: string;
  originPrice: number;
  score: number;
  downloadLimit?: number;
  uploadTime?: string[];
  tagNames?: string[] | null;
  tagIds?: string[];
  tags?: string[];
}
/**
 * 种子相关功能的 hook，包含获取种子列表、获取种子详情、发布种子等功能
 */
export function useSeed() {
  const queryClient = useQueryClient();
    // 获取推荐种子列表 - 无限滚动版本 ok
  const useRecommendSeeds = (pageSize: number = 12) => useInfiniteQuery({
    queryKey: ["recommendSeedsInfinite"],
    queryFn: async ({ pageParam = 1 }) => {
      console.log("获取推荐种子，页码:", pageParam, "每页数量:", pageSize);
      const response = await seedApi.getRecommendSeeds(pageParam, pageSize).promise;
      console.log("获取推荐种子use:", response);
      const res = response.data.records || [];
      const total = response.data.total || res.length;
      const totalPages = response.data.pages || Math.ceil(total / pageSize);
      const seeds: getSeedListParams[] = res.map((item: SeedRecord) => ({
        torrentId: item.torrentId,
        torrentName: item.torrentName,
        torrentDescription: item.torrentDescription,
        torrentSize: item.torrentSize,
        downloadCount: item.downloadCount,
        status: item.torrentStatus,
        originPrice: item.originPrice,
        score: item.score,
        downloadLimit: item.downloadLimit || 0,
        uploadTime: item.uploadTime || [],
        tags: item.tagNames || null,
      }));
      
      return {
        seeds,
        currentPage: pageParam,
        totalItems: total,
        totalPages,
        hasNextPage: pageParam < totalPages
      };
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasNextPage) return undefined;
      return lastPage.currentPage + 1;
    },
    initialPageParam: 1,
    refetchOnMount: true, // 组件挂载时重新获取数据
    refetchOnWindowFocus: false, // 窗口获取焦点时不重新获取数据
    staleTime: 5 * 60 * 1000, // 5分钟缓存
  });   
   // 按关键词搜索种子 - 无限滚动版本  ok 无无限滚动
  const useSeedSearch = (keyword: string, pageSize: number = 12) => useInfiniteQuery({
    queryKey: ["seedSearchInfinite", keyword],
    queryFn: async ({ pageParam = 1 }) => {
      if (!keyword || keyword.trim() === "") {
        return {
          seeds: [],
          currentPage: pageParam,
          totalItems: 0,
          totalPages: 0,
          hasNextPage: false
        };
      }
      
      console.log("搜索种子，关键词:", keyword, "页码:", pageParam, "每页数量:", pageSize);
      const response = await seedApi.getSeedListBySearch(keyword, pageParam, pageSize).promise;
      const byKeyResult = response?.data?.items || [];
      const total = response?.data?.total || byKeyResult.length;
      const totalPages = response?.data?.pages || Math.ceil(total / pageSize);
      const seeds: getSeedListParams[] = byKeyResult.map((item: SeedRecord) => ({
        torrentId: item.torrentId,
        torrentName: item.torrentName,
        torrentDescription: item.torrentDescription || "",
        torrentSize: item.torrentSize || "未知",
        downloadCount: item.downloadCount || 0,
        status: item.torrentStatus || "normal",
        originPrice: item.originPrice || 0,
        score: item.score || 0,
        downloadLimit: item.downloadLimit || 0,
        uploadTime: item.uploadTime || [],
        tags: item.tagNames || [],
      }));
      
      return {
        seeds,
        currentPage: pageParam,
        totalItems: total,
        totalPages,
        hasNextPage: pageParam < totalPages
      };
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasNextPage) return undefined;
      return lastPage.currentPage + 1;
    },
    initialPageParam: 1,
    refetchOnMount: true, // 组件挂载时重新获取数据
    refetchOnWindowFocus: false, // 窗口获取焦点时不重新获取数据
    enabled: !!keyword && keyword.trim() !== "", // 只有当有关键词时才执行查询
    staleTime: 2 * 60 * 1000, // 2分钟缓存
  });   
   // 获取种子列表（带分类和标签筛选）
  const useSeedList = (params: {
    category: string;
    tags?: string[];
    keywords?: string;
    pageSize?: number;
  }) => useInfiniteQuery({
    queryKey: ["seedListInfinite", params.category, params.tags, params.keywords],
    queryFn: async ({ pageParam = 1 }) => {
      let categoryResult: Array<SeedRecord> = [];
      const pageSize = params.pageSize || 12;
      let total: number | undefined = undefined;
      
      // 准备API调用参数
      const apiParams = {
        ...params,
        page: pageParam,
        pageSize: pageSize
      };
      
      console.log("获取筛选种子列表，分类:", params.category, "标签:", params.tags, "页码:", pageParam);
      
      // 根据是否有标签选择不同的API调用
      if (!params.tags || params.tags.length === 0) {
        //无无限滚动
        const response = await seedApi.getSeedList(apiParams).promise;
        categoryResult = response?.data || [];
      } else {
        const response = await seedApi.getSeedList(apiParams).promise;
        categoryResult = response?.data?.items || [];
        total = response?.data?.total || categoryResult.length;
      }
      
      // 将结果转换为数组
      const torrents = Array.from(categoryResult.values());
      const totalItems = total || torrents.length;
      const totalPages = Math.ceil(totalItems / pageSize);
      
      return {
        torrents,
        currentPage: pageParam,
        totalItems,
        totalPages,
        hasNextPage: pageParam < totalPages
      };
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasNextPage) return undefined;
      return lastPage.currentPage + 1;
    },
    initialPageParam: 1,
    refetchOnMount: true, // 组件挂载时重新获取数据
    refetchOnWindowFocus: false, // 窗口获取焦点时不重新获取数据
    staleTime: 3 * 60 * 1000, // 3分钟缓存
  });
  
  // 获取种子详情
  const useSeedDetail = (id: number) => useQuery({
    queryKey: ["seedDetail", id],
    queryFn: async () => {
      if (!id) return null;
      
      const response = await seedApi.getSeedDetail(id).promise;
      const res = response.data;
      
      // 从API返回数据构建SeedDetail对象
      const seedDetail: SeedDetail = {
        torrentId: res.torrentId,
        name: res.torrentName,
        description: res.torrentDescription,
        imgUrl: res?.imgUrl,
        publisherId: res.uploaderId,
        publisherName: res.uploaderName,
        publisherLevel: res?.publisherLevel,
        publisherAvatar: res?.publisherAvatar,
        size: res.torrentSize,
        publishTime: res.uploadTime?.join("-"),
        downloadCount: res.downloadCount,
        status: res.torrentStatus,
        price: res.originPrice,
        downloadLimit: res.downloadLimit,
        score: res.score,
        scoreCount: res.markingCount,
        categoryId: res.categoryId,
        categoryName: res.categoryName || getCategoryNameById(res.categoryId || "0"),
        tags: res.tagIds
          ? res.tagIds.map((id: string) => getTagNameById(id))
          : res.tagNames || [],
      };
      
      return seedDetail;
    },
    enabled: !!id, // 只有当id存在时才执行查询
    staleTime: 5 * 60 * 1000, // 5分钟缓存
  });
  
  // 评分种子
  const rateSeedMutation = useMutation({
    mutationFn: async ({ seedId, rating }: { seedId: number; rating: number }) => {
      const response = await seedApi.rateSeed(seedId, rating).promise;
      return response;
    },
    onSuccess: (data, variables) => {
      // 评分成功后，使种子详情缓存失效，以便下次获取时重新请求最新数据
      queryClient.invalidateQueries({ queryKey: ["seedDetail", variables.seedId] });
    },
  });
    // 发布种子
  const publishSeedMutation = useMutation({
    mutationFn: async ({ file, data }: { file: File; data: publishSeedData }) => {
      return seedApi.publishSeed(file, data);
    },
    onSuccess: () => {
      // 发布成功后，使种子列表和推荐种子缓存失效 (包括无限滚动版本)
      queryClient.invalidateQueries({ queryKey: ["seedList"] });
      queryClient.invalidateQueries({ queryKey: ["seedListInfinite"] });
      queryClient.invalidateQueries({ queryKey: ["recommendSeeds"] });
      queryClient.invalidateQueries({ queryKey: ["recommendSeedsInfinite"] });
      queryClient.invalidateQueries({ queryKey: ["seedSearchInfinite"] });
    },
  });
  
  return {
    useRecommendSeeds,
    useSeedSearch,
    useSeedList,
    useSeedDetail,
    rateSeedMutation,
    publishSeedMutation,
  };
}
