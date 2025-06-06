'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '../../../../../components/Navbar';
import { useParams } from 'next/navigation';
import { message } from 'antd';
import { getSeedDetail, rateSeed } from '@/api/seed';
import { getSeedComments, postComment, likeComment } from '@/api/comment';

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
    const [seedDetail, setSeedDetail] = useState<SeedDetail | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(false);

    // 获取种子详情和评论
    useEffect(() => {
        const fetchData = async () => {
            if (!seedId) return;

            setLoading(true);
            try {
                const [detailRes, commentsRes] = await Promise.all([
                    getSeedDetail(Number(seedId)),
                    getSeedComments(Number(seedId))
                ]);

                if (detailRes.success) {
                    setSeedDetail(detailRes.data);
                    setRating(detailRes.data.rating || 0);
                }
                if (commentsRes.success) setComments(commentsRes.data);
            } catch (error) {
                console.error('获取数据失败:', error);
                message.error('获取种子详情失败');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [seedId]);

    // 提交评论
    const handleSubmitComment = async () => {
        if (newComment.trim().length < 5) {
            message.error('评论至少需要5个字符');
            return;
        }

        try {
            const res = await postComment(Number(seedId), newComment);
            if (res.success) {
                setComments([res.data, ...comments]);
                setNewComment('');
                message.success('评论发表成功');
            }
        } catch (error) {
            console.error('发表评论失败:', error);
            message.error('发表评论失败');
        }
    };

    // 点赞评论
    const handleLikeComment = async (id: number) => {
        try {
            const res = await likeComment(id);
            if (res.success) {
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
            }
        } catch (error) {
            console.error('点赞失败:', error);
            message.error('点赞失败');
        }
    };

    // 提交评分
    const handleSubmitRating = async () => {
        if (rating === 0) {
            message.error('请选择评分');
            return;
        }

        try {
            const res = await rateSeed(Number(seedId), rating);
            if (res.success) {
                message.success(`感谢您的评分: ${rating}星`);
                if (seedDetail) {
                    setSeedDetail({
                        ...seedDetail,
                        rating: rating,
                        ratingCount: (seedDetail.ratingCount || 0) + 1
                    });
                }
            }
        } catch (error) {
            console.error('评分失败:', error);
            message.error('评分失败');
        }
    };

    if (loading) {
        return (
            <Navbar name="种子详情">
                <div className="bg-white rounded-lg shadow p-6 text-center">
                    加载中...
                </div>
            </Navbar>
        );
    }

    if (!seedDetail) {
        return (
            <Navbar name="种子详情">
                <div className="bg-white rounded-lg shadow p-6 text-center">
                    未找到种子信息
                </div>
            </Navbar>
        );
    }

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
                            <span className="text-3xl font-bold">{seedDetail.rating || 0}</span>
                            <span className="text-gray-500">/5分</span>
                        </div>
                        <div className="text-gray-500">
                            {seedDetail.ratingCount || 0}人评分
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
                        {comments.length === 0 ? (
                            <div className="text-center text-gray-500 py-4">暂无评论</div>
                        ) : (
                            comments.map((comment) => (
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
                            ))
                        )}
                    </div>
                </div>
            </div>
        </Navbar>
    );
}