'use client';
import React from 'react';
import Navbar from '../../../../../components/Navbar';
import { useParams } from 'next/navigation';

// 定义种子详情类型
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
}

export default function SeedDetailPage() {
    const params = useParams();
    const seedId = params.id; // 获取路由中的种子ID

    // 模拟种子详情数据 - 实际应用中应该根据seedId从API获取
    const seedDetail: SeedDetail = {
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
        seedId: '1',
        files: 1,
        seeds: 2,
        downloads: 0,
        completions: 15,
        attachments: 0,
        description: '改编自1985年电影《布鲁斯特的百万横财》，讲述了一个落魄守门员王多鱼意外获得继承权，但必须在一个月内花光十亿的故事。',
        otherVersions: ['特笑大片', '西虹市首富']
    };

    return (
        <Navbar name="种子详情">
            <div className="bg-white rounded-lg shadow p-6">
                {/* 种子标题区域 */}
                <div className="mb-6 border-b pb-4">
                    <h1 className="text-2xl font-bold mb-2">
                        {seedDetail.title} {seedDetail.originalTitle && `[${seedDetail.originalTitle}]`}
                    </h1>
                    <div className="text-gray-600">
                        [{seedDetail.region}][{seedDetail.year}][{seedDetail.title}][{seedDetail.originalTitle}][{seedDetail.actors.join('/')}][{seedDetail.genres.join('/')}][{seedDetail.quality}][{seedDetail.resolution}][{seedDetail.subtitles}]
                    </div>
                </div>

                {/* 操作按钮区域 */}
                <div className="flex flex-wrap gap-4 mb-6 border-b pb-4">
                    <div className="flex-1">
                        <div className="text-sm text-gray-500 mb-1">发种人：{seedDetail.publisher} ({seedDetail.publisherLevel})</div>
                        <div className="flex flex-wrap gap-2">
                            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                下载种子
                            </button>
                            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                                收藏
                            </button>
                            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                                奖励保种积分
                            </button>
                            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                                网页播放
                            </button>
                            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                                私信
                            </button>
                        </div>
                    </div>
                </div>

                {/* 种子基本信息 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <div className="text-sm text-gray-500">大小</div>
                                <div className="font-medium">{seedDetail.size}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">回复/查看</div>
                                <div className="font-medium">{seedDetail.repliesViews}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">发布时间</div>
                                <div className="font-medium">{seedDetail.publishTime}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">最后做种时间</div>
                                <div className="font-medium">{seedDetail.lastSeedTime}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">种子ID</div>
                                <div className="font-medium">{seedDetail.seedId}</div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <div className="text-sm text-gray-500">文件</div>
                                <div className="font-medium">{seedDetail.files}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">种子</div>
                                <div className="font-medium">{seedDetail.seeds}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">下载</div>
                                <div className="font-medium">{seedDetail.downloads}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">完成</div>
                                <div className="font-medium">{seedDetail.completions}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">附件</div>
                                <div className="font-medium">{seedDetail.attachments}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 查看详情按钮 */}
                <div className="mb-6">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        查看详情
                    </button>
                </div>

                {/* 其他版本 */}
                {seedDetail.otherVersions && seedDetail.otherVersions.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">其他版本</h3>
                        <div className="flex flex-wrap gap-2">
                            {seedDetail.otherVersions.map((version, index) => (
                                <span key={index} className="px-3 py-1 bg-gray-100 rounded text-sm">
                                    {version}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* 电影海报和简介区域 - 可以根据需要添加 */}
                {seedDetail.description && (
                    <div className="border-t pt-4">
                        <h3 className="text-lg font-semibold mb-2">简介</h3>
                        <p className="text-gray-700">{seedDetail.description}</p>
                    </div>
                )}
            </div>
        </Navbar>
    );
}