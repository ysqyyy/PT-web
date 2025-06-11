import type { NextApiRequest, NextApiResponse } from 'next';

interface SeedItem {
    id: number;
    category: string;
    name: string;
    description?: string;
    size: string;
    price: number;
    status: string;
    imgUrl?: string;
    tags?: string[];
    downloadCount?: number;
    score?: number;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
       

        console.log('种子列表请求参数:', req.body);

        // 这里应该是从数据库查询的逻辑
        // 以下是模拟数据
        const mockData: SeedItem[] = [
            {
                id: 1,
                category: '电影',
                name: '西红柿首富 Hello Mr. Billionaire (2018)',
                description: '沈腾主演的喜剧电影，讲述了一个落魄守门员一夜之间成为富翁的故事。',
                size: '6.94 GB',
                price: 0,
                status: '可用',
                imgUrl: 'https://img1.doubanio.com/view/photo/l/public/p2529206747.webp',
                tags: ['喜剧', '大陆', '2018', '4K', 'WEB-DL'],
                downloadCount: 1358,
                score: 7.5
            },
            {
                id: 2,
                category: '电影',
                name: '流浪地球 The Wandering Earth (2019)',
                description: '根据刘慈欣同名小说改编，讲述了太阳即将毁灭，人类将地球推离太阳系的故事。',
                size: '8.56 GB',
                price: 10,
                status: '可用',
                imgUrl: 'https://img2.doubanio.com/view/photo/l/public/p2545472803.webp',
                tags: ['科幻', '灾难', '大陆', '2019', '4K', 'HDR'],
                downloadCount: 2478,
                score: 8.0
            },
        ];

    
        res.status(200).json({
            success: true,
            data: mockData
        });
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}