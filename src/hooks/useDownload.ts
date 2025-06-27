// hooks/useDownload.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { downloadApi } from "@/apinew/downloadApi";
import { DownloadRecord } from "@/types/download";
import { toast } from "react-hot-toast";
/**
 * 下载相关功能的 hook，包含获取下载记录、下载资源功能
 */
export function useDownload() {
  const queryClient = useQueryClient();

  // 获取下载记录
  const useDownloadRecords = () =>
    useQuery({
      queryKey: ["downloadRecords"],
      queryFn: async () => {
        try {
          const response = await downloadApi.getDownloadRecords().promise;
          let records: DownloadRecord[] = [];
          records = response.data.map((item) => ({
            id: item.torrentId,
            filename: item.torrentName,
            date: item.downloadTime,
            size: item.downloadByte,
          }));
          return records;
        } catch (error) {
          console.error("获取下载记录失败:", error);
          throw new Error("获取下载记录失败");
        }
      },
      staleTime: 5 * 60 * 1000, // 5分钟缓存
      refetchOnWindowFocus: false, // 窗口获取焦点时不重新获取数据
    });

  // 下载资源的 mutation
  const downloadResourceMutation = useMutation({
    mutationFn: async (torrentId: number) => {
      try {
        // 获取下载链接
        const urlResponse = await downloadApi.getDownloadUrl(torrentId).promise;
        // 执行下载
        const downloadResponse = await downloadApi.downloadFile(urlResponse.data.downloadUrl).promise;
        return downloadResponse;
      } catch (error) {
        console.error("下载资源出错:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("下载已开始", { duration: 3000 });

      // 下载成功后，使下载记录缓存失效，以便下次获取时重新请求最新数据
      queryClient.invalidateQueries({ queryKey: ["downloadRecords"] });
    },
    onError: (error) => {
      console.error("下载失败:", error);
      toast.error(
        `下载失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
    },
    retry: 1, // 失败后重试1次
  });

  return {
    useDownloadRecords,
    downloadResourceMutation,
  };
}
