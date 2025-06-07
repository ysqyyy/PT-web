import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { seedId } = req.body;

        if (!seedId) {
            res.status(200).json({ success: false, message: '种子ID不能为空' });
            return;
        }

        // 实际应用中这里应该更新数据库中的感谢信息
        res.status(200).json({
            success: true,
            message: '感谢成功'
        });
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}