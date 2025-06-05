// mock: /api/request/user/profile/messages
import type { NextApiRequest, NextApiResponse } from 'next';
import type { UserMessage } from '@/types/user';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // 模拟用户消息数据
    const mockUserMessages: UserMessage[] = [
      {
        id: 1,
        content: "您的悬赏「React项目模板」已被接受",
        date: "2025-06-01",
        read: false
      },
      {
        id: 2,
        content: "您发布的资源「Vue组件库」已通过审核",
        date: "2025-05-28",
        read: true
      },
      {
        id: 3,
        content: "您的账户已成功充值500积分",
        date: "2025-05-25",
        read: true
      },
      {
        id: 4,
        content: "您申请的仲裁已通过，悬赏金已退回",
        date: "2025-05-20",
        read: false
      },
      {
        id: 5,
        content: "系统公告：平台将于6月10日进行维护升级",
        date: "2025-05-15",
        read: true
      }
    ];

    // 返回用户消息数据
    res.status(200).json(mockUserMessages);
  } else {
    // 如果不是GET请求，返回405 Method Not Allowed
    res.status(405).json({ 
      success: false, 
      message: '方法不允许' 
    });
  }
}
