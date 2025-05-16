"use client";
// pages/dashboard/analytics.tsx
import DashboardLayout from "../../../../components/DashboardLayout";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";
import Navbar from "@/components/Navbar";

// 注册 chart.js 插件
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function AnalyticsPage() {
  // 示例数据
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "下载量",
        data: [65, 59, 80, 81, 56, 55],
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "2025 年 下载量趋势",
      },
    },
  };

  return (
    <Navbar name="个人中心">
      <DashboardLayout title="数据分析">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">下载趋势</h2>

          {/* 统计图表 */}
          <div className="mb-6">
            <Line data={data} options={options} />
          </div>

          {/* 数据统计 */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-100 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold">总下载量</h3>
              <p className="text-xl font-bold">341</p>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold">月均下载量</h3>
              <p className="text-xl font-bold">28.4</p>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold">资源总数</h3>
              <p className="text-xl font-bold">245</p>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold">活跃用户数</h3>
              <p className="text-xl font-bold">120</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </Navbar>
  );
}
