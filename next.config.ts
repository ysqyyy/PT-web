import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // 启用内存缓存，提高编译速度
  onDemandEntries: {
    // 页面在内存中保留的时间（毫秒）
    maxInactiveAge: 60 * 60 * 1000,
    // 同时保存在内存中的页面数
    pagesBufferLength: 5,
  },
  // 配置允许的图片域名
  images: {
    domains: ['localhost'], // 允许从localhost加载图片
  },
  // 优化构建速度
  swcMinify: true, // 使用SWC进行压缩而非Terser
  // 忽略错误的构建，用于开发环境
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  webpack: (config) => {
    // 添加 watchOptions 来忽略系统临时文件
    config.watchOptions = {
      ...config.watchOptions,
      ignored: Array.isArray(config.watchOptions?.ignored)
        ? [...config.watchOptions.ignored, 'C:\\DumpStack.log.tmp']
        : ['C:\\DumpStack.log.tmp', '**/node_modules/**']
    };
    
    // 开发环境性能优化
    if (process.env.NODE_ENV === 'development') {
      // 减少源码映射的详细程度，加快构建速度
      config.devtool = 'eval-source-map';
      
      // 减少构建过程中的输出信息
      config.infrastructureLogging = {
        level: 'error',
      };
    }
    
    return config;
  }
};

export default nextConfig;
