import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { commentId } = req.body;

        if (!commentId) {
            res.status(200).json({ success: false, message: '评论ID不能为空' });
            return;
        }

        // 实际应用中这里应该更新数据库中的点赞信息
        res.status(200).json({
            success: true,
            message: '点赞成功'
        });
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}