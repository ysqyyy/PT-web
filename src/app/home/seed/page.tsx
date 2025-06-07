'use client';
import React, { useState } from 'react';
import Navbar from '../../../components/Navbar';
import { useRouter } from 'next/navigation'; // 引入路由
import { getSeedList } from '@/api/seed';
import { useEffect } from 'react';
// 定义分类类型
type Category =  '电影' | '剧集' | '音乐' | '动漫' | '游戏' | '综艺' | '体育' | '软件' | '学习' | '纪录片' ;

// 定义种子项类型
interface SeedItem {
    id: number;
    category: string;
    name: string;
    size: string;
    files: number;
    clicks: number;
    publishDate: string;
    seeds: number;
    downloads: number;
    completions: number;
    publisher: string;
    details?: string;
    tags?: string[];
}

export default function SeedCenter() {
    const router = useRouter(); // 使用路由
    const handlePublishClick = () => {
        router.push('/home/seed/publish');
    };
    // 当前选中的分类
    const [currentCategory, setCurrentCategory] = useState<Category>('电影');

    // 筛选状态
    const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
    const [selectedYears, setSelectedYears] = useState<string[]>([]);
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    // 分类列表
    const categories: Category[] = ['电影', '剧集', '音乐', '动漫', '游戏', '综艺', '体育', '软件', '学习', '纪录片'];

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
        // 其他分类的筛选条件...
    };

    // 模拟种子数据
    const [seedItems, setSeedItems] = useState<SeedItem[]>([]);
    const [loading, setLoading] = useState(false);
    // 添加获取种子列表的函数
    const fetchSeedList = async () => {
        setLoading(true);
        try {
            const res = await getSeedList({
                category: currentCategory,
                regions: selectedRegions,
                years: selectedYears,
                genres: selectedGenres,
                searchTerm
            });
            if (res.success) {
                setSeedItems(res.data);
            }
        } catch (error) {
            console.error('获取种子列表失败:', error);
        } finally {
            setLoading(false);
        }
    };

// 添加 useEffect 监听筛选条件变化
    useEffect(() => {
        fetchSeedList();
    }, [currentCategory, selectedRegions, selectedYears, selectedGenres, searchTerm]);

