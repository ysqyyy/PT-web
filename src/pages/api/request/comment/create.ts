import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { seedId, content } = req.body;

        // 简单校验
        if (!seedId || !content || content.length < 5) {
            res.status(200).json({
                success: false,
                message: '评论内容至少需要5个字符'
            });
            return;
        }

        // 实际应用中这里应该将评论保存到数据库
        // 返回模拟的成功响应
        res.status(200).json({
            success: true,
            message: '评论发表成功',
            data: {
                id: Math.floor(Math.random() * 1000), // 模拟生成的ID
                username: '当前用户',
                avatar: '',
                level: '正式会员',
                content,
                time: new Date().toLocaleString(),
                likes: 0,
                isLiked: false
            }
        });
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}