import type { NextApiRequest, NextApiResponse } from 'next';

interface SeedItem {
    id: number;
    category: string;
    name: string;
    size: string;
    files: number;
    clicks: number;
    publishDate: string;
    seeds: number;
    downloads: number;
    completions: number;
    publisher: string;
    details?: string;
    tags?: string[];
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const {
            category = '电影',
            regions = [],
            years = [],
            genres = [],
            searchTerm = '',
            page = 1,
            pageSize = 10
        } = req.body;

        // 这里应该是从数据库查询的逻辑
        // 以下是模拟数据
        const mockData: SeedItem[] = [
            {
                id: 1,
                category: '电影',
                name: '[大陆][2018][西红柿首富/Hello Mr. Billionaire]沈腾/宋芸桦/张一鸣/张晨光/常远/魏翔[喜剧]WEB-DL[4K][自带中英字幕]',
                size: '6.94 GB',
                files: 1,
                clicks: 101,
                publishDate: '2024-11-16 10:59',
                seeds: 2,
                downloads: 0,
                completions: 13,
                publisher: 'bingzhixie'
            },
            // 其他模拟数据...
        ];

        // 简单模拟筛选逻辑
        let filteredData = mockData.filter(item => {
            let match = true;
            if (category && item.category !== category) match = false;
            if (searchTerm && !item.name.includes(searchTerm)) match = false;
            return match;
        });

        // 分页
        const startIndex = (page - 1) * pageSize;
        const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

        res.status(200).json({
            success: true,
            data: paginatedData,
            total: filteredData.length
        });
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}