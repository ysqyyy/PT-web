import type { NextApiRequest, NextApiResponse } from 'next';

// 模拟用户积分数据
const userPoints = {
    'user1': {
        bonusPoints: 1250.5,
        tokens: 85,
        exp: 3200,
        uploadCredit: 256.8,
        level: 4
    }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        // 获取积分信息
        const points = userPoints['user1']; // 实际应从认证信息获取用户ID
        res.status(200).json({ success: true, data: points });
    } else if (req.method === 'POST') {
        // 积分兑换
        const { fromType, toType, amount } = req.body;
        // 兑换逻辑...
        res.status(200).json({ success: true, data: userPoints['user1'] });
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}