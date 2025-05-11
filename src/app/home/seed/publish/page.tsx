// /home/seed/publish/page.tsx
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
        // 其他表单字段...
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
                <h1 className="text-2xl font-bold mb-6">发布新种子</h1>

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
                        <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded"
                            rows={4}
                        />
                    </div>

                    {/* 可以添加更多表单字段，如文件上传、标签等 */}

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