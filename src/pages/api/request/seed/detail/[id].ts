import type { NextApiRequest, NextApiResponse } from 'next';
import { SeedDetail } from '@/types/seed';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("Handling request for seed detail...");
    if (req.method === 'GET') {
        const { id } = req.query;
        console.log("Received request for seed detail with ID:", id);

        // 定义多组模拟数据
        const seedDetails: Record<string, SeedDetail> = {
            // 西虹市首富
            1: {
                id: 1,
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
                seedId: "1",
                files: 1,
                seeds: 2,
                downloads: 0,
                completions: 15,
                attachments: 0,
                description: '改编自1985年电影《布鲁斯特的百万横财》，讲述了一个落魄守门员王多鱼意外获得继承权，但必须在一个月内花光十亿的故事。',
                otherVersions: ['特笑大片', '西虹市首富'],
                rating: 4.5,
                ratingCount: 128
            },
            
            // 流浪地球
            2: {
                id: 2,
                title: '流浪地球',
                originalTitle: 'The Wandering Earth',
                year: '2019',
                region: '大陆',
                actors: ['吴京', '屈楚萧', '李光洁', '吴孟达', '赵今麦'],
                genres: ['科幻', '灾难', '冒险'],
                quality: 'BluRay',
                resolution: '4K HDR',
                subtitles: '中英双语',
                publisher: 'stardust',
                publisherLevel: '终极大师',
                size: '25.34 GB',
                repliesViews: '42/1024',
                publishTime: '2025-02-05 08:30',
                lastSeedTime: '今天 09:15',
                seedId: "2",
                files: 5,
                seeds: 56,
                downloads: 127,
                completions: 432,
                attachments: 2,
                description: '根据刘慈欣同名小说改编，讲述了太阳即将毁灭，人类在地球表面建造巨大的推进器，寻找新家园的故事。',
                otherVersions: ['4K修复版', 'IMAX特别版', '导演剪辑版'],
                rating: 4.8,
                ratingCount: 3568
            },
            
            // 让子弹飞
            3: {
                id: 3,
                title: '让子弹飞',
                originalTitle: 'Let the Bullets Fly',
                year: '2010',
                region: '大陆',
                actors: ['姜文', '葛优', '周润发', '刘嘉玲', '陈坤'],
                genres: ['剧情', '喜剧', '动作', '西部'],
                quality: 'BluRay',
                resolution: '1080P',
                subtitles: '中文内嵌字幕',
                publisher: 'filmfanatic',
                publisherLevel: '高级会员',
                size: '12.75 GB',
                repliesViews: '78/2145',
                publishTime: '2024-09-23 14:22',
                lastSeedTime: '昨天 23:42',
                seedId: "3",
                files: 3,
                seeds: 21,
                downloads: 89,
                completions: 256,
                attachments: 1,
                description: '故事发生在1920年代的中国，一个马匪团伙劫持了一列火车，随后冒充县长，与当地恶霸黄四郎展开了一场斗智斗勇的较量。',
                otherVersions: ['珍藏版', '修复版'],
                rating: 4.9,
                ratingCount: 4219
            },
            
            // 星际穿越
            4: {
                id: 4,
                title: '星际穿越',
                originalTitle: 'Interstellar',
                year: '2014',
                region: '美国',
                actors: ['马修·麦康纳', '安妮·海瑟薇', '杰西卡·查斯坦', '麦肯齐·弗依', '迈克尔·凯恩'],
                genres: ['科幻', '冒险', '剧情'],
                quality: 'BluRay',
                resolution: '4K HDR',
                subtitles: '中英双语',
                publisher: 'spacelover',
                publisherLevel: '资深玩家',
                size: '32.45 GB',
                repliesViews: '56/3421',
                publishTime: '2025-01-12 18:45',
                lastSeedTime: '今天 10:20',
                seedId: "4",
                files: 7,
                seeds: 43,
                downloads: 145,
                completions: 389,
                attachments: 3,
                description: '在不久的将来，地球面临粮食危机，一组宇航员必须穿越虫洞，前往另一个星系寻找适合人类居住的新家园。',
                otherVersions: ['IMAX版', '导演剪辑版', 'HDR版'],
                rating: 4.7,
                ratingCount: 5231
            },
            
            // 你的名字
            5: {
                id: 5,
                title: '你的名字',
                originalTitle: 'Your Name',
                year: '2016',
                region: '日本',
                actors: ['上白石萌音', '神木隆之介', '长泽雅美', '市原悦子', '成田凌'],
                genres: ['动画', '爱情', '奇幻'],
                quality: 'BluRay',
                resolution: '1080P',
                subtitles: '中日双语',
                publisher: 'animefan',
                publisherLevel: '动漫专家',
                size: '8.56 GB',
                repliesViews: '126/5678',
                publishTime: '2025-03-15 12:34',
                lastSeedTime: '今天 08:45',
                seedId: "5",
                files: 2,
                seeds: 87,
                downloads: 234,
                completions: 765,
                attachments: 5,
                description: '讲述了生活在日本乡村的女高中生三叶和生活在东京的男高中生泷在梦中相遇，并交换了身体的奇幻故事。',
                otherVersions: ['典藏版', '4K修复版'],
                rating: 4.9,
                ratingCount: 8752
            }
        };

        // 获取请求的ID对应的数据，如果没有则返回默认数据
        let seedDetail = seedDetails.id;
        console.log("Fetched seed detail:", seedDetail);
          // 如果没有找到对应ID的数据，则返回ID为1的数据作为默认
        if (!seedDetail) {
            // 复制ID为1的数据，并修改ID和seedId字段
            seedDetail = {...seedDetails["1"]};
            seedDetail.id = Number(id);
            seedDetail.seedId = id as string;
        }

        res.status(200).json({
            success: true,
            data: seedDetail
        });
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}