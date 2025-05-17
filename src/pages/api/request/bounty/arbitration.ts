// mock: /api/request/bounty/arbitration
import type { NextApiRequest, NextApiResponse } from 'next';
import type { ArbitrationBounty } from '@/types/bounty';

const mockData: ArbitrationBounty[] = [
  {
    id: 1,
    title: '电影《流浪地球2》高清版',
    amount: 50,
    status: '仲裁中',
    publisher: 'userA',
    description: '求1080P无水印资源',
    arbitrationReason: '资源与描述不符，无法播放',
  },
  {
    id: 2,
    title: '软件 Adobe Photoshop 2024',
    amount: 100,
    status: '仲裁中',
    publisher: 'userB',
    description: '需要正版安装包',
    arbitrationReason: '提供的资源为盗版，且有病毒',
  },
  {
    id: 3,
    title: '纪录片《人类星球》全集',
    amount: 30,
    status: '仲裁中',
    publisher: 'userC',
    description: 'BBC高清纪录片',
    arbitrationReason: '资源缺集，且清晰度不符',
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(mockData);
}
