import { Comment, CommentReply } from '@/types/comment';

// 生成随机日期（在过去30天内）
const getRandomDate = () => {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 30);
  const hoursAgo = Math.floor(Math.random() * 24);
  const minutesAgo = Math.floor(Math.random() * 60);
  
  now.setDate(now.getDate() - daysAgo);
  now.setHours(now.getHours() - hoursAgo);
  now.setMinutes(now.getMinutes() - minutesAgo);
  
  return now.toISOString();
};

// 随机用户数据
const users = [
  { id: '1', username: '云上风筝', avatar: '/default-avatar.svg', level: '初级用户' },
  { id: '2', username: '流水潺潺', avatar: '/default-avatar.svg', level: '中级用户' },
  { id: '3', username: '树影婆娑', avatar: '/default-avatar.svg', level: '高级用户' },
  { id: '4', username: '幕落星河', avatar: '/default-avatar.svg', level: '专家' },
  { id: '5', username: '晨曦微光', avatar: '/default-avatar.svg', level: '大师' },
  { id: '6', username: '夏日蝉鸣', avatar: '/default-avatar.svg', level: '传奇' },
  { id: '7', username: '秋叶静美', avatar: '/default-avatar.svg', level: '新手' },
  { id: '8', username: '冬雪皑皑', avatar: '/default-avatar.svg', level: '初级用户' },
];

// 评论内容模板
const commentTemplates = [
  '这个资源非常不错，感谢分享！',
  '下载速度很快，质量也很高，赞一个。',
  '我找了很久的资源，终于在这里找到了，谢谢！',
  '内容很全面，对我帮助很大。',
  '这个版本比我之前用的要好很多，推荐大家使用。',
  '画质很清晰，音质也不错，满意！',
  '资源整理得很用心，值得收藏。',
  '内容比预期的还要丰富，非常满意这次下载。',
  '这个系列的资源都很棒，期待更多更新。',
  '虽然体积不小，但内容十分值得，感谢分享！',
];

// 回复内容模板
const replyTemplates = [
  '同感，我也觉得很不错！',
  '谢谢你的评价，我也是这么认为的。',
  '是的，质量确实很高。',
  '请问这个资源你用了多久？效果怎么样？',
  '我也下载了，确实很好用！',
  '可以分享一下你的使用体验吗？',
  '我遇到了一些问题，可以请教一下吗？',
  '这个比上一版本提升很大。',
  '我觉得这个资源的最大亮点是...',
  '有没有类似的推荐？',
];

// 生成随机回复
const generateReplies = (parentId: number, count: number): CommentReply[] => {
  const replies: CommentReply[] = [];
  
  for (let i = 0; i < count; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomTemplate = replyTemplates[Math.floor(Math.random() * replyTemplates.length)];
    
    replies.push({
      id: parentId * 100 + i + 1,
      parentId,
      content: randomTemplate,
      author: randomUser,
      createdAt: getRandomDate(),
      likes: Math.floor(Math.random() * 10),
      isLiked: Math.random() > 0.7,
    });
  }
  
  return replies;
};

