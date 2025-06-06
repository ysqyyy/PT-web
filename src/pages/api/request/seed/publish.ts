import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const {
            category,
            name,
            size,
            description,
            tags
        } = req.body;

        // 简单校验
        if (!category || !name || !size) {
            res.status(200).json({ success: false, message: '必填字段不能为空' });
            return;
        }

        // 实际应用中这里应该将种子信息保存到数据库
        // 返回模拟的成功响应
        res.status(200).json({
            success: true,
            message: '种子发布成功',
            data: {
                id: Math.floor(Math.random() * 1000), // 模拟生成的ID
                publishTime: new Date().toISOString()
            }
        });
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}