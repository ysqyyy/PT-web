import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { seedId, rating } = req.body;

        if (!seedId || !rating || rating < 1 || rating > 5) {
            res.status(200).json({
                success: false,
                message: '评分必须在1-5之间'
            });
            return;
        }

        // 实际应用中这里应该更新数据库中的评分信息
        res.status(200).json({
            success: true,
            message: '评分成功'
        });
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}