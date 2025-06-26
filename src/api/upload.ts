// src/api/upload.ts
import axios from "axios";
import auth from "../utils/auth";

/**
 * 上传用户头像   ok
 * @param avatarFile 头像文件
 * @returns Promise<string> 上传成功后返回的头像URL
 */
export async function uploadAvatar(avatarFile: File): Promise<string> {
  try {
    const token = auth.getToken();
    const formData = new FormData();
    formData.append("file", avatarFile);
     const response=await axios.post("/api/avatar/upload", formData, {
    headers: {
      // "Content-Type": "multipart/form-data",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
    console.log("上传头像成功:", response);
      return response.data.data; 
  } catch (error) {
    console.error("上传头像失败:", error);
    throw error;
  }
}
