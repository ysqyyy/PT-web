// mock: /api/request/bounty/arbitration
import type { NextApiRequest, NextApiResponse } from 'next';
import type { ArbitrationBounty } from '@/types/bounty';

const mockData: ArbitrationBounty[] = [
  {
    bountyId: 1,
    name: 'React TypeScript 完整项目模板',
    description: '包含路由、状态管理、UI组件库的完整项目架构，适合中大型项目开发',
    status: 'under_review',
    publisher: 'userA',
    reason: '提供的资源与描述不符，缺少关键组件库配置',
  },
  {
    bountyId: 2,
    name: 'Vue3 + Vite 后台管理系统',
    description: '基于Vue3、Vite、Element Plus的现代化后台管理系统模板',
    status: 'under_review',
    publisher: 'userB',
    reason: '资源无法正常运行，依赖包版本冲突严重',
  },
  {
    bountyId: 3,
    name: 'Next.js 全栈电商平台',
    description: '包含用户认证、商品管理、订单系统、支付集成的完整电商解决方案',
    status: 'under_review',
    publisher: 'userC',
    reason: '支付集成功能缺失，与承诺的功能不符',
  },
  {
    bountyId: 4,
    name: 'Flutter 跨平台移动应用',
    description: '基于Flutter的跨平台移动应用，包含完整的UI组件和状态管理',
    status: 'under_review',
    publisher: 'userD',
    reason: '应用在iOS平台无法编译，存在平台兼容性问题',
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(mockData);
}
