import type { NextApiRequest, NextApiResponse } from 'next';
import { CommentReply } from '@/types/comment';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { commentId, content } = req.body;

        // 简单校验
        if (!commentId || !content || content.length < 2) {
            res.status(200).json({
                success: false,
                message: '回复内容不能为空'
            });
            return;
        }

        // 实际应用中这里应该将回复保存到数据库
        // 返回模拟的成功响应
        const newReply: CommentReply = {
            id: Date.now(),
            parentId: commentId,
            content,
            author: {
                id: '1',
                username: '当前用户',
                avatar: '/default-avatar.svg',
                level: '中级用户'
            },
            createdAt: new Date().toISOString(),
            likes: 0,
            isLiked: false
        };

        res.status(200).json({
            success: true,
            message: '回复成功',
            data: newReply
        });
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
