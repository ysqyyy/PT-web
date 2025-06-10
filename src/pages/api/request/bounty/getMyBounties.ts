// src/pages/api/request/bounty/my-bounties.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import type { MyBounty } from '@/types/bounty';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const mockBounties: MyBounty[] = [
      {
        id: 1,
        name: "React TypeScript 完整项目模板",
        description: "包含路由、状态管理、UI组件库的完整项目架构，适合中大型项目开发",
        reward_amount: 200,
        total_amount: 350,
        status: "pending"
      },
      {
        id: 2,
        name: "Vue3 + Vite 后台管理系统",
        description: "基于Vue3、Vite、Element Plus的现代化后台管理系统模板",
        reward_amount: 150,
        total_amount: 300,
        status: "已完成"
      },
      {
        id: 3,
        name: "Next.js 全栈电商平台",
        description: "包含用户认证、商品管理、订单系统、支付集成的完整电商解决方案",
        reward_amount: 500,
        total_amount: 800,
        status: "待确认"
      },
      {
        id: 4,
        name: "Node.js RESTful API 框架",
        description: "基于Express、TypeScript、JWT认证的企业级API框架模板",
        reward_amount: 180,
        total_amount: 280,
        status: "待仲裁"
      },
      {
        id: 5,
        name: "微信小程序商城源码",
        description: "包含商品展示、购物车、订单管理、用户中心的完整小程序商城",
        reward_amount: 300,
        total_amount: 450,
        status: "已取消"
      },
      {
        id: 6,
        name: "Flutter 跨平台移动应用",
        description: "基于Flutter的跨平台移动应用，包含完整的UI组件和状态管理",
        reward_amount: 250,
        total_amount: 400,
        status: "pending"
      }
    ];

    res.status(200).json(mockBounties);
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
