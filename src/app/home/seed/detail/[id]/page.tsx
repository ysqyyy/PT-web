'use client';
import React, { useState } from 'react';
import Navbar from '../../../../../components/Navbar';
import { useParams } from 'next/navigation';

// 定义种子详情和评论类型
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

interface Comment {
    id: number;
    username: string;
    avatar: string;
    level: string;
    content: string;
    time: string;
    likes: number;
    isLiked: boolean;
}

export default function SeedDetailPage() {
    const params = useParams();
    const seedId = params.id;
    const [newComment, setNewComment] = useState('');
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    // 模拟种子详情数据
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
        otherVersions: ['特笑大片', '西虹市首富'],
        rating: 4.5,
        ratingCount: 128
    };

    // 模拟评论数据
    const [comments, setComments] = useState<Comment[]>([
        {
            id: 1,
            username: 'runningrabbit',
            avatar: '',
            level: '高级会员',
            content: '这个电影需要仔细看',
            time: '2024-11-16 11:30',
            likes: 5,
            isLiked: false
        },
        {
            id: 2,
            username: 'tumbleweed',
            avatar: '',
            level: '正式会员',
            content: '用什么播放器显示字幕',
            time: '2024-11-16 12:15',
            likes: 2,
            isLiked: false
        }
    ]);

    // 提交评论
    const handleSubmitComment = () => {
        if (newComment.trim().length < 5) {
            alert('评论至少需要5个字符');
            return;
        }

        const newCommentObj: Comment = {
            id: comments.length + 1,
            username: '当前用户',
            avatar: '',
            level: '正式会员',
            content: newComment,
            time: new Date().toLocaleString(),
            likes: 0,
            isLiked: false
        };

        setComments([newCommentObj, ...comments]);
        setNewComment('');
    };

    // 点赞评论
    const handleLikeComment = (id: number) => {
        setComments(comments.map(comment => {
            if (comment.id === id) {
                return {
                    ...comment,
                    likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
                    isLiked: !comment.isLiked
                };
            }
            return comment;
        }));
    };

    // 提交评分
    const handleSubmitRating = () => {
        if (rating === 0) {
            alert('请选择评分');
            return;
        }
        alert(`感谢您的评分: ${rating}星`);
        // 实际应用中这里应该调用API提交评分
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

                {/* 资源评分区域 */}
                <div className="mb-6 border-b pb-4">
                    <h2 className="text-xl font-bold mb-4">资源评分</h2>
                    <div className="flex items-center mb-4">
                        <div className="mr-4">
                            <span className="text-3xl font-bold">{seedDetail.rating}</span>
                            <span className="text-gray-500">/5分</span>
                        </div>
                        <div className="text-gray-500">
                            {seedDetail.ratingCount}人评分
                        </div>
                    </div>

                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">我要评分</h3>
                        <div className="flex items-center mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    className="text-2xl focus:outline-none"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                >
                                    {star <= (hoverRating || rating) ? '★' : '☆'}
                                </button>
                            ))}
                        </div>
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={handleSubmitRating}
                        >
                            提交评分
                        </button>
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

                {/* 电影简介 */}
                {seedDetail.description && (
                    <div className="mb-6 border-t pt-4">
                        <h3 className="text-lg font-semibold mb-2">简介</h3>
                        <p className="text-gray-700">{seedDetail.description}</p>
                    </div>
                )}

                {/* 评论区域 */}
                <div className="border-t pt-6">
                    <h2 className="text-xl font-bold mb-4">评论 ({comments.length})</h2>

                    {/* 发表评论 */}
                    <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <textarea
                className="w-full p-3 border rounded mb-2"
                rows={3}
                placeholder="至少回复5个字符，按ctrl+回车直接回复"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.ctrlKey && e.key === 'Enter' && handleSubmitComment()}
            />
                        <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {newComment.length}/5
              </span>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                onClick={handleSubmitComment}
                                disabled={newComment.trim().length < 5}
                            >
                                发表评论
                            </button>
                        </div>
                    </div>

                    {/* 评论列表 */}
                    <div className="space-y-4">
                        {comments.map((comment) => (
                            <div key={comment.id} className="border-b pb-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <span className="font-semibold">{comment.username}</span>
                                        <span className="text-sm text-gray-500 ml-2">{comment.level}</span>
                                    </div>
                                    <span className="text-sm text-gray-500">{comment.time}</span>
                                </div>
                                <p className="mb-2">{comment.content}</p>
                                <div className="flex justify-end">
                                    <button
                                        className="flex items-center text-sm text-gray-500 hover:text-blue-500"
                                        onClick={() => handleLikeComment(comment.id)}
                                    >
                    <span className={`mr-1 ${comment.isLiked ? 'text-blue-500' : ''}`}>
                      {comment.isLiked ? '♥' : '♡'}
                    </span>
                                        {comment.likes > 0 && <span>{comment.likes}</span>}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Navbar>
    );
}