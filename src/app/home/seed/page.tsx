'use client';
import React, { useState } from 'react';
import Navbar from '../../../components/Navbar';

export default function SeedCenter() {
    // 状态管理
    const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
    const [selectedYears, setSelectedYears] = useState<string[]>([]);
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    // 筛选选项数据
    const regions = ['大陆', '香港', '台湾', '日本', '韩国', '美国', '法国', '英国', '印度', '德国', '泰国', '其他'];
    const years = ['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010', '2009', '2008', '2007', '2000-2006', '1990s', '1980s', '1970s', '1970以前', '其他'];
    const genres = ['剧情', '喜剧', '家庭', '动作', '运动', '冒险', '爱情', '科幻', '奇幻', '动画', '音乐', '纪录', '传记', '历史', '战争', '西部', '灾难', '犯罪', '恶魔', '恐怖', '惊悚', '舞蹈', '其他'];

    // 切换选择状态
    const toggleSelection = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
        if (list.includes(item)) {
            setList(list.filter(i => i !== item));
        } else {
            setList([...list, item]);
        }
    };

    // 模拟种子数据
    const seedItems = [
        {
            id: 1,
            category: '南翔',
            name: '[美国] [百年孤独/Clen años de soledad 第一季](One Hundred Years of Solitude 501 1080p NF WEB-DL DDP 5.1 Atmos H.264-CliDWEB)[501全8集团] 翻译',
            size: '19.28 GB',
            files: 8,
            clicks: 823,
            publishDate: '2024-12-14 08:51',
            seeds: 25,
            downloads: 0,
            completions: 159,
            details: '/ 鲁格罗·帕萨里尼 / 玛莉达·索托 / 爱德华多·德·洛斯·雷耶斯 / 克劳迪',
            tags: ['1080P', '自带中文字幕']
        },
        {
            id: 2,
            category: '蒙特斯诺斯',
            name: '[2024][BBC][太阳系 第一季] 全5集 | 导演: Ben Wilson | 主演: 布莱恩·考克斯 [Solar:System.2024:S01.Complete:1080p.WEB-DL.H264.AAC-UBWEB][自带中文字幕]',
            size: '4.93 GB',
            files: 5,
            clicks: 318,
            publishDate: '03-09 17:00',
            seeds: 9,
            downloads: 0,
            completions: 68,
            tags: ['1080P', '自带中文字幕']
        }
    ];

    // 处理搜索
    const handleSearch = () => {
        // 这里添加实际的搜索逻辑
        console.log('搜索:', searchTerm, selectedRegions, selectedYears, selectedGenres);
    };

    return (
        <Navbar name="种子中心">
            <div className="bg-white rounded-lg shadow p-6">
                {/* 筛选区域 */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-4">电影 - 条件筛选</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* 地区筛选 */}
                        <div>
                            <h3 className="font-medium mb-2">地区:</h3>
                            <div className="flex flex-wrap gap-2">
                                {regions.map(region => (
                                    <button
                                        key={region}
                                        onClick={() => toggleSelection(selectedRegions, setSelectedRegions, region)}
                                        className={`px-3 py-1 rounded text-sm ${selectedRegions.includes(region) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                    >
                                        {region}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 年份筛选 */}
                        <div>
                            <h3 className="font-medium mb-2">年份:</h3>
                            <div className="flex flex-wrap gap-2">
                                {years.map(year => (
                                    <button
                                        key={year}
                                        onClick={() => toggleSelection(selectedYears, setSelectedYears, year)}
                                        className={`px-3 py-1 rounded text-sm ${selectedYears.includes(year) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                    >
                                        {year}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 类型筛选 */}
                        <div>
                            <h3 className="font-medium mb-2">类型:</h3>
                            <div className="flex flex-wrap gap-2">
                                {genres.map(genre => (
                                    <button
                                        key={genre}
                                        onClick={() => toggleSelection(selectedGenres, setSelectedGenres, genre)}
                                        className={`px-3 py-1 rounded text-sm ${selectedGenres.includes(genre) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                    >
                                        {genre}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 搜索框 */}
                <div className="mb-6">
                    <h3 className="font-medium mb-2">请输入搜索词</h3>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 p-2 border border-gray-300 rounded"
                            placeholder="输入关键词搜索..."
                        />
                        <button
                            onClick={handleSearch}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            搜索
                        </button>
                    </div>
                </div>

                {/* 种子列表表格 */}
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 text-left">类别</th>
                            <th className="py-2 px-4 text-left">名称 (种子数量:18172)</th>
                            <th className="py-2 px-4 text-left">操作</th>
                            <th className="py-2 px-4 text-left">大小</th>
                            <th className="py-2 px-4 text-left">文件</th>
                            <th className="py-2 px-4 text-left">点击</th>
                            <th className="py-2 px-4 text-left">发布时间</th>
                            <th className="py-2 px-4 text-left">种子</th>
                            <th className="py-2 px-4 text-left">下载</th>
                            <th className="py-2 px-4 text-left">完成</th>
                        </tr>
                        </thead>
                        <tbody>
                        {seedItems.map(item => (
                            <React.Fragment key={item.id}>
                                <tr className="border-b">
                                    <td className="py-3 px-4">{item.category}</td>
                                    <td className="py-3 px-4">
                                        <div className="font-medium">{item.name}</div>
                                        <div className="text-sm text-gray-500 mt-1">{item.details}</div>
                                        {item.tags && (
                                            <div className="flex gap-2 mt-1">
                                                {item.tags.map(tag => (
                                                    <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded">{tag}</span>
                                                ))}
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        <button className="text-blue-500 hover:text-blue-700">感谢</button>
                                    </td>
                                    <td className="py-3 px-4">{item.size}</td>
                                    <td className="py-3 px-4">{item.files}</td>
                                    <td className="py-3 px-4">{item.clicks}</td>
                                    <td className="py-3 px-4">{item.publishDate}</td>
                                    <td className="py-3 px-4">{item.seeds}</td>
                                    <td className="py-3 px-4">{item.downloads}</td>
                                    <td className="py-3 px-4">{item.completions}</td>
                                </tr>
                            </React.Fragment>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Navbar>
    );
}