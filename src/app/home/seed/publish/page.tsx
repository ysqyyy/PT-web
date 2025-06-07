'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '../../../../components/Navbar';
import { useRouter } from 'next/navigation';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { publishSeed, getPublishPresets } from '@/api/seed';

type Category = '电影' | '剧集' | '音乐' | '动漫' | '游戏' | '综艺' | '体育' | '软件' | '学习' | '纪录片';

interface FormData {
    title: string;
    category: Category;
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

export default function SeedPublish() {
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>({
        title: '',
        category: '电影',
        description: '',
        region: '',
        year: '',
        chineseName: '',
        englishName: '',
        actors: '',
        types: [],
        releaseGroup: '',
        seedPrice: '免费',
    });

    const [fileList, setFileList] = useState<any[]>([]);
    const [uploading, setUploading] = useState(false);
    const [presets, setPresets] = useState({
        categories: [] as string[],
        categoryTypes: {} as Record<string, string[]>,
        regions: [] as string[],
        years: [] as string[],
        seedPrices: [] as string[],
    });

    // 获取发布预设选项
    useEffect(() => {
        const fetchPresets = async () => {
            try {
                const res = await getPublishPresets();
                if (res.success) {
                    setPresets(res.data);
                    // 设置默认分类的类型选项
                    if (res.data.categories.length > 0 && !formData.category) {
                        setFormData(prev => ({
                            ...prev,
                            category: res.data.categories[0] as Category
                        }));
                    }
                }
            } catch (error) {
                console.error('获取预设选项失败:', error);
                message.error('获取发布选项失败');
            }
        };

        fetchPresets();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (fileList.length === 0) {
            message.error('请上传种子文件');
            return;
        }

        if (!formData.title || !formData.region || !formData.year) {
            message.error('请填写必填字段');
            return;
        }

        setUploading(true);
        try {
            const res = await publishSeed({
                ...formData,
                file: fileList[0].originFileObj
            });

            if (res.success) {
                message.success('种子发布成功');
                router.push('/home/seed');
            } else {
                message.error(res.message || '种子发布失败');
            }
        } catch (error) {
            console.error('种子发布失败:', error);
            message.error('种子发布失败');
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (info: any) => {
        let fileList = [...info.fileList];
        fileList = fileList.slice(-1); // 限制只能上传一个文件

        // 检查文件类型
        fileList = fileList.filter(file => {
            if (file.type !== 'application/x-bittorrent' && !file.name.endsWith('.torrent')) {
                message.error('只能上传.torrent文件');
                return false;
            }
            return true;
        });

        setFileList(fileList);
    };

    const toggleType = (type: string) => {
        setFormData(prev => ({
            ...prev,
            types: prev.types.includes(type)
                ? prev.types.filter(t => t !== type)
                : [...prev.types, type]
        }));
    };

    return (
        <Navbar name="发布种子">
            <div className="bg-white rounded-lg shadow p-6">
                <h1 className="text-2xl font-bold mb-6">发布种子</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* 文件上传区域 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">种子文件 *</label>
                        <Upload
                            fileList={fileList}
                            onChange={handleFileChange}
                            beforeUpload={() => false}
                            accept=".torrent"
                            maxCount={1}
                        >
                            <Button icon={<UploadOutlined />}>选择.torrent文件</Button>
                        </Upload>
                        <div className="text-xs text-gray-500 mt-1">请选择.torrent格式的种子文件</div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">标题 *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                            placeholder="例如：[大陆][2018]西虹市首富[Hello Mr. Billionaire]沈腾/宋芸桦[喜剧]WEB-DL[4K]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">分类 *</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({
                                ...formData,
                                category: e.target.value as Category,
                                types: []
                            })}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        >
                            {presets.categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">地区 *</label>
                        <select
                            value={formData.region}
                            onChange={(e) => setFormData({...formData, region: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        >
                            <option value="">请选择地区</option>
                            {presets.regions.map(region => (
                                <option key={region} value={region}>{region}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">年份 *</label>
                        <select
                            value={formData.year}
                            onChange={(e) => setFormData({...formData, year: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        >
                            <option value="">请选择年份</option>
                            {presets.years.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">中文名</label>
                        <input
                            type="text"
                            value={formData.chineseName}
                            onChange={(e) => setFormData({...formData, chineseName: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="影片的中文名称"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">英文名</label>
                        <input
                            type="text"
                            value={formData.englishName}
                            onChange={(e) => setFormData({...formData, englishName: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="影片的英文名称"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">主演/主要信息</label>
                        <input
                            type="text"
                            value={formData.actors}
                            onChange={(e) => setFormData({...formData, actors: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="主演、导演或主要创作者，用/分隔"
                        />
                    </div>

                    {formData.category && presets.categoryTypes[formData.category] && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">类型</label>
                            <div className="flex flex-wrap gap-2">
                                {presets.categoryTypes[formData.category].map(type => (
                                    <label key={type} className="flex items-center space-x-1">
                                        <input
                                            type="checkbox"
                                            checked={formData.types.includes(type)}
                                            onChange={() => toggleType(type)}
                                            className="rounded"
                                        />
                                        <span>{type}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">发布组</label>
                        <input
                            type="text"
                            value={formData.releaseGroup}
                            onChange={(e) => setFormData({...formData, releaseGroup: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="发布资源的组织或小组名称"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">种子售价</label>
                        <select
                            value={formData.seedPrice}
                            onChange={(e) => setFormData({...formData, seedPrice: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded"
                        >
                            {presets.seedPrices.map(price => (
                                <option key={price} value={price}>{price}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded"
                            rows={4}
                            placeholder="资源的详细描述，包括内容简介、格式信息、字幕情况等"
                        />
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => router.push('/home/seed')}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                        >
                            取消
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            disabled={uploading}
                        >
                            {uploading ? '发布中...' : '发布'}
                        </button>
                    </div>
                </form>
            </div>
        </Navbar>
    );
}