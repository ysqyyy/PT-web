import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

// 禁用默认的body解析，因为我们要使用formidable处理multipart/form-data
export const config = {
    api: {
        bodyParser: false,
    },
};

interface SeedPublishData {
    title: string;
    category: string;
    description: string;
    region: string;
    year: string;
    chineseName: string;
    englishName: string;
    actors: string;
    types: string[];
    releaseGroup: string;
    seedPrice: string;
}

interface SeedPublishResponse {
    id: number;
    title: string;
    category: string;
    description: string;
    region: string;
    year: string;
    chineseName: string;
    englishName: string;
    actors: string;
    types: string[];
    releaseGroup: string;
    seedPrice: string;
    filePath: string;
    publishTime: string;
    publisher: string;
    publisherLevel: string;
    size: string;
    downloads: number;
    seeds: number;
    completions: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    try {
        // 解析form-data
        const form = formidable({
            multiples: false,
            keepExtensions: true,
            uploadDir: path.join(process.cwd(), 'public/uploads'),
            filename: (name, ext, part) => {
                return `${Date.now()}-${part.originalFilename ?? 'file'}`;
            }
        });

        const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                else resolve([fields, files]);
            });
        });

        // 验证必填字段
        const requiredFields = ['title', 'category', 'region', 'year'] as const;
        for (const field of requiredFields) {
            const fieldValue = fields[field]?.[0];
            if (!fieldValue) {
                res.status(400).json({ success: false, message: `${field}不能为空` });
                return;
            }
        }

        // 验证文件
        const file = files.file?.[0];
        if (!file) {
            res.status(400).json({ success: false, message: '请上传种子文件' });
            return;
        }

        if (!file.originalFilename?.endsWith('.torrent')) {
            // 删除已上传的文件
            if (fs.existsSync(file.filepath)) {
                fs.unlinkSync(file.filepath);
            }
            res.status(400).json({ success: false, message: '只能上传.torrent文件' });
            return;
        }

        // 准备种子数据
        const seedData: SeedPublishData = {
            title: fields.title![0], // 已经验证过不为空
            category: fields.category![0],
            description: fields.description?.[0] || '',
            region: fields.region![0],
            year: fields.year![0],
            chineseName: fields.chineseName?.[0] || '',
            englishName: fields.englishName?.[0] || '',
            actors: fields.actors?.[0] || '',
            types: fields.types?.[0] ? JSON.parse(fields.types[0]) : [],
            releaseGroup: fields.releaseGroup?.[0] || '',
            seedPrice: fields.seedPrice?.[0] || '免费',
        };

        // 在实际应用中，这里应该:
        // 1. 将文件保存到永久存储
        // 2. 将种子信息保存到数据库
        // 3. 返回成功响应

        // 模拟数据库操作
        const newSeed: SeedPublishResponse = {
            id: Math.floor(Math.random() * 100000),
            ...seedData,
            filePath: `/uploads/${path.basename(file.filepath)}`,
            publishTime: new Date().toISOString(),
            publisher: '当前用户',
            publisherLevel: '正式会员',
            size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
            downloads: 0,
            seeds: 0,
            completions: 0,
        };

        res.status(200).json({
            success: true,
            message: '种子发布成功',
            data: newSeed
        });

    } catch (error) {
        console.error('种子发布出错:', error);
        res.status(500).json({ success: false, message: '服务器错误' });
    }
}