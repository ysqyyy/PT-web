// mock: /api/request/review/pending
import type { NextApiRequest, NextApiResponse } from 'next';
import type { ReviewItem } from '@/types/review';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // 模拟待审核资源数据
    const mockPendingReviews: ReviewItem[] = [
      {
        id: 1,
        name: "React TypeScript 完整项目模板",
        description: "包含路由、状态管理、UI组件库的完整React项目架构，适合快速搭建企业级应用",
        uploader: "developer123",
        date: "2025-06-01"
      },
      {
        id: 2,
        name: "Node.js REST API 开发框架",
        description: "基于Express和TypeScript的后端API开发框架，包含身份验证、数据库连接、日志系统等最佳实践",
        uploader: "backend_master",
        date: "2025-05-28"
      },
      {
        id: 3,
        name: "Vue3 + Vite 移动端组件库",
        description: "适配移动端的Vue3组件库，包含常用UI组件、触摸手势、响应式布局等功能",
        uploader: "mobile_dev",
        date: "2025-05-25"
      },
      {
        id: 4,
        name: "Python 数据分析工具集",
        description: "包含pandas、numpy、matplotlib等常用数据分析库的使用示例和最佳实践代码",
        uploader: "data_scientist",
        date: "2025-05-20"
      },
      {
        id: 5,
        name: "微服务架构设计文档",
        description: "详细的微服务架构设计指南，包含服务拆分、API网关、配置中心、监控告警等内容",
        uploader: "architect_pro",
        date: "2025-05-15"
      },
      {
        id: 6,
        name: "Flutter 跨平台应用开发指南",
        description: "完整的Flutter移动应用开发教程，包含UI设计、状态管理、网络请求、本地存储等",
        uploader: "flutter_expert",
        date: "2025-05-10"
      },
      {
        id: 7,
        name: "Docker 容器化部署方案",
        description: "企业级Docker容器化部署完整解决方案，包含多环境配置、CI/CD流程、监控日志等",
        uploader: "devops_engineer",
        date: "2025-05-05"
      }
    ];
    
    // 返回待审核资源列表
    res.status(200).json(mockPendingReviews);
  } else {
    // 如果不是GET请求，返回405 Method Not Allowed
    res.status(405).json({ 
      success: false, 
      message: 'Method Not Allowed' 
    });
  }
}