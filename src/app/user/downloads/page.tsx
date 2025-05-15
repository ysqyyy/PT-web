// pages/dashboard/downloads.tsx
import DashboardLayout from "../../../components/DashboardLayout";
import Navbar from "@/components/Navbar";

export default function DownloadsPage() {
  const downloadRecords = [
    { id: 1, fileName: "文件1", date: "2025-04-10", size: "2 MB" },
    { id: 2, fileName: "文件2", date: "2025-04-12", size: "3.5 MB" },
    { id: 3, fileName: "文件3", date: "2025-04-14", size: "1.8 MB" },
  ];

  return (
    <Navbar name="个人中心">
      <DashboardLayout title="我的下载">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">下载记录</h2>

          {/* 下载记录表格 */}
          <table className="min-w-full table-auto">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left">文件名</th>
                <th className="px-4 py-2 text-left">下载日期</th>
                <th className="px-4 py-2 text-left">文件大小</th>
                <th className="px-4 py-2 text-left">操作</th>
              </tr>
            </thead>
            <tbody>
              {downloadRecords.map((record) => (
                <tr key={record.id} className="border-b">
                  <td className="px-4 py-2">{record.fileName}</td>
                  <td className="px-4 py-2">{record.date}</td>
                  <td className="px-4 py-2">{record.size}</td>
                  <td className="px-4 py-2">
                    <button className="text-blue-600 hover:underline">重新下载</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardLayout>
    </Navbar>
  );
}
