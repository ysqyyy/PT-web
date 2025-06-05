import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import os from 'os';

// 禁用默认的bodyParser，以便可以处理FormData
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '只支持POST请求' });
  }

  const bountyId = req.query.id as string;

  try {
    // 创建临时目录存储上传的文件
    const uploadDir = path.join(os.tmpdir(), 'bounty-uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 解析FormData
    const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 200 * 1024 * 1024, // 200MB最大文件大小
    });

    const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    // 获取文件和描述
    const file = files.file?.[0];
    const description = fields.description?.[0] || '';

    if (!file) {
      return res.status(400).json({ message: '未提供文件' });
    }

    // 在实际应用中，这里会处理文件存储和数据库记录
    // 这里只是模拟成功响应
    
    return res.status(200).json({
      success: true,
      message: '资源提交成功',
      data: {
        bountyId,
        fileName: file.originalFilename,
        fileSize: file.size,
        description,
      }
    });
  } catch (error) {
    console.error('提交资源出错:', error);
    return res.status(500).json({
      success: false,
      message: '提交资源失败，请稍后重试',
    });
  }
}
