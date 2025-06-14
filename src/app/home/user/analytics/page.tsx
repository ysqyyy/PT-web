"use client";
// pages/dashboard/analytics.tsx
import { useEffect, useState } from "react";
import DashboardLayout from "../../../../components/DashboardLayout";
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, BarElement } from "chart.js";
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
  BarElement,
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

  // 获取最近4个月的标签
  const getMonthLabels = (): string[] => {
    const labels = [];
    const now = new Date();
    
    for (let i = 3; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      labels.push(`${month.getFullYear()}年${month.getMonth() + 1}月`);
    }
    
    return labels;
  };

  // 用户上传下载趋势图表数据
  const userTrendChartData = {
    labels: getMonthLabels(),
    datasets: [
      {
        label: "上传量",
        data: analyticsData?.userMonthlyUpload || [0, 0, 0, 0],
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        tension: 0.1,
      },
      {
        label: "下载量",
        data: analyticsData?.userMonthlyDownload || [0, 0, 0, 0],
        fill: false,
        borderColor: "rgba(192,75,75,1)",
        backgroundColor: "rgba(192,75,75,0.2)",
        tension: 0.1,
      },
    ],
  };  // 全站上传下载趋势图表数据
  const allTrendChartData = {
    labels: getMonthLabels(),
    datasets: [
      {
        label: "上传量",
        data: analyticsData?.allMonthlyUpload || [0, 0, 0, 0],
        fill: false,
        borderColor: "rgba(54,162,235,1)",
        backgroundColor: "rgba(54,162,235,0.2)",
        tension: 0.1,
      },
      {
        label: "下载量",
        data: analyticsData?.allMonthlyDownload || [0, 0, 0, 0],
        fill: false,
        borderColor: "rgba(255,99,132,1)",
        backgroundColor: "rgba(255,99,132,0.2)",
        tension: 0.1,
      },
    ],
  };

  // 图表配置选项
  const userChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "个人近4个月上传/下载趋势",
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const allChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "全站近4个月上传/下载趋势",
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };
  return (
    <Navbar name="个人中心">
      <DashboardLayout title="数据分析">
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-10 bg-white rounded-xl shadow">
              <p>正在加载数据分析...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500 bg-white rounded-xl shadow">
              <p>{error}</p>
            </div>
          ) : (
            <>
              {/* 用户趋势图表 */}
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold mb-4">个人上传/下载趋势</h2>
                <div className="mb-6">
                  <Line data={userTrendChartData} options={userChartOptions} />
                </div>
              </div>

              {/* 全站趋势图表 */}
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold mb-4">全站上传/下载趋势</h2>
                <div className="mb-6">
                  <Line data={allTrendChartData} options={allChartOptions} />
                </div>
              </div>

              {/* 数据统计 */}
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold mb-4">平台数据统计</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-100 p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold">全站总下载量</h3>
                    <p className="text-xl font-bold">{analyticsData?.totalDownload || 0}</p>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold">资源总数</h3>
                    <p className="text-xl font-bold">{analyticsData?.totalTorrentCount || 0}</p>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold">活跃用户数</h3>
                    <p className="text-xl font-bold">{analyticsData?.activeUserCount || 0}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </DashboardLayout>
    </Navbar>
  );
}

// 包装组件，加入路由保护
export default function AnalyticsPageWithProtection() {
  return (
    <ProtectedRoute requiredLevel={2}>
      <AnalyticsPage />
    </ProtectedRoute>
  );
}
