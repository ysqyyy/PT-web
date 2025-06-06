import React, { useState, useRef, ChangeEvent } from 'react';

interface ImageUploadProps {
  initialImageUrl?: string;
  defaultImage?: string;
  onImageChange: (file: File | null, previewUrl: string) => void;
}

export default function ImageUpload({ 
  initialImageUrl = '', 
  defaultImage = '/default-avatar.svg',
  onImageChange 
}: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string>(initialImageUrl || defaultImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      // 检查文件是否为图片
      if (!file.type.startsWith('image/')) {
        alert('请选择图片文件');
        return;
      }
      
      // 限制文件大小（例如：2MB）
      if (file.size > 2 * 1024 * 1024) {
        alert('图片大小不能超过2MB');
        console.error('图片大小超过限制:', file.size);
        return;
      }

      // 创建临时预览URL
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
        onImageChange(file, result);
      };
      reader.readAsDataURL(file);
    } else {
      // 如果用户取消选择，则恢复默认图片
      setPreviewUrl(initialImageUrl || defaultImage);
      onImageChange(null, initialImageUrl || defaultImage);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center">
      <div 
        className="w-24 h-24 rounded-full overflow-hidden border-2 border-teal-100 cursor-pointer relative group"
        onClick={triggerFileInput}
      >
        <img 
          src={previewUrl} 
          alt="头像预览" 
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultImage;
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-white text-xs">更换头像</span>
        </div>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      <button 
        type="button"
        onClick={triggerFileInput}
        className="mt-2 text-sm text-teal-600 hover:text-teal-800 focus:outline-none"
      >
        上传新头像
      </button>
    </div>
  );
}
