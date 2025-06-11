import { NextApiRequest, NextApiResponse } from 'next';
import { CommentReply } from '@/types/comment';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // 获取路径参数中的评论ID
    const commentId = parseInt(req.query.id as string, 10);
    
    if (!commentId) {
      return res.status(400).json({
        success: false,
        message: '请提供有效的评论ID',
        data: []
      });
    }    // 在实际项目中，这里会从数据库获取评论的回复
    // 这里生成一些随机回复数据
    const replies: CommentReply[] = [];
    const replyCount = Math.floor(Math.random() * 5) + 1; // 1-5条回复
    
    for (let i = 0; i < replyCount; i++) {
      replies.push({
        id: commentId * 100 + i + 1,
        parentId: commentId,
        content: `这是对评论 ${commentId} 的随机回复 ${i + 1}`,
        author: {
          id: String(Math.floor(Math.random() * 8) + 1),
          username: `用户${Math.floor(Math.random() * 1000)}`,
          avatar: '/default-avatar.svg',
          level: '中级用户'
        },
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 86400000)).toISOString(), // 随机1天内的时间
        likes: Math.floor(Math.random() * 10),
        isLiked: Math.random() > 0.7
      });
    }

    // 按时间排序（最新的在前）
    const sortedReplies = replies.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );    // 返回回复数据
    return res.status(200).json({
      success: true,
      message: '获取回复成功',
      data: sortedReplies
    });
  } catch (error) {
    console.error('获取回复失败:', error);
    return res.status(500).json({
      success: false,
      message: '服务器错误，获取回复失败',
      data: []
    });
  }
}
