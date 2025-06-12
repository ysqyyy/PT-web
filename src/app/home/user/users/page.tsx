// pages/dashboard/users.tsx
"use client";

import DashboardLayout from "../../../../components/DashboardLayout";
import Navbar from '../../../../components/Navbar';

export default function UserManagementPage() {
  return (
    <Navbar name="个人中心">
    <DashboardLayout title="举报管理">
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">举报管理</h2>

        {/* 用户列表 */}
        <div className="bg-white rounded-xl shadow p-6">
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">用户名</th>
                <th className="px-4 py-2 text-left">邮箱</th>
                <th className="px-4 py-2 text-left">注册日期</th>
                <th className="px-4 py-2 text-left">操作</th>
              </tr>
            </thead>
            <tbody>
              {/* 示例用户数据 */}
              <tr>
                <td className="px-4 py-2">user123</td>
                <td className="px-4 py-2">user123@example.com</td>
                <td className="px-4 py-2">2025-04-01</td>
                <td className="px-4 py-2">
                  <button className="text-blue-600 hover:underline">编辑</button>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2">user456</td>
                <td className="px-4 py-2">user456@example.com</td>
                <td className="px-4 py-2">2025-03-20</td>
                <td className="px-4 py-2">
                  <button className="text-blue-600 hover:underline">编辑</button>
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
