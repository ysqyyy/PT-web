import type { NextApiRequest, NextApiResponse } from 'next';

interface UserPoints {
    userId: string;
    bonusPoints: number;
    tokens: number;
    exp: number;
    uploadCredit: number;
    level: number;
}

// 模拟数据库
const userPointsDB: Record<string, UserPoints> = {
    'user1': {
        userId: 'user1',
        bonusPoints: 1250.5,
        tokens: 85,
        exp: 3200,
        uploadCredit: 256.8,
        level: 4
    }
};

// 兑换比例配置
const EXCHANGE_RATES = {
    bonusPointsToTokens: 10, // 10魔力值=1点券
    tokensToBonusPoints: 0.1 // 1点券=0.1魔力值
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // 修改为类型安全的用户ID获取方式
    const userId = Array.isArray(req.headers['x-user-id'])
        ? req.headers['x-user-id'][0] || 'user1'
        : req.headers['x-user-id'] || 'user1';

    if (req.method === 'GET') {
        try {
            const userPoints = userPointsDB[userId] || {
                userId,
                bonusPoints: 0,
                tokens: 0,
                exp: 0,
                uploadCredit: 0,
                level: 1
            };

            return res.status(200).json({
                success: true,
                data: {
                    bonusPoints: userPoints.bonusPoints,
                    tokens: userPoints.tokens,
                    exp: userPoints.exp,
                    uploadCredit: userPoints.uploadCredit,
                    level: userPoints.level
                }
            });
        } catch (error) {
            console.error('获取积分信息失败:', error);
            return res.status(500).json({ error: '获取积分信息失败' });
        }
    }

    if (req.method === 'POST') {
        try {
            const { fromType, toType, amount } = req.body;

            if (!fromType || !toType || typeof amount !== 'number' || amount <= 0) {
                return res.status(400).json({ error: '无效的请求参数' });
            }

            const userPoints = userPointsDB[userId] || {
                userId,
                bonusPoints: 0,
                tokens: 0,
                exp: 0,
                uploadCredit: 0,
                level: 1
            };

            if (fromType === 'bonusPoints' && userPoints.bonusPoints < amount) {
                return res.status(400).json({ error: '魔力值不足' });
            }
            if (fromType === 'tokens' && userPoints.tokens < amount) {
                return res.status(400).json({ error: '点券不足' });
            }

            let result = 0;
            if (fromType === 'bonusPoints' && toType === 'tokens') {
                result = amount / EXCHANGE_RATES.bonusPointsToTokens;
            } else if (fromType === 'tokens' && toType === 'bonusPoints') {
                result = amount * EXCHANGE_RATES.tokensToBonusPoints;
            } else {
                return res.status(400).json({ error: '不支持此兑换类型' });
            }

            const updatedPoints = {
                ...userPoints,
                bonusPoints: fromType === 'bonusPoints'
                    ? userPoints.bonusPoints - amount
                    : toType === 'bonusPoints'
                        ? userPoints.bonusPoints + result
                        : userPoints.bonusPoints,
                tokens: fromType === 'tokens'
                    ? userPoints.tokens - amount
                    : toType === 'tokens'
                        ? userPoints.tokens + result
                        : userPoints.tokens
            };

            userPointsDB[userId] = updatedPoints;

            return res.status(200).json({
                success: true,
                message: '兑换成功',
                data: {
                    bonusPoints: updatedPoints.bonusPoints,
                    tokens: updatedPoints.tokens,
                    exp: updatedPoints.exp,
                    uploadCredit: updatedPoints.uploadCredit,
                    level: updatedPoints.level
                }
            });

        } catch (error) {
            console.error('兑换失败:', error);
            return res.status(500).json({ error: '兑换失败' });
        }
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
}