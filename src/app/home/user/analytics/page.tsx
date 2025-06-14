"use client";
// pages/dashboard/analytics.tsx
import { useEffect, useState } from "react";
import DashboardLayout from "../../../../components/DashboardLayout";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";
import Navbar from "@/components/Navbar";
import { getAnalyticsDashboard } from "@/api/analytics";
import type { AnalyticsData } from "@/types/analytics";
import ProtectedRoute from "@/components/ProtectedRoute";

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

export function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 获取数据分析数据
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        const data = await getAnalyticsDashboard();
        setAnalyticsData(data);
        setError(null);
      } catch (err) {
        console.error("获取数据分析失败:", err);
        setError("获取数据分析失败，请稍后重试");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  // 图表数据
  const chartData = {
    labels: analyticsData?.downloadTrend.labels || [],
    datasets: [
      {
        label: "下载量",
        data: analyticsData?.downloadTrend.values || [],
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

          {loading ? (
            <div className="text-center py-10">
              <p>正在加载数据分析...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">
              <p>{error}</p>
            </div>
          ) : (
            <>
              {/* 统计图表 */}
              <div className="mb-6">
                <Line data={chartData} options={options} />
              </div>

              {/* 数据统计 */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-100 p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold">总下载量</h3>
                  <p className="text-xl font-bold">{analyticsData?.totalDownloads || 0}</p>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold">月均下载量</h3>
                  <p className="text-xl font-bold">{analyticsData?.monthlyAverage || 0}</p>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold">资源总数</h3>
                  <p className="text-xl font-bold">{analyticsData?.totalResources || 0}</p>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold">活跃用户数</h3>
                  <p className="text-xl font-bold">{analyticsData?.activeUsers || 0}</p>
                </div>              </div>
            </>
          )}
        </div>
      </DashboardLayout>
    </Navbar>  );
}

// 包装组件，加入路由保护
export default function AnalyticsPageWithProtection() {
  return (
    <ProtectedRoute requiredLevel={2}>
      <AnalyticsPage />
    </ProtectedRoute>
  );
}
