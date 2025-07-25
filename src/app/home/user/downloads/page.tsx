"use client";
// pages/dashboard/downloads.tsx
import DashboardLayout from "@/components/DashboardLayout";
import Navbar from "@/components/Navbar";
import { useDownload } from "@/hooks/useDownload";
import DownloadBountyButton from "@/components/bounty/DownloadBountyButton";

export default function DownloadsPage() {
  const { useDownloadRecords } = useDownload();
  const { 
    data: downloadRecords = [], 
    isLoading, 
    isError
  } = useDownloadRecords();
  return (
    <Navbar name="个人中心">
      <DashboardLayout title="我的下载">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">下载记录</h2>

          {isLoading ? (
            <div className="text-center py-10">
              <p>正在加载下载记录...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-10 text-red-500">
              <p>获取下载记录失败，请稍后重试</p>
            </div>
          ) : downloadRecords.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p>暂无下载记录</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto whitespace-nowrap">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left">文件名</th>
                    <th className="px-4 py-2 text-left">下载日期</th>
                    <th className="px-4 py-2 text-left">文件大小</th>
                    <th className="px-4 py-2 text-left">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {downloadRecords.map((record, index) => (
                    <tr
                      key={`${record.id}-${record.date}-${index}`}
                      className="border-b"
                    >
                      <td className="px-4 py-2">{record.filename}</td>
                      <td className="px-4 py-2">{record.date}</td>
                      <td className="px-4 py-2">{record.size}</td>
                      <td className="px-4 py-2">
                        <DownloadBountyButton id={record.id} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </DashboardLayout>
    </Navbar>
  );
}
