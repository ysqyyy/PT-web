// pages/dashboard/review.tsx
"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import Navbar from "@/components/Navbar";
import toast, { Toaster } from "react-hot-toast";
import { downloadBountyResource } from "@/api/bounties";
import { useDebounceFn } from "@/hooks/useDebounceFn";

export default function ResourceReviewPage() {
  const [loading, setLoading] = useState(false);

  // 下载资源
  const handleDownload = async (id: number) => {
    setLoading(true);
    try {
      await downloadBountyResource(id);
      toast.success("资源下载已开始");
    } catch (error) {
      toast.error("下载失败，请稍后重试");
      console.error("下载错误:", error);
    } finally {
      setLoading(false);
    }
  };

  // 下载资源的防抖函数
  const debouncedHandleDownload = useDebounceFn(
    (id: unknown) => handleDownload(id as number),
    800
  );

  return (
    <Navbar name="个人中心">
      <DashboardLayout title="资源审核">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">资源审核</h2>
          <Toaster position="top-center" />

          {/* 资源审核列表 */}
          <div className="bg-white rounded-xl shadow p-6">
            <table className="min-w-full table-auto">
              {" "}
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">资源名</th>
                  <th className="px-4 py-2 text-left">上传者</th>
                  <th className="px-4 py-2 text-left">提交日期</th>
                  <th className="px-4 py-2 text-left">操作</th>
                  <th className="px-4 py-2 text-left">下载</th>
                </tr>
              </thead>
              <tbody>
                {/* 示例资源数据 */}
                <tr>
                  {" "}
                  <td className="px-4 py-2">资源A</td>
                  <td className="px-4 py-2">user123</td>
                  <td className="px-4 py-2">2025-04-01</td>
                  <td className="px-4 py-2">
                    <button className="text-teal-600 hover:underline">
                      通过
                    </button>
                    <button className="ml-2 text-red-600 hover:underline">
                      拒绝
                    </button>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
                      onClick={() => debouncedHandleDownload(1)} // 假设资源A的ID为1
                      disabled={loading}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      下载
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2">资源B</td>
                  <td className="px-4 py-2">user456</td>
                  <td className="px-4 py-2">2025-03-25</td>
                  <td className="px-4 py-2">
                    <button className="text-teal-600 hover:underline">
                      通过
                    </button>
                    <button className="ml-2 text-red-600 hover:underline">
                      拒绝
                    </button>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
                      onClick={() => debouncedHandleDownload(2)} // 假设资源B的ID为2
                      disabled={loading}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      下载
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </DashboardLayout>
    </Navbar>
  );
}
