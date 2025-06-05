'use client';
import React, { useState } from 'react';
import Navbar from '../../../../components/Navbar';
import { useRouter } from 'next/navigation';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

// 定义分类类型
type Category = '电影' | '剧集' | '音乐' | '动漫' | '游戏' | '综艺' | '体育' | '软件' | '学习' | '纪录片';

// 定义各分类对应的类型选项
const categoryTypes: Record<Category, string[]> = {
    '电影': ['剧情', '喜剧', '家庭', '动作', '运动', '冒险', '爱情', '科幻', '奇幻', '动画', '音乐', '纪录', '传记', '历史', '战争', '西部', '灾难', '犯罪', '恐怖', '惊悚', '舞蹈', '其他'],
    '剧集': ['剧情', '喜剧', '家庭', '动作', '悬疑', '爱情', '科幻', '奇幻', '动画', '纪录', '传记', '历史', '战争', '犯罪', '恐怖', '惊悚', '其他'],
    '音乐': ['流行', '摇滚', '乡村', '爵士', '古典', '原声', '纯音乐', '舞曲', '说唱', '电子', '民谣', 'R&B', '其他'],
    '动漫': ['热血', '搞笑', '恋爱', '校园', '科幻', '奇幻', '冒险', '悬疑', '推理', '恐怖', '运动', '音乐', '日常', '治愈', '其他'],
    '游戏': ['动作', '冒险', '角色扮演', '策略', '模拟', '体育', '竞速', '格斗', '射击', '益智', '其他'],
    '综艺': ['真人秀', '选秀', '脱口秀', '竞技', '访谈', '美食', '旅游', '其他'],
    '体育': ['足球', '篮球', '网球', 'F1', '高尔夫', '游泳', '田径', '电竞', '其他'],
    '软件': ['操作系统', '办公软件', '图形图像', '多媒体', '安全相关', '网络工具', '编程开发', '系统工具', '其他'],
    '学习': ['计算机', '语言', '数学', '物理', '化学', '生物', '医学', '经济', '法律', '人文', '其他'],
    '纪录片': ['自然', '历史', '科学', '社会', '人文', '旅行', '美食', '军事', '其他']
};

// 定义地区选项
const regions = ['大陆', '香港', '台湾', '日本', '韩国', '美国', '法国', '英国', '印度', '德国', '泰国', '其他'];

// 定义年份选项
const years = Array.from({length: 30}, (_, i) => (new Date().getFullYear() - i).toString()).concat(['2000-2006', '1990s', '1980s', '1970s', '1970以前']);

export default function SeedPublish() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        category: '电影' as Category,
        description: '',
        region: '',
        year: '',
        chineseName: '',
        englishName: '',
        actors: '',
        types: [] as string[],
        releaseGroup: '',
        seedPrice: '免费',
    });
    const [fileList, setFileList] = useState<any[]>([]);
    const [uploading, setUploading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (fileList.length === 0) {
            message.error('请上传种子文件');
            return;
        }

        setUploading(true);
        try {
            // 这里应该是实际的API调用
            // const form = new FormData();
            // form.append('file', fileList[0]);
            // form.append('data', JSON.stringify(formData));
            // await fetch('/api/seed/publish', { method: 'POST', body: form });

            // 模拟上传延迟
            await new Promise(resolve => setTimeout(resolve, 1000));

            message.success('种子发布成功');
            router.push('/home/seed');
        } catch (error) {
            message.error('种子发布失败');
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (info: any) => {
        let fileList = [...info.fileList];

        // 限制只能上传一个文件
        fileList = fileList.slice(-1);

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
                        <label className="block text-sm font-medium text-gray-700 mb-1">种子文件</label>
                        <Upload
                            fileList={fileList}
                            onChange={handleFileChange}
                            beforeUpload={() => false} // 阻止自动上传
                            accept=".torrent"
                            maxCount={1}
                        >
                            <Button icon={<UploadOutlined />}>选择.torrent文件</Button>
                        </Upload>
                        <div className="text-xs text-gray-500 mt-1">请选择.torrent格式的种子文件</div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value as Category, types: []})}
                            className="w-full p-2 border border-gray-300 rounded"
                        >
                            {Object.keys(categoryTypes).map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
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
                            <option value="">请选择地区</option>
                            {regions.map(region => (
                                <option key={region} value={region}>{region}</option>
                            ))}
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
                            <option value="">请选择年份</option>
                            {years.map(year => (
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">类型</label>
                        <div className="flex flex-wrap gap-2">
                            {categoryTypes[formData.category].map(type => (
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
                            <option value="免费">免费</option>
                            <option value="1积分">1积分</option>
                            <option value="2积分">2积分</option>
                            <option value="5积分">5积分</option>
                            <option value="10积分">10积分</option>
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