import type { NextApiRequest, NextApiResponse } from 'next';

interface Comment {
    id: number;
    username: string;
    avatar: string;
    level: string;
    content: string;
    time: string;
    likes: number;
    isLiked: boolean;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const { seedId } = req.query;

        // 模拟数据 - 实际应从数据库获取
        const comments: Comment[] = [
            {
                id: 1,
                username: 'runningrabbit',
                avatar: '',
                level: '高级会员',
                content: '这个电影需要仔细看',
                time: '2024-11-16 11:30',
                likes: 5,
                isLiked: false
            },
            {
                id: 2,
                username: 'tumbleweed',
                avatar: '',
                level: '正式会员',
                content: '用什么播放器显示字幕',
                time: '2024-11-16 12:15',
                likes: 2,
                isLiked: false
            }
        ];

        res.status(200).json({
            success: true,
            data: comments
        });
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}