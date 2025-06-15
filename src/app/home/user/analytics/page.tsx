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
        fill: true,
        borderColor: "rgba(79, 122, 111, 1)",
        backgroundColor: "rgba(79, 122, 111, 0.1)",
        tension: 0.3,
        borderWidth: 2,
        pointBackgroundColor: "rgba(79, 122, 111, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "下载量",
        data: analyticsData?.userMonthlyDownload || [0, 0, 0, 0],
        fill: true,
        borderColor: "rgba(120, 86, 122, 1)",
        backgroundColor: "rgba(120, 86, 122, 0.1)",
        tension: 0.3,
        borderWidth: 2,
        pointBackgroundColor: "rgba(120, 86, 122, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };
  
  // 全站上传下载趋势图表数据
  const allTrendChartData = {
    labels: getMonthLabels(),
    datasets: [
      {
        label: "上传量",
        data: analyticsData?.allMonthlyUpload || [0, 0, 0, 0],
        fill: true,
        borderColor: "rgba(66, 135, 245, 1)",
        backgroundColor: "rgba(66, 135, 245, 0.1)",
        tension: 0.3,
        borderWidth: 2,
        pointBackgroundColor: "rgba(66, 135, 245, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "下载量",
        data: analyticsData?.allMonthlyDownload || [0, 0, 0, 0],
        fill: true,
        borderColor: "rgba(230, 73, 128, 1)",
        backgroundColor: "rgba(230, 73, 128, 0.1)",
        tension: 0.3,
        borderWidth: 2,
        pointBackgroundColor: "rgba(230, 73, 128, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
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
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          padding: 20,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#333',
        bodyColor: '#666',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
                label += ': ';
            }
            if (context.parsed.y !== null) {
                label += context.parsed.y + ' GB';
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        },
        ticks: {
          callback: function(value: any) {
            return value + ' GB';
          }
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        }
      }
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        hitRadius: 8,
      }
    }
  };

  const allChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "全站近4个月上传/下载趋势",
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          padding: 20,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#333',
        bodyColor: '#666',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
                label += ': ';
            }
            if (context.parsed.y !== null) {
                label += context.parsed.y + ' GB';
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        },
        ticks: {
          callback: function(value: any) {
            return value + ' GB';
          }
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        }
      }
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        hitRadius: 8,
      }
    }
  };return (
    <Navbar name="个人中心">
      <DashboardLayout title="数据分析">
        <div className="space-y-6">
          {loading ? (
            <div className="bg-white rounded-xl shadow-md p-10 text-center">
              <div className="flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mb-4"></div>
                <p className="text-gray-600">正在加载数据分析...</p>
                <p className="text-gray-500 text-sm mt-2">请稍候，我们正在处理您的请求</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-white rounded-xl shadow-md p-10 text-center">
              <div className="flex flex-col items-center justify-center">
                <div className="bg-red-100 p-3 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <p className="text-red-500 text-lg font-medium">{error}</p>
                <p className="text-gray-500 text-sm mt-2">请刷新页面或稍后再试</p>
              </div>
            </div>
          ) : (
            <>{/* 趋势图表（并排显示） */}
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100">
                <div className="flex items-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                  <h2 className="text-xl font-semibold text-gray-800">上传/下载趋势</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 用户趋势图表 */}
                  <div className="w-full bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow transition-shadow duration-300">
                    <h3 className="text-md font-medium mb-3 text-center flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      个人数据
                    </h3>
                    <div className="h-72">
                      <Line data={userTrendChartData} options={{
                        ...userChartOptions,
                        maintainAspectRatio: false,
                        plugins: {
                          ...userChartOptions.plugins,
                          title: {
                            ...userChartOptions.plugins.title,
                            display: false
                          }
                        }
                      }} />
                    </div>
                  </div>
                  
                  {/* 全站趋势图表 */}
                  <div className="w-full bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow transition-shadow duration-300">
                    <h3 className="text-md font-medium mb-3 text-center flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      全站数据
                    </h3>
                    <div className="h-72">
                      <Line data={allTrendChartData} options={{
                        ...allChartOptions,
                        maintainAspectRatio: false,
                        plugins: {
                          ...allChartOptions.plugins,
                          title: {
                            ...allChartOptions.plugins.title,
                            display: false
                          }
                        }
                      }} />
                    </div>
                  </div>
                </div>
              </div>              {/* 数据统计 */}
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100">
                <div className="flex items-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <h2 className="text-xl font-semibold text-gray-800">平台数据统计</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-teal-100">
                    <div className="flex items-center mb-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-700">全站总下载量</h3>
                    </div>
                    <p className="text-3xl font-bold text-teal-700">{analyticsData?.totalDownload || 0}</p>
                    <p className="text-sm text-gray-500 mt-2">总计下载资源</p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-blue-100">
                    <div className="flex items-center mb-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-700">资源总数</h3>
                    </div>
                    <p className="text-3xl font-bold text-blue-700">{analyticsData?.totalTorrentCount || 0}</p>
                    <p className="text-sm text-gray-500 mt-2">所有种子资源</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-purple-100">
                    <div className="flex items-center mb-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-700">活跃用户数</h3>
                    </div>
                    <p className="text-3xl font-bold text-purple-700">{analyticsData?.activeUserCount || 0}</p>
                    <p className="text-sm text-gray-500 mt-2">近期活跃用户</p>
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
    <ProtectedRoute requiredLevel={7}>
      <AnalyticsPage />
    </ProtectedRoute>
  );
}
