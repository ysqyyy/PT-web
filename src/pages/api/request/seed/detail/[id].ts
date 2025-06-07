import type { NextApiRequest, NextApiResponse } from 'next';

interface SeedDetail {
    id: number;
    title: string;
    originalTitle: string;
    year: string;
    region: string;
    actors: string[];
    genres: string[];
    quality: string;
    resolution: string;
    subtitles: string;
    publisher: string;
    publisherLevel: string;
    size: string;
    repliesViews: string;
    publishTime: string;
    lastSeedTime: string;
    seedId: string;
    files: number;
    seeds: number;
    downloads: number;
    completions: number;
    attachments: number;
    description?: string;
    otherVersions?: string[];
    rating?: number;
    ratingCount?: number;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const { id } = req.query;

        // 模拟数据 - 实际应从数据库获取
        const seedDetail: SeedDetail = {
            id: Number(id),
            title: '西虹市首富',
            originalTitle: 'Hello Mr. Billionaire',
            year: '2018',
            region: '大陆',
            actors: ['沈腾', '宋芸桦', '张一鸣', '张晨光', '常远', '魏翔'],
            genres: ['喜剧'],
            quality: 'WEB-DL',
            resolution: '4K',
            subtitles: '自带中英字幕',
            publisher: 'bingzhixie',
            publisherLevel: '无双隐士',
            size: '6.94 GB',
            repliesViews: '0/101',
            publishTime: '2024-11-16 10:59',
            lastSeedTime: '16:35',
            seedId: id as string,
            files: 1,
            seeds: 2,
            downloads: 0,
            completions: 15,
            attachments: 0,
            description: '改编自1985年电影《布鲁斯特的百万横财》，讲述了一个落魄守门员王多鱼意外获得继承权，但必须在一个月内花光十亿的故事。',
            otherVersions: ['特笑大片', '西虹市首富'],
            rating: 4.5,
            ratingCount: 128
        };

        res.status(200).json({
            success: true,
            data: seedDetail
        });
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}