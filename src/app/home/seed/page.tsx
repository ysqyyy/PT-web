"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Navbar from "../../../components/Navbar";
import { useRouter } from "next/navigation";
import { SeedListItem } from "@/types/seed";
import { tagMap } from "@/constants/tags";
import { message } from "antd";
import { useSeed } from "@/hooks/useSeed";
// 定义分类类型
type Category =
  | "全部"
  | "电影"
  | "剧集"
  | "音乐"
  | "动漫"
  | "游戏"
  | "综艺"
  | "体育"
  | "软件"
  | "学习"
  | "纪录片";

export default function SeedCenter() {
  const router = useRouter();
  const { useRecommendSeeds, useSeedSearch, useSeedList } = useSeed();
  // 处理发布按钮点击
  const handlePublishClick = () => {
    router.push("/home/seed/publish");
  };
  // 当前选中的分类
  const [currentCategory, setCurrentCategory] = useState<Category>("全部");

  // 筛选状态 - 只使用一个标签数组
  const [selectedTags, setSelectedTags] = useState<string[]>([]);  const [searchTerm, setSearchTerm] = useState(""); // 搜索关键词  
  const [pageSize, _setPageSize] = useState(2);
  
  const categories: Category[] = [
    "全部",
    "电影",
    "剧集",
    "音乐",
    "动漫",
    "游戏",
    "综艺",
    "体育",
    "纪录片",
  ];

  // 种子列表数据
  const [seedItems, setSeedItems] = useState<SeedListItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);  
  
  // 滚动加载相关
  const loaderRef = useRef<HTMLDivElement>(null);
    // 加载推荐种子列表 - 无限滚动版本
  const { 
    data: recommendedSeedsData, 
    isLoading: isRecommendedLoading,
    fetchNextPage: fetchNextRecommendPage,
    hasNextPage: hasNextRecommendPage,
    isFetchingNextPage: isFetchingNextRecommendPage,
    refetch: refetchRecommendedSeeds,
    isError: isRecommendError
  } = useRecommendSeeds(pageSize);
  
  // 搜索结果 - 无限滚动版本
  const { 
    data: searchResults, 
    isLoading: isSearchLoading,
    fetchNextPage: fetchNextSearchPage,
    hasNextPage: hasNextSearchPage,
    isFetchingNextPage: isFetchingNextSearchPage,
    refetch: refetchSearchResults
  } = useSeedSearch(searchTerm, pageSize);
  
  // 筛选后的种子列表 - 无限滚动版本
  const { 
    data: filteredSeedList, 
    isLoading: isFilteredLoading,
    fetchNextPage: fetchNextFilteredPage,
    hasNextPage: hasNextFilteredPage,
    isFetchingNextPage: isFetchingNextFilteredPage,
    refetch: refetchFilteredSeedList
  } = useSeedList({
    category: currentCategory,
    tags: selectedTags,
    keywords: searchTerm,
    pageSize: pageSize,
  });
  
  // 整合加载状态
  const isLoading = isRecommendedLoading || isSearchLoading || isFilteredLoading;
  const isFetchingNextPage = isFetchingNextRecommendPage || isFetchingNextSearchPage || isFetchingNextFilteredPage;
  const hasNextPage = hasNextRecommendPage || hasNextSearchPage || hasNextFilteredPage;
    // 加载更多数据的函数
  const loadMoreItems = useCallback(() => {
    if (isFetchingNextPage || !hasNextPage) {
      console.log('Skip loading more items:', { isFetchingNextPage, hasNextPage });
      return;
    }
    
    console.log('Loading more items...');
    
    if (selectedTags.length === 0 && currentCategory === "全部" && !searchTerm) {
      console.log('Loading more recommended seeds');
      fetchNextRecommendPage();
    } else if (searchTerm) {
      console.log('Loading more search results for:', searchTerm);
      fetchNextSearchPage();
    } else {
      console.log('Loading more filtered seeds for category:', currentCategory, 'tags:', selectedTags);
      fetchNextFilteredPage();
    }
  }, [
    isFetchingNextPage, 
    hasNextPage, 
    fetchNextRecommendPage, 
    fetchNextSearchPage, 
    fetchNextFilteredPage,
    selectedTags, 
    currentCategory, 
    searchTerm
  ]);
  // 无限滚动处理
  useEffect(() => {
    const currentObserverTarget = loaderRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          console.log('Intersection observed! Loading more items...');
          loadMoreItems();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px 200px 0px' }
    );
    
    if (currentObserverTarget) {
      observer.observe(currentObserverTarget);
      console.log('Observer attached to loader element');
    }
    
    return () => {
      if (currentObserverTarget) {
        observer.unobserve(currentObserverTarget);
      }
    };
  }, [hasNextPage, isFetchingNextPage, loadMoreItems]);
    // 加载推荐种子列表
  useEffect(() => {
    if (recommendedSeedsData && recommendedSeedsData.pages.length > 0) {
      const allSeeds = recommendedSeedsData.pages.flatMap(page => page.seeds || []);
      
      const formattedList = allSeeds.map((item) => ({
        id: item.torrentId,
        name: item.torrentName,
        description: item.torrentDescription,
        tags: item.tags || [],
        size: item.torrentSize,
        price: item.originPrice,
        status: item.status ? item.status : "可用",
        downloadCount: item.downloadCount || 0,
      }));
      
      setSeedItems(formattedList);
      
      // 使用最后一页的总数
      const lastPage = recommendedSeedsData.pages[recommendedSeedsData.pages.length - 1];
      setTotalCount(lastPage.totalItems || 0);
      console.log("加载推荐种子成功，总数:", lastPage.totalItems);
    } else if (isRecommendedLoading) {
      console.log("正在加载推荐种子...");
    } else if (!isRecommendedLoading && (!recommendedSeedsData || recommendedSeedsData.pages.length === 0)) {
      console.log("推荐种子数据为空，尝试重新加载");
      if (selectedTags.length === 0 && currentCategory === "全部" && !searchTerm) {
        refetchRecommendedSeeds();
      }
    }
  }, [recommendedSeedsData, isRecommendedLoading, refetchRecommendedSeeds, selectedTags, currentCategory, searchTerm]);
  
  // 处理搜索结果
  useEffect(() => {
    if (searchTerm && searchResults && searchResults.pages.length > 0) {
      const allSearchResults = searchResults.pages.flatMap(page => page.seeds || []);
      
      const formattedList = allSearchResults.map((item) => ({
        id: item.torrentId,
        name: item.torrentName,
        description: item.torrentDescription || "",
        tags: item.tags || [],
        size: typeof item.torrentSize === 'number' 
          ? item.torrentSize 
          : typeof item.torrentSize === 'string' && !isNaN(parseFloat(item.torrentSize))
            ? parseFloat(item.torrentSize)
            : 0,
        price: item.originPrice || 0,
        status: item.status || "可用",
        downloadCount: item.downloadCount || 0,
      }));
      
      setSeedItems(formattedList);
      
      // 使用最后一页的总数
      const lastPage = searchResults.pages[searchResults.pages.length - 1];
      setTotalCount(lastPage.totalItems || 0);
    }
  }, [searchTerm, searchResults]);
  
  // 获取筛选后的种子列表
  useEffect(() => {
    if (filteredSeedList && filteredSeedList.pages.length > 0 && 
       (selectedTags.length > 0 || currentCategory !== "全部")) {
      
      const allFilteredSeeds = filteredSeedList.pages.flatMap(page => page.torrents || []);
      
      const formattedList = allFilteredSeeds.map((item) => ({
        id: item.torrentId,
        name: item.torrentName,
        description: item.torrentDescription,
        tags: item.tags || [],
        size: item.torrentSize,
        price: item.originPrice,
        status: item.torrentStatus || "未知",
        downloadCount: item.downloadCount || 0,
      }));
      
      setSeedItems(formattedList);
      
      // 使用最后一页的总数
      const lastPage = filteredSeedList.pages[filteredSeedList.pages.length - 1];
      setTotalCount(lastPage.totalItems || 0);
    }
  }, [filteredSeedList, selectedTags, currentCategory]);
  
  // 搜索按钮点击事件
  const handleSearch = () => {
    if (searchTerm) {
      // 重置数据，新的搜索结果会通过 useEffect 加载
      setSeedItems([]);
      setTotalCount(0);
    }
  };  // 切换选择状态
  const toggleSelection = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    item: string
  ) => {
    // 正常的标签切换逻辑
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      // 限制最多选择5个标签
      if (list.length >= 5) {
        message.warning("最多只能选择5个标签");
        return;
      }
      setList([...list, item]);
    }
    
    // 重置数据，新的筛选结果会通过 useEffect 加载
    setSeedItems([]);
    setTotalCount(0);
  };

  // 点击种子名称跳转到详情页
  const handleSeedClick = (seedId: number) => {
    router.push(`/home/seed/detail/${seedId}`);
  }; // 常用标签列表
  const allTags = Object.values(tagMap);
  // 渲染标签筛选条件
  const renderFilterConditions = () => {
    return (
      <div className="w-full">
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() =>
                toggleSelection(selectedTags, setSelectedTags, tag)
              }
              className={`px-3 py-1 rounded text-sm cursor-pointer ${
                selectedTags.includes(tag)
                  ? "bg-[#5E8B7E] text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        <div className="mt-4 text-xs text-gray-500">
          已选择 {selectedTags.length} 个标签
        </div>
      </div>
    );
  };  // 处理分类点击
  const handleCategoryClick = (category: Category) => {
    setCurrentCategory(category);

    // 如果点击"全部"分类，清空已选择的标签
    if (category === "全部") {
      setSelectedTags([]);
    }
    
    // 重置数据，新的筛选结果会通过 useEffect 加载
    setSeedItems([]);
    setTotalCount(0);
  };

  return (
    <Navbar name="种子中心">
      <div className="bg-white rounded-lg shadow p-6">
        {/* 顶部添加发布按钮 */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-teal-700">种子搜索</h1>
          <button
            onClick={handlePublishClick}
            className={` bg-gradient-to-r from-[#5E8B7E] to-[#4F7A6F] cursor-pointer text-white rounded-lg shadow-md hover:shadow-lg hover:from-[#4F7A6F] hover:to-[#3D685F] transition-all duration-300 px-4 py-2 `}
          >
            发布种子
          </button>
        </div>
        {/* 分类导航 */}
        <div className="flex flex-wrap gap-2 mb-6 border-b pb-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`px-4 py-2 rounded transition-colors cursor-pointer ${
                currentCategory === category
                  ? "bg-[#5E8B7E] text-white"
                  : category === "全部"
                  ? "bg-gray-300 text-gray-800 hover:bg-gray-400"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {category === "全部" ? "全部" : category}
            </button>
          ))}
        </div>
        {/* 筛选区域 */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4 text-teal-700">
            请选择标签
            <span className="text-sm font-normal text-gray-500">
              (最多选择5个)
            </span>
          </h2>
          <div className="w-full">{renderFilterConditions()}</div>
        </div>
        {/* 搜索框 */}
        <div className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                const value = e.target.value;
                setSearchTerm(value);
              }}
              className="flex-1 p-2 border border-gray-300 rounded focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
              placeholder="输入关键词搜索..."
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className={` bg-gradient-to-r from-[#5E8B7E] to-[#4F7A6F] cursor-pointer text-white rounded-lg shadow-md hover:shadow-lg hover:from-[#4F7A6F] hover:to-[#3D685F] transition-all duration-300 px-4 py-2 `}
            >
              搜索
            </button>
          </div>
        </div>
        {/* 种子列表卡片视图 */}
        <div className="mb-2 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-teal-700">
            {selectedTags.length === 0 &&
            currentCategory === "全部" &&
            !searchTerm
              ? "推荐种子"
              : "种子列表"}
            {totalCount > 0 && (
              <span className="text-sm font-normal">
                （共 {totalCount} 个）
              </span>
            )}
          </h2>
          {/* <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm border border-teal-600 text-teal-600 rounded hover:bg-teal-50 transition-colors">
              最新发布
            </button>
            <button className="px-3 py-1 text-sm border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors">
              最多下载
            </button>
            <button className="px-3 py-1 text-sm border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors">
              评分最高
            </button>
          </div> */}
        </div>
        {isLoading ? (
          <div className="py-20 flex flex-col justify-center items-center">
            <svg
              className="animate-spin h-10 w-10 text-teal-600 mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="text-gray-500">正在加载种子数据...</p>
          </div>
        ) : seedItems.length === 0 ? (
          <div className="py-20 flex flex-col justify-center items-center bg-gray-50 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-gray-300 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 12H4M12 4v16m8-8a8 8 0 11-16 0 8 8 0 0116 0z"
              />
            </svg>
            <p className="text-gray-500 mb-2">暂无种子数据</p>
            <p className="text-gray-400 text-sm mb-4">
              请尝试调整筛选条件或发布一个新种子
            </p>
            
            {/* 添加重试按钮 */}
            {(isRecommendError || seedItems.length === 0) && (
              <button
                onClick={() => {
                  console.log("重试加载数据");
                  setSeedItems([]);
                  setTotalCount(0);
                  
                  if (selectedTags.length === 0 && currentCategory === "全部" && !searchTerm) {
                    refetchRecommendedSeeds();
                  } else if (searchTerm) {
                    refetchSearchResults();
                  } else {
                    refetchFilteredSeedList();
                  }
                }}
                className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
              >
                重新加载
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {seedItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md hover:border-teal-300 transition-all transform hover:-translate-y-1 cursor-pointer"
                onClick={() => handleSeedClick(item.id)}
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    {/* <span className="px-2 py-1 bg-teal-50 text-teal-700 rounded text-xs font-medium">
                      {item.category}
                    </span> */}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === "可用"
                          ? "bg-green-100 text-green-800"
                          : item.status === "审核中"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <h3 className="font-semibold text-gray-800 text-lg mb-2 line-clamp-2 hover:text-teal-600 transition-colors">
                    {item.name}
                  </h3>

                  {item.description && (
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {item.tags.length > 3 && (
                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{item.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between items-center text-sm mt-4">
                    <div className="flex items-center text-gray-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {item.size}
                    </div>
                    <div
                      className={`font-medium ${
                        item.price > 0 ? "text-amber-600" : "text-green-600"
                      }`}
                    >
                      {item.price > 0 ? `${item.price} 积分` : "免费"}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-t">
                  <div className="flex items-center">
                    {item.downloadCount !== undefined && (
                      <span className="text-xs text-gray-500 mr-3 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                          />
                        </svg>
                        {item.downloadCount}
                      </span>
                    )}
                    {/* {item.score !== undefined && (
                      <span className="text-xs text-gray-500 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        {item.score ? item.score.toFixed(1) : "-"}
                      </span>
                    )} */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
          {/* 无限滚动加载指示器 */}
        {!isLoading && seedItems.length > 0 && (
          <div 
            ref={loaderRef} 
            className="mt-8 py-8 text-center border-t border-gray-200"
            style={{ minHeight: '100px' }}
          >
            {isFetchingNextPage ? (
              <div className="flex justify-center items-center">
                <svg
                  className="animate-spin h-6 w-6 text-teal-600 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="text-gray-600">加载更多...</span>
              </div>
            ) : hasNextPage ? (
              <button 
                onClick={loadMoreItems}
                className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
              >
                加载更多
              </button>
            ) : (
              <span className="text-gray-500">已加载全部内容</span>
            )}
          </div>
        )}
      </div>
    </Navbar>
  );
}
