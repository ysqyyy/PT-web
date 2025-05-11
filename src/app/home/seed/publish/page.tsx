'use client';
import React, { useState } from 'react';
import Navbar from '../../../../components/Navbar';
import { useRouter } from 'next/navigation';

export default function SeedPublish() {
    const router = useRouter();
    const [formData, setFormData] = useState({
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
        seedPrice: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // 处理表单提交逻辑
        console.log('发布种子:', formData);
        // 提交后可以跳转回种子中心或其他页面
        router.push('/home/seed');
    };

    return (
        <Navbar name="发布种子">
            <div className="bg-white rounded-lg shadow p-6">
                <h1 className="text-2xl font-bold mb-6">发布种子</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded"
                        >
                            <option value="电影">电影</option>
                            <option value="剧集">剧集</option>
                            <option value="音乐">音乐</option>
                            <option value="动漫">动漫</option>
                            <option value="游戏">游戏</option>
                            <option value="综艺">综艺</option>
                            <option value="体育">体育</option>
                            <option value="软件">软件</option>
                            <option value="学习">学习</option>
                            <option value="纪录片">纪录片</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">地区</label>
                        <select
                            value={formData.region}
                            onChange={(e) => setFormData({...formData, region: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        >
                            <option value="">请选择</option>
                            {/* 添加更多地区选项 */}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">年份</label>
                        <select
                            value={formData.year}
                            onChange={(e) => setFormData({...formData, year: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        >
                            <option value="">请选择</option>
                            {/* 添加更多年份选项 */}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">中文名</label>
                        <input
                            type="text"
                            value={formData.chineseName}
                            onChange={(e) => setFormData({...formData, chineseName: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">英文名</label>
                        <input
                            type="text"
                            value={formData.englishName}
                            onChange={(e) => setFormData({...formData, englishName: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">主演</label>
                        <input
                            type="text"
                            value={formData.actors}
                            onChange={(e) => setFormData({...formData, actors: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">类型</label>
                        <div className="flex flex-wrap gap-2">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.types.includes('剧情')}
                                    onChange={(e) => {
                                        const types = formData.types.includes('剧情') ? formData.types.filter(t => t !== '剧情') : [...formData.types, '剧情'];
                                        setFormData({...formData, types: types});
                                    }}
                                />
                                剧情
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.types.includes('喜剧')}
                                    onChange={(e) => {
                                        const types = formData.types.includes('喜剧') ? formData.types.filter(t => t !== '喜剧') : [...formData.types, '喜剧'];
                                        setFormData({...formData, types: types});
                                    }}
                                />
                                喜剧
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.types.includes('家庭')}
                                    onChange={(e) => {
                                        const types = formData.types.includes('家庭') ? formData.types.filter(t => t !== '家庭') : [...formData.types, '家庭'];
                                        setFormData({...formData, types: types});
                                    }}
                                />
                                家庭
                            </label>
                            {/* 添加更多类型选项 */}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">发布组</label>
                        <input
                            type="text"
                            value={formData.releaseGroup}
                            onChange={(e) => setFormData({...formData, releaseGroup: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">种子售价</label>
                        <select
                            value={formData.seedPrice}
                            onChange={(e) => setFormData({...formData, seedPrice: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded"
                        >
                            <option value="免费">免费</option>
                            {/* 添加更多售价选项 */}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded"
                            rows={4}
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
                        >
                            发布
                        </button>
                    </div>
                </form>
            </div>
        </Navbar>
    );
}