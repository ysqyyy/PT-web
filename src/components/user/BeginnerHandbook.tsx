"use client";

import React, { useState } from 'react';

interface HandbookSection {
    title: string;
    content: string;
}

const handbookContent: HandbookSection[] = [
    {
        title: '一、Ratio机制详解',
        content: `什么是Ratio？

Ratio(分享率)是PT站中衡量用户上传量与下载量比值的指标，计算公式为：

Ratio = 总上传量 / 总下载量

Ratio的重要性

站点资源分配的公平性指标

决定账户等级晋升的关键因素

低Ratio可能导致下载权限受限
如何保持良好Ratio？

初始阶段：从小体积资源开始下载，确保能长期做种

平衡策略：下载1GB内容前，确保有至少1.5GB上传量

优先选择：下载免费种子或优惠种子(如2X上传)

长期做种：下载后保持种子活跃，持续上传
Ratio警戒线

警告线：Ratio < 0.5 (持续一周)

限制线：Ratio < 0.3 (下载速度将被限制)

封禁线：Ratio < 0.1 (可能面临账户封禁)`,
    },
    {
        title: '二、上传规则详解',
        content: `可上传资源类型

影视类：蓝光原盘、REMUX、WEB-DL、HDTV等高清资源

音乐类：无损音频(FLAC,APE)、高清音乐视频

游戏类：正版游戏镜像、更新补丁

软件类：正版商业软件、专业工具

其他：电子书、学习资料等稀缺资源
禁止上传内容

有版权争议或盗版明显的资源

低质量转码资源(如<720p的视频)

重复资源(已有相同版本在站)

含有病毒或恶意软件的文件
文件格式要求

视频：建议MKV或MP4容器，H.264/H.265编码

音频：FLAC(16/44.1起)，不接受MP3等有损格式

压缩包：必须包含恢复记录(5%以上)
上传流程

准备完整的媒体信息(NFO)

制作规范的种子文件

填写详细的资源描述

选择正确的分类标签

等待管理员审核(通常2-12小时)`,
    },
    {
        title: '三、做种指南',
        content: `做种基础

保持客户端24/7在线最佳

建议上传带宽不低于5Mbps

每个种子至少保持72小时做种
提高做种效率的技巧

端口转发：在路由器设置端口映射

连接设置：适当增加最大连接数(建议200-500)

做种优先级：新种和稀缺种优先获得上传量

做种积分：长期做种可获得额外积分奖励
种子保活策略

定期检查种子健康度(至少每周一次)

对老旧种子偶尔手动强制校验

避免频繁暂停/继续做种

使用可靠的存储设备(避免硬盘损坏)
积分系统

每小时做种积分 = 种子大小(GB) × 做种系数

稀缺种子(做种者<5人)可获得3倍积分

积分可兑换上传量或特殊权限`,
    },
    {
        title: '四、论坛使用说明',
        content: `发帖规范

标题格式：[分类] 简明主题 (如"[求助] 关于Ratio计算的问题")

内容需详细清晰，避免"如题"等简短描述

技术问题需提供客户端版本、错误日志等信息

禁止发布无关广告或外站链接
评论礼仪

回复前先阅读已有讨论，避免重复提问

对资源发布者表示感谢是良好习惯

争议性话题保持理性讨论

禁止人身攻击或恶意嘲讽
评分系统

对优质资源或有帮助的帖子可给予"感谢"

每日有固定评分额度，请合理使用

评分会显示在帖子下方，请公正评价
板块介绍

新手区：基础问题解答

资源区：资源求档和发布讨论

技术区：客户端设置、网络优化等

公告区：重要站点通知`,
    },
    {
        title: '五、常见问题解答',
        content: `Q: 我的Ratio很低，如何快速提升？
A: 优先下载免费种子，同时保持现有种子长期做种。也可通过论坛活动获取额外上传量。

Q: 为什么我的上传速度很慢？
A: 检查端口是否开放，连接数设置是否合理，也可尝试连接更多种子增加机会。

Q: 资源下载到99%停止怎么办？
A: 耐心等待，可能是暂时缺少某个区块。也可在论坛相应板块求助补种。

Q: 如何知道自己上传的资源是否合格？
A: 上传前可在论坛"预检区"发帖咨询，或参考站内上传指南的详细标准。

希望本手册能帮助您顺利开始PT之旅！如有其他问题，欢迎在论坛新手区提问，我们的社区成员会很乐意提供帮助。祝您在站内有愉快的分享体验！`,
    },
];

const BeginnerHandbook: React.FC = () => {
    const [openSection, setOpenSection] = useState<number | null>(null);

    const toggleSection = (index: number) => {
        setOpenSection(openSection === index ? null : index);
    };    return (
        <div className="w-full">
            <div className="flex items-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h2 className="text-2xl font-bold text-gray-800">PT站新手手册</h2>
            </div>
            <div className="space-y-4">
                {handbookContent.map((section, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                        <button
                            className={`w-full text-left p-4 flex justify-between items-center focus:outline-none transition-colors duration-200 ${
                                openSection === index ? 'bg-gradient-to-r from-[#5E8B7E] to-[#4F7A6F] text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-800'
                            }`}
                            onClick={() => toggleSection(index)}
                        >
                            <h3 className="text-lg font-medium flex items-center">
                                {openSection === index ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                )}
                                {section.title}
                            </h3>
                        </button>
                        {openSection === index && (
                            <div className="p-5 text-gray-700 whitespace-pre-line bg-white border-t border-gray-200">
                                {section.content}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BeginnerHandbook;