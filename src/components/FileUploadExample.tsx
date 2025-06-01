// src/components/FileUploadExample.tsx
"use client";

import { useState, useRef, ChangeEvent } from 'react';
import { uploadSingleFile, uploadMultipleFiles, uploadCategorizedFiles } from '../api/upload';

export default function FileUploadExample() {
  const [singleFile, setSingleFile] = useState<File | null>(null);
  const [multipleFiles, setMultipleFiles] = useState<File[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [contentFile, setContentFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<string>('');
  
  const singleFileInputRef = useRef<HTMLInputElement>(null);
  const multipleFileInputRef = useRef<HTMLInputElement>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const contentFileInputRef = useRef<HTMLInputElement>(null);
  
  // 处理单文件选择
  const handleSingleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSingleFile(e.target.files[0]);
    }
  };
  
  // 处理多文件选择
  const handleMultipleFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setMultipleFiles(Array.from(e.target.files));
    }
  };
  
  // 处理封面文件选择
  const handleCoverFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCoverFile(e.target.files[0]);
    }
  };
  
  // 处理内容文件选择
  const handleContentFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setContentFile(e.target.files[0]);
    }
  };
  
  // 上传单个文件
  const handleUploadSingleFile = async () => {
    if (!singleFile) {
      setUploadResult('请选择要上传的文件');
      return;
    }
    
    setIsUploading(true);
    setUploadResult('上传中...');
    
    try {
      const result = await uploadSingleFile(singleFile, '单文件上传示例');
      setUploadResult(`上传成功: ${JSON.stringify(result)}`);
    } catch (error) {
      setUploadResult(`上传失败: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsUploading(false);
    }
  };
  
  // 上传多个文件
  const handleUploadMultipleFiles = async () => {
    if (multipleFiles.length === 0) {
      setUploadResult('请选择要上传的文件');
      return;
    }
    
    setIsUploading(true);
    setUploadResult('上传中...');
    
    try {
      const result = await uploadMultipleFiles(multipleFiles, 123); // 123是假设的文件夹ID
      setUploadResult(`上传成功: ${JSON.stringify(result)}`);
    } catch (error) {
      setUploadResult(`上传失败: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsUploading(false);
    }
  };
  
  // 上传分类文件
  const handleUploadCategorizedFiles = async () => {
    if (!coverFile && !contentFile) {
      setUploadResult('请至少选择一个文件');
      return;
    }
    
    setIsUploading(true);
    setUploadResult('上传中...');
    
    try {
      const result = await uploadCategorizedFiles(
        { 
          cover: coverFile || undefined,
          content: contentFile || undefined,
          attachments: multipleFiles.length > 0 ? multipleFiles : undefined
        },
        {
          title: '示例资源',
          description: '这是一个上传分类文件的示例',
          tags: ['示例', '分类', '上传']
        }
      );
      
      setUploadResult(`上传成功: ${JSON.stringify(result)}`);
    } catch (error) {
      setUploadResult(`上传失败: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">文件上传示例</h2>
      
      {/* 单文件上传 */}
      <div className="mb-6 p-4 border rounded">
        <h3 className="text-lg font-medium mb-2">单文件上传</h3>
        <div className="flex items-center mb-2">
          <input 
            type="file" 
            ref={singleFileInputRef}
            onChange={handleSingleFileChange}
            className="hidden"
          />
          <button
            onClick={() => singleFileInputRef.current?.click()}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 mr-2"
          >
            选择文件
          </button>
          <span className="text-gray-600">
            {singleFile ? singleFile.name : '未选择文件'}
          </span>
        </div>
        <button
          onClick={handleUploadSingleFile}
          disabled={isUploading || !singleFile}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          上传
        </button>
      </div>
      
      {/* 多文件上传 */}
      <div className="mb-6 p-4 border rounded">
        <h3 className="text-lg font-medium mb-2">多文件上传</h3>
        <div className="flex items-center mb-2">
          <input 
            type="file" 
            multiple
            ref={multipleFileInputRef}
            onChange={handleMultipleFilesChange}
            className="hidden"
          />
          <button
            onClick={() => multipleFileInputRef.current?.click()}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 mr-2"
          >
            选择文件
          </button>
          <span className="text-gray-600">
            {multipleFiles.length > 0 ? `已选择 ${multipleFiles.length} 个文件` : '未选择文件'}
          </span>
        </div>
        <button
          onClick={handleUploadMultipleFiles}
          disabled={isUploading || multipleFiles.length === 0}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          上传
        </button>
      </div>
      
      {/* 分类文件上传 */}
      <div className="mb-6 p-4 border rounded">
        <h3 className="text-lg font-medium mb-2">分类文件上传</h3>
        
        {/* 封面文件 */}
        <div className="flex items-center mb-2">
          <input 
            type="file" 
            ref={coverFileInputRef}
            onChange={handleCoverFileChange}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => coverFileInputRef.current?.click()}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 mr-2"
          >
            选择封面
          </button>
          <span className="text-gray-600">
            {coverFile ? coverFile.name : '未选择封面'}
          </span>
        </div>
        
        {/* 内容文件 */}
        <div className="flex items-center mb-2">
          <input 
            type="file" 
            ref={contentFileInputRef}
            onChange={handleContentFileChange}
            className="hidden"
          />
          <button
            onClick={() => contentFileInputRef.current?.click()}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 mr-2"
          >
            选择内容文件
          </button>
          <span className="text-gray-600">
            {contentFile ? contentFile.name : '未选择内容文件'}
          </span>
        </div>
        
        <p className="text-sm text-gray-500 mb-2">
          附件文件可以使用上方的多文件上传选择
        </p>
        
        <button
          onClick={handleUploadCategorizedFiles}
          disabled={isUploading || (!coverFile && !contentFile)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          上传资源
        </button>
      </div>
      
      {/* 上传结果 */}
      {uploadResult && (
        <div className={`p-3 rounded ${uploadResult.includes('失败') ? 'bg-red-100' : uploadResult === '上传中...' ? 'bg-blue-100' : 'bg-green-100'}`}>
          <pre className="whitespace-pre-wrap break-words text-sm">
            {uploadResult}
          </pre>
        </div>
      )}
    </div>
  );
}
