'use client';

import React, { useState } from 'react';

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  buttonText?: string;
  placeholder?: string;
}

const CommentForm: React.FC<CommentFormProps> = ({ 
  onSubmit, 
  buttonText = '发表', 
  placeholder = '分享你的想法...'
}) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(content);
      setContent(''); // 提交成功后清空表单
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mb-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
          rows={3}
          disabled={isSubmitting}
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
           className={` bg-gradient-to-r from-[#5E8B7E] to-[#4F7A6F] cursor-pointer text-white rounded-lg shadow-md hover:shadow-lg hover:from-[#4F7A6F] hover:to-[#3D685F] transition-all duration-300 px-4 py-2 `}

          className="px-4 py-2  text-white cursor-pointer rounded-md  bg-gradient-to-r from-[#5E8B7E] to-[#4F7A6F] transition-colors disabled:bg-gray-400"
          disabled={isSubmitting || !content.trim()}
        >
          {isSubmitting ? '提交中...' : buttonText}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
