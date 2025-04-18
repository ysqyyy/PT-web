// pages/dashboard/bounties.tsx
"use client";

import DashboardLayout from "../../../components/DashboardLayout";

export default function MyBountiesPage() {
  return (
    <DashboardLayout title="我的悬赏">
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">我的悬赏</h2>

        {/* 悬赏列表 */}
        <div className="bg-white rounded-xl shadow p-6">
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">悬赏标题</th>
                <th className="px-4 py-2 text-left">金额</th>
                <th className="px-4 py-2 text-left">状态</th>
                <th className="px-4 py-2 text-left">操作</th>
              </tr>
            </thead>
            <tbody>
              {/* 示例悬赏数据 */}
              <tr>
                <td className="px-4 py-2">悬赏A</td>
                <td className="px-4 py-2">50 元</td>
                <td className="px-4 py-2">进行中</td>
                <td className="px-4 py-2">
                  <button className="text-blue-600 hover:underline">查看详情</button>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2">悬赏B</td>
                <td className="px-4 py-2">100 元</td>
                <td className="px-4 py-2">已完成</td>
                <td className="px-4 py-2">
                  <button className="text-blue-600 hover:underline">查看详情</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
