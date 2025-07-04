// store/seedPublishStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UploadFile } from 'antd/es/upload/interface';
import { publishSeedData } from '@/types/seed';

interface SeedPublishState {
  // 表单数据
  formData: publishSeedData;
  // 种子文件列表
  fileList: UploadFile[];
  // 普通文件列表
  normalFileList: UploadFile[];
  // 更新表单数据
  updateFormData: (data: Partial<publishSeedData>) => void;
  // 设置种子文件列表
  setFileList: (files: UploadFile[]) => void;
  // 设置普通文件列表
  setNormalFileList: (files: UploadFile[]) => void;
  // 重置所有状态
  resetState: () => void;
}

// 初始状态
const initialState = {
  formData: {
    name: "",
    description: "",
    tags: [],
    price: 0,
    category: "电影",
  },
  fileList: [],
  normalFileList: [],
};

// 创建并导出 store
export const useSeedPublishStore = create<SeedPublishState>()(
  persist(
    (set) => ({
      ...initialState,
      
      // 更新表单数据
      updateFormData: (data) => 
        set((state) => ({ 
          formData: { ...state.formData, ...data } 
        })),
      
      // 设置种子文件列表
      setFileList: (files) => set({ fileList: files }),
      
      // 设置普通文件列表
      setNormalFileList: (files) => set({ normalFileList: files }),
      
      // 重置所有状态到初始值
      resetState: () => set(initialState),
    }),
    {
      name: 'seed-publish-storage', // localStorage 中的键名
      partialize: (state) => ({
        formData: state.formData,
        // 不持久化文件列表，因为 UploadFile 对象包含 File 对象，无法被序列化
      }),
    }
  )
);