// 生成随机评论
export const generateComments = (seedId: number, count: number): Comment[] => {
  const comments: Comment[] = [];
  
  for (let i = 0; i < count; i++) {
    const commentId = i + 1;
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomTemplate = commentTemplates[Math.floor(Math.random() * commentTemplates.length)];
    const replyCount = Math.floor(Math.random() * 5); // 0-4条回复
    
    comments.push({
      id: commentId,
      content: randomTemplate,
      author: randomUser,
      createdAt: getRandomDate(),
      likes: Math.floor(Math.random() * 20),
      isLiked: Math.random() > 0.7,
      replies: generateReplies(commentId, Math.min(2, replyCount)), // 初始显示最多2条回复
      replyCount,
    });
  }
  
  // 按时间排序（最新的在前）
  return comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// 预生成一些评论数据
export const mockCommentsBySeedId: Record<number, Comment[]> = {
  1: generateComments(1, 8),
  2: generateComments(2, 5),
  3: generateComments(3, 12),
  4: generateComments(4, 3),
  5: generateComments(5, 0), // 无评论的情况
};

// 模拟API函数
export const mockGetSeedComments = async (seedId: number): Promise<Comment[]> => {
  return new Promise((resolve) => {
    // 模拟网络延迟
    setTimeout(() => {
      resolve(mockCommentsBySeedId[seedId] || []);
    }, 800);
  });
};

export const mockPostComment = async (seedId: number, content: string): Promise<Comment> => {
  return new Promise((resolve) => {
    // 模拟网络延迟
    setTimeout(() => {
      const comments = mockCommentsBySeedId[seedId] || [];
      const newComment: Comment = {
        id: Date.now(),
        content,
        author: users[0], // 假设当前用户是第一个用户
        createdAt: new Date().toISOString(),
        likes: 0,
        isLiked: false,
        replies: [],
        replyCount: 0,
      };
      
      // 添加到模拟数据中
      if (!mockCommentsBySeedId[seedId]) {
        mockCommentsBySeedId[seedId] = [];
      }
      mockCommentsBySeedId[seedId] = [newComment, ...comments];
      
      resolve(newComment);
    }, 600);
  });
};

export const mockReplyToComment = async (commentId: number, content: string): Promise<CommentReply> => {
  return new Promise((resolve) => {
    // 模拟网络延迟
    setTimeout(() => {
      // 在所有评论中查找要回复的评论
      let targetComment: Comment | undefined;
      let seedId: number | undefined;
      
      for (const [id, comments] of Object.entries(mockCommentsBySeedId)) {
        const found = comments.find(comment => comment.id === commentId);
        if (found) {
          targetComment = found;
          seedId = Number(id);
          break;
        }
      }
      
      if (!targetComment || !seedId) {
        throw new Error('Comment not found');
      }
      
      const newReply: CommentReply = {
        id: Date.now(),
        parentId: commentId,
        content,
        author: users[0], // 假设当前用户是第一个用户
        createdAt: new Date().toISOString(),
        likes: 0,
        isLiked: false,
      };
      
      // 添加到模拟数据中
      targetComment.replies.push(newReply);
      targetComment.replyCount += 1;
      
      resolve(newReply);
    }, 600);
  });
};

export const mockLikeComment = async (commentId: number): Promise<{ success: boolean, likes: number }> => {
  return new Promise((resolve) => {
    // 模拟网络延迟
    setTimeout(() => {
      // 在所有评论中查找要点赞的评论或回复
      for (const [_, comments] of Object.entries(mockCommentsBySeedId)) {
        // 检查一级评论
        const comment = comments.find(c => c.id === commentId);
        if (comment) {
          comment.isLiked = !comment.isLiked;
          comment.likes += comment.isLiked ? 1 : -1;
          resolve({ success: true, likes: comment.likes });
          return;
        }
        
        // 检查回复
        for (const c of comments) {
          const reply = c.replies.find(r => r.id === commentId);
          if (reply) {
            reply.isLiked = !reply.isLiked;
            reply.likes += reply.isLiked ? 1 : -1;
            resolve({ success: true, likes: reply.likes });
            return;
          }
        }
      }
      
      resolve({ success: false, likes: 0 });
    }, 400);
  });
};

export const mockGetCommentReplies = async (commentId: number): Promise<CommentReply[]> => {
  return new Promise((resolve) => {
    // 模拟网络延迟
    setTimeout(() => {
      // 在所有评论中查找要获取回复的评论
      for (const [_, comments] of Object.entries(mockCommentsBySeedId)) {
        const comment = comments.find(c => c.id === commentId);
        if (comment) {
          // 生成所有回复（假设之前只加载了部分回复）
          const allReplies = generateReplies(commentId, comment.replyCount);
          // 更新回复数据
          comment.replies = allReplies;
          resolve(allReplies);
          return;
        }
      }
      
      resolve([]);
    }, 700);
  });
};