// 修改搜索按钮的点击事件
    const handleSearch = () => {
        fetchSeedList();
    };

    // 切换选择状态
    const toggleSelection = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
        if (list.includes(item)) {
            setList(list.filter(i => i !== item));
        } else {
            setList([...list, item]);
        }
    };

    // 点击种子名称跳转到详情页
    const handleSeedClick = (seedId: number) => {
        router.push(`/home/seed/detail/${seedId}`); //
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
                            <h3 className="font-medium mb-2">压制组:</h3>
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

            case '动漫':
                return (
                    <>
                        <div>
                            <h3 className="font-medium mb-2">类型:</h3>
                            <div className="flex flex-wrap gap-2">
                                {filterConditions.动漫.types.map(type => (
                                    <button
                                        key={type}
                                        onClick={() => toggleSelection(selectedRegions, setSelectedRegions, type)}
                                        className={`px-3 py-1 rounded text-sm ${selectedRegions.includes(type) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="font-medium mb-2">分辨率:</h3>
                            <div className="flex flex-wrap gap-2">
                                {filterConditions.动漫.resolutions.map(resolution => (
                                    <button
                                        key={resolution}
                                        onClick={() => toggleSelection(selectedYears, setSelectedYears, resolution)}
                                        className={`px-3 py-1 rounded text-sm ${selectedYears.includes(resolution) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                    >
                                        {resolution}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="font-medium mb-2">格式:</h3>
                            <div className="flex flex-wrap gap-2">
                                {filterConditions.动漫.formats.map(format => (
                                    <button
                                        key={format}
                                        onClick={() => toggleSelection(selectedGenres, setSelectedGenres, format)}
                                        className={`px-3 py-1 rounded text-sm ${selectedGenres.includes(format) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                    >
                                        {format}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                );

            case '音乐':
                return (
                    <>
                        <div>
                            <h3 className="font-medium mb-2">类型:</h3>
                            <div className="flex flex-wrap gap-2">
                                {filterConditions.音乐.types.map(type => (
                                    <button
                                        key={type}
                                        onClick={() => toggleSelection(selectedRegions, setSelectedRegions, type)}
                                        className={`px-3 py-1 rounded text-sm ${selectedRegions.includes(type) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="font-medium mb-2">地区:</h3>
                            <div className="flex flex-wrap gap-2">
                                {filterConditions.音乐.regions.map(region => (
                                    <button
                                        key={region}
                                        onClick={() => toggleSelection(selectedYears, setSelectedYears, region)}
                                        className={`px-3 py-1 rounded text-sm ${selectedYears.includes(region) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                    >
                                        {region}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="font-medium mb-2">格式:</h3>
                            <div className="flex flex-wrap gap-2">
                                {filterConditions.音乐.formats.map(format => (
                                    <button
                                        key={format}
                                        onClick={() => toggleSelection(selectedGenres, setSelectedGenres, format)}
                                        className={`px-3 py-1 rounded text-sm ${selectedGenres.includes(format) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                    >
                                        {format}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                );

            case '游戏':
                return (
                    <>
                        <div>
                            <h3 className="font-medium mb-2">游戏类型:</h3>
                            <div className="flex flex-wrap gap-2">
                                {['动作', '冒险', '角色扮演', '策略', '模拟', '体育', '竞速', '格斗', '射击', '益智', '其他'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => toggleSelection(selectedGenres, setSelectedGenres, type)}
                                        className={`px-3 py-1 rounded text-sm ${selectedGenres.includes(type) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="font-medium mb-2">平台:</h3>
                            <div className="flex flex-wrap gap-2">
                                {['PC', 'Switch', 'PS5', 'PS4', 'Xbox', '手机', '模拟器', '其他'].map(platform => (
                                    <button
                                        key={platform}
                                        onClick={() => toggleSelection(selectedRegions, setSelectedRegions, platform)}
                                        className={`px-3 py-1 rounded text-sm ${selectedRegions.includes(platform) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                    >
                                        {platform}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="font-medium mb-2">格式:</h3>
                            <div className="flex flex-wrap gap-2">
                                {['ISO', '压缩包', '绿色版', '安装版', '镜像', '其他'].map(format => (
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
                    </>
                );

            case '综艺':
                return (
                    <>
                        <div>
                            <h3 className="font-medium mb-2">类型:</h3>
                            <div className="flex flex-wrap gap-2">
                                {['真人秀', '选秀', '脱口秀', '竞技', '访谈', '美食', '旅游', '其他'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => toggleSelection(selectedGenres, setSelectedGenres, type)}
                                        className={`px-3 py-1 rounded text-sm ${selectedGenres.includes(type) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                    </>
                );

            case '体育':
                return (
                    <>
                        <div>
                            <h3 className="font-medium mb-2">运动类型:</h3>
                            <div className="flex flex-wrap gap-2">
                                {['足球', '篮球', '网球', 'F1', '高尔夫', '游泳', '田径', '电竞', '其他'].map(sport => (
                                    <button
                                        key={sport}
                                        onClick={() => toggleSelection(selectedGenres, setSelectedGenres, sport)}
                                        className={`px-3 py-1 rounded text-sm ${selectedGenres.includes(sport) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                    >
                                        {sport}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="font-medium mb-2">赛事:</h3>
                            <div className="flex flex-wrap gap-2">
                                {['世界杯', '奥运会', '欧冠', 'NBA', '英超', '西甲', '中超', '其他'].map(event => (
                                    <button
                                        key={event}
                                        onClick={() => toggleSelection(selectedRegions, setSelectedRegions, event)}
                                        className={`px-3 py-1 rounded text-sm ${selectedRegions.includes(event) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                    >
                                        {event}
                                    </button>
                                ))}
                            </div>
                        </div>

                    </>
                );

            case '软件':
                return (
                    <>
                        <div>
                            <h3 className="font-medium mb-2">软件类型:</h3>
                            <div className="flex flex-wrap gap-2">
                                {['操作系统', '办公软件', '图形图像', '多媒体', '安全相关', '网络工具', '编程开发', '系统工具', '其他'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => toggleSelection(selectedGenres, setSelectedGenres, type)}
                                        className={`px-3 py-1 rounded text-sm ${selectedGenres.includes(type) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="font-medium mb-2">平台:</h3>
                            <div className="flex flex-wrap gap-2">
                                {['Windows', 'Mac', 'Linux', 'Android', 'iOS', '跨平台', '其他'].map(platform => (
                                    <button
                                        key={platform}
                                        onClick={() => toggleSelection(selectedRegions, setSelectedRegions, platform)}
                                        className={`px-3 py-1 rounded text-sm ${selectedRegions.includes(platform) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                    >
                                        {platform}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="font-medium mb-2">语言:</h3>
                            <div className="flex flex-wrap gap-2">
                                {['中文', '英文', '多国语言', '其他'].map(lang => (
                                    <button
                                        key={lang}
                                        onClick={() => toggleSelection(selectedYears, setSelectedYears, lang)}
                                        className={`px-3 py-1 rounded text-sm ${selectedYears.includes(lang) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                    >
                                        {lang}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                );

            case '学习':
                return (
                    <>
                        <div>
                            <h3 className="font-medium mb-2">资料类型:</h3>
                            <div className="flex flex-wrap gap-2">
                                {['电子书', '视频教程', '音频课程', '文档资料', '考试题库', '学术论文', '其他'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => toggleSelection(selectedGenres, setSelectedGenres, type)}
                                        className={`px-3 py-1 rounded text-sm ${selectedGenres.includes(type) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="font-medium mb-2">学科:</h3>
                            <div className="flex flex-wrap gap-2">
                                {['计算机', '语言', '数学', '物理', '化学', '生物', '医学', '经济', '法律', '人文', '其他'].map(subject => (
                                    <button
                                        key={subject}
                                        onClick={() => toggleSelection(selectedRegions, setSelectedRegions, subject)}
                                        className={`px-3 py-1 rounded text-sm ${selectedRegions.includes(subject) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                    >
                                        {subject}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="font-medium mb-2">语言:</h3>
                            <div className="flex flex-wrap gap-2">
                                {['中文', '英文', '日文', '韩文', '其他'].map(lang => (
                                    <button
                                        key={lang}
                                        onClick={() => toggleSelection(selectedYears, setSelectedYears, lang)}
                                        className={`px-3 py-1 rounded text-sm ${selectedYears.includes(lang) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                    >
                                        {lang}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                );

            case '纪录片':
                return (
                    <>
                        <div>
                            <h3 className="font-medium mb-2">类型:</h3>
                            <div className="flex flex-wrap gap-2">
                                {['自然', '历史', '科学', '社会', '人文', '旅行', '美食', '军事', '其他'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => toggleSelection(selectedGenres, setSelectedGenres, type)}
                                        className={`px-3 py-1 rounded text-sm ${selectedGenres.includes(type) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>


                    </>
                );
            default:
                return <div>暂无筛选条件</div>;
        }

    };

    return (
        <Navbar name="种子中心">
            <div className="bg-white rounded-lg shadow p-6">
                {/* 顶部添加发布按钮 */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">种子中心</h1>
                    <button
                        onClick={handlePublishClick}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    >
                        发布种子
                    </button>
                </div>
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

                {/* 种子列表表格 */}
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="py-2 px-4 text-left border">类别</th>
                            <th className="py-2 px-4 text-left border">名称 (种子数目:263)</th>
                            <th className="py-2 px-4 text-left border">操作</th>
                            <th className="py-2 px-4 text-left border">大小</th>
                            <th className="py-2 px-4 text-left border">文件</th>
                            <th className="py-2 px-4 text-left border">点击</th>
                            <th className="py-2 px-4 text-left border">发布时间</th>
                            <th className="py-2 px-4 text-left border">种子</th>
                            <th className="py-2 px-4 text-left border">下载</th>
                            <th className="py-2 px-4 text-left border">完成</th>
                            <th className="py-2 px-4 text-left border">发布者</th>
                        </tr>
                        </thead>
                        <tbody>
                        {seedItems.map(item => (
                            <tr key={item.id} className="border-b hover:bg-gray-50">
                                <td className="py-2 px-4 border">{item.category}</td>
                                <td className="py-2 px-4 border">
                                    <div
                                        className="font-medium cursor-pointer hover:text-blue-500"
                                        onClick={() => handleSeedClick(item.id)}
                                    >
                                        {item.name}
                                    </div>
                                    {item.details && <div className="text-sm text-gray-500">{item.details}</div>}
                                    {item.tags && (
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {item.tags.map(tag => (
                                                <span key={tag} className="text-xs bg-gray-100 px-2 py-0.5 rounded">{tag}</span>
                                            ))}
                                        </div>
                                    )}
                                </td>
                                <td className="py-2 px-4 border">
                                    <button className="text-blue-500 hover:text-blue-700">感谢</button>
                                </td>
                                <td className="py-2 px-4 border">{item.size}</td>
                                <td className="py-2 px-4 border">{item.files}</td>
                                <td className="py-2 px-4 border">{item.clicks}</td>
                                <td className="py-2 px-4 border">{item.publishDate}</td>
                                <td className="py-2 px-4 border">{item.seeds}</td>
                                <td className="py-2 px-4 border">{item.downloads}</td>
                                <td className="py-2 px-4 border">{item.completions}</td>
                                <td className="py-2 px-4 border">{item.publisher}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Navbar>
    );
}