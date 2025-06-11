'use client';

import React, { useState, useEffect } from 'react';

interface TimeAgoProps {
  timestamp: string;
}

const TimeAgo: React.FC<TimeAgoProps> = ({ timestamp }) => {
  const [timeAgo, setTimeAgo] = useState<string>('');

  useEffect(() => {
    const updateTimeAgo = () => {
      const now = new Date();
      const commentDate = new Date(timestamp);
      const diffInSeconds = Math.floor((now.getTime() - commentDate.getTime()) / 1000);
      
      if (diffInSeconds < 60) {
        setTimeAgo(`${diffInSeconds}秒前`);
      } else if (diffInSeconds < 3600) {
        setTimeAgo(`${Math.floor(diffInSeconds / 60)}分钟前`);
      } else if (diffInSeconds < 86400) {
        setTimeAgo(`${Math.floor(diffInSeconds / 3600)}小时前`);
      } else if (diffInSeconds < 2592000) {
        setTimeAgo(`${Math.floor(diffInSeconds / 86400)}天前`);
      } else if (diffInSeconds < 31536000) {
        setTimeAgo(`${Math.floor(diffInSeconds / 2592000)}个月前`);
      } else {
        setTimeAgo(`${Math.floor(diffInSeconds / 31536000)}年前`);
      }
    };

    updateTimeAgo();
    
    // 对于较新的评论，每分钟更新一次显示
    const intervalId = setInterval(() => {
      updateTimeAgo();
    }, 60000);

    return () => clearInterval(intervalId);
  }, [timestamp]);

  return <span>{timeAgo}</span>;
};

export default TimeAgo;
