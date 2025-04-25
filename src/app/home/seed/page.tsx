'use client';
import React, { useState } from 'react';
import Navbar from '../../../components/Navbar';

// 定义分类类型
type Category = '全部' | '电影' | '剧集' | '音乐' | '动漫' | '游戏' | '综艺' | '体育' | '软件' | '学习' | '纪录片' | '其他';

export default function SeedCenter() {
    // 当前选中的分类
    const [currentCategory, setCurrentCategory] = useState<Category>('电影');

    // 筛选状态
    const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
    const [selectedYears, setSelectedYears] = useState<string[]>([]);
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    // 分类列表
    const categories: Category[] = ['全部', '电影', '剧集', '音乐', '动漫', '游戏', '综艺', '体育', '软件', '学习', '纪录片', '其他'];

    // 各分类的筛选条件
    const filterConditions = {
        '电影': {
            regions: ['大陆', '香港', '台湾', '日本', '韩国', '美国', '法国', '英国', '印度', '德国', '泰国', '其他'],
            years: ['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010', '2009', '2008', '2007', '2000-2006', '1990s', '1980s', '1970s', '1970以前', '其他'],
            genres: ['剧情', '喜剧', '家庭', '动作', '运动', '冒险', '爱情', '科幻', '奇幻', '动画', '音乐', '纪录', '传记', '历史', '战争', '西部', '灾难', '犯罪', '恶魔', '恐怖', '惊悚', '舞蹈', '其他']
        },
        '剧集': {
            regions: ['大陆', '港台', '日本', '韩国', '英国', '泰国', '新加坡', '其他'],
            formats: ['4K', '2K', '1080P', '720P', 'PAD', 'BDRip', 'DVDRip', 'HalfCD', 'MiniSD', 'HR-HDTV', 'HDTV', 'RMVB', '其他'],
            releaseGroups: ['7KB', 'NGB', 'CGTV', 'NTb', 'HDSWEB', 'Pre+WEB', 'OurTV', 'QHstudio', 'FLUX', 'PHD', 'KISHD', 'YYeTs', 'Oday', 'CMCTV', '其他']
        },
        '音乐': {
            types: ['不限', '专辑', '合集', 'MV', '演唱会', '单曲', 'EP', '精选集', 'LiveCD', '杂集', '原声', '其他'],
            regions: ['不限', '华语', '欧美', '日本', '韩国', '其他'],
            styles: ['不限', '流行', '摇滚', '乡村', '爵士', '古典', '原声', '纯音乐', '舞曲', '说唱', '其他'],
            formats: ['不限', 'MP3', 'AAC', 'APE', 'FLAC', 'WAV', 'DVDRip', 'VOB', 'MKV', 'WMV', 'MPG', 'RMWB', 'MP4', 'AVI', '其他']
        },
        '动漫': {
            types: ['新番连载', '完结动画', '剧场版', 'OVA', '漫画', '音乐', '演唱会', '其他'],
            resolutions: ['1080P', '720P', '480P', '其他'],
            formats: ['BDMV', 'MKV', 'MP4', 'RMVB', 'AVI', 'WMV', 'ISO', 'FLAC', 'APE', 'MP3', 'ZIP', 'RAR', '其他']
        },
        // 其他分类的筛选条件可以类似添加
    };

    // 切换选择状态
    const toggleSelection = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
        if (list.includes(item)) {
            setList(list.filter(i => i !== item));
        } else {
            setList([...list, item]);
        }
    };

    // 渲染筛选条件
    const renderFilterConditions = () => {
        switch (currentCategory) {
            case '电影':
                return (
                    <>
                        <div>
                            <h3 className="font-medium mb-2">地区:</h3>
                            <div className="flex flex-wrap gap-2">
                                {filterConditions.电影.regions.map(region => (
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
                        <div>
                            <h3 className="font-medium mb-2">年份:</h3>
                            <div className="flex flex-wrap gap-2">
                                {filterConditions.电影.years.map(year => (
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
                        <div>
                            <h3 className="font-medium mb-2">类型:</h3>
                            <div className="flex flex-wrap gap-2">
                                {filterConditions.电影.genres.map(genre => (
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
                    </>
                );
            case '剧集':
                return (
                    <>
                        <div>
                            <h3 className="font-medium mb-2">地区:</h3>
                            <div className="flex flex-wrap gap-2">
                                {filterConditions.剧集.regions.map(region => (
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
                        <div>
                            <h3 className="font-medium mb-2">格式:</h3>
                            <div className="flex flex-wrap gap-2">
                                {filterConditions.剧集.formats.map(format => (
                                    <button
                                        key={format}
                                        onClick={() => toggleSelection(selectedYears, setSelectedYears, format)}
                                        className={`px-3 py-1 rounded text-sm ${selectedYears.includes(format) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                    >
                                        {format}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="font-medium mb-2">发布组:</h3>
                            <div className="flex flex-wrap gap-2">
                                {filterConditions.剧集.releaseGroups.map(group => (
                                    <button
                                        key={group}
                                        onClick={() => toggleSelection(selectedGenres, setSelectedGenres, group)}
                                        className={`px-3 py-1 rounded text-sm ${selectedGenres.includes(group) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                    >
                                        {group}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                );
            // 其他分类的渲染逻辑可以类似添加
            default:
                return <div>暂无筛选条件</div>;
        }
    };

    return (
        <Navbar name="种子中心">
            <div className="bg-white rounded-lg shadow p-6">
                {/* 分类导航 */}
                <div className="flex flex-wrap gap-2 mb-6 border-b pb-4">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setCurrentCategory(category)}
                            className={`px-4 py-2 rounded ${currentCategory === category ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* 筛选区域 */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-4">{currentCategory} - 条件筛选</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {renderFilterConditions()}
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
                        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                            搜索
                        </button>
                    </div>
                </div>

                {/* 这里可以添加种子列表的显示 */}
            </div>
        </Navbar>
    );
}