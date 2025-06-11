import { NextApiRequest, NextApiResponse } from 'next';
import { Comment } from '@/types/comment';
import { generateComments } from '@/mock/comment';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // 获取路径参数中的种子ID
    const seedId = req.query.id as string;
      if (!seedId) {
      return res.status(400).json({
        success: false,
        message: '请提供有效的种子ID',
        data: []
      });
    }
    
    // 生成随机评论数据作为模拟数据
    const comments: Comment[] = generateComments(parseInt(seedId, 10), 10);

    // 返回评论数据
    return res.status(200).json({
      success: true,
      message: '获取评论成功',
      data: comments
    });
  } catch (error) {
    console.error('获取评论失败:', error);
    return res.status(500).json({
      success: false,
      message: '服务器错误，获取评论失败',
      data: []
    });
  }
}
