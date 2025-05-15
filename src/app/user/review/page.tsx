// pages/dashboard/review.tsx
"use client";

import DashboardLayout from "../../../components/DashboardLayout";
import Navbar from "@/components/Navbar";

export default function ResourceReviewPage() {
  return (
    <Navbar name="个人中心">
      <DashboardLayout title="资源审核">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">资源审核</h2>

          {/* 资源审核列表 */}
          <div className="bg-white rounded-xl shadow p-6">
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">资源名</th>
                  <th className="px-4 py-2 text-left">上传者</th>
                  <th className="px-4 py-2 text-left">提交日期</th>
                  <th className="px-4 py-2 text-left">操作</th>
                </tr>
              </thead>
              <tbody>
                {/* 示例资源数据 */}
                <tr>
                  <td className="px-4 py-2">资源A</td>
                  <td className="px-4 py-2">user123</td>
                  <td className="px-4 py-2">2025-04-01</td>
                  <td className="px-4 py-2">
                    <button className="text-teal-600 hover:underline">通过</button>
                    <button className="ml-2 text-red-600 hover:underline">拒绝</button>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2">资源B</td>
                  <td className="px-4 py-2">user456</td>
                  <td className="px-4 py-2">2025-03-25</td>
                  <td className="px-4 py-2">
                    <button className="text-teal-600 hover:underline">通过</button>
                    <button className="ml-2 text-red-600 hover:underline">拒绝</button>
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
