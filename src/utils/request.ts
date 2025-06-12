/**
 * 请求中间件 - 封装fetch请求
 * 提供统一的请求处理、错误处理和拦截器功能
 */
import auth from './auth';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>; // URL查询参数
  data?: any; // 请求体数据
  timeout?: number; // 请求超时时间(ms)
}

interface Response<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
  ok: boolean;
}

// 拦截器
export const interceptors = {
  request: {
    use: (callback: (options: RequestOptions) => RequestOptions) => {
      requestInterceptors.push(callback);
    }
  },
  response: {
    use: (
      onFulfilled: (response: Response) => Response | Promise<Response>,
      onRejected?: (error: any) => any
    ) => {
      responseInterceptors.push({ onFulfilled, onRejected });
    }
  }
};

// 拦截器数组
const requestInterceptors: ((options: RequestOptions) => RequestOptions)[] = [];
const responseInterceptors: {
  onFulfilled: (response: Response) => Response | Promise<Response>;
  onRejected?: (error: any) => any;
}[] = [];

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
// 判断是否处于浏览器环境
const isBrowser = typeof window !== 'undefined';
// 判断是否使用代理 - 生产环境或指定环境不使用代理
const useProxy = isBrowser && process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_USE_PROXY !== 'false';

// 添加请求拦截器，自动从cookie中获取token并添加到请求头
interceptors.request.use((options) => {
  if (!(options.body instanceof FormData)) {
    options.headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
  }
  const token = auth.getToken();
  if (token) {
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    };
  }
  return options;
});

// 添加响应拦截器，处理401未授权错误
interceptors.response.use(
  (response) => response,
  (error) => {
    // 检查是否是401错误
    if (error && error.status === 401) {
      auth.removeToken();
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * 请求函数
 * @param url 请求地址
 * @param options 请求选项
 * @returns Promise
 */
async function request<T = any>(url: string, options: RequestOptions = {}): Promise<T> {
  let mergedOptions = { ...options };
  // 拼接 base url
  if (!/^https?:\/\//.test(url)) {
    url = BASE_URL + url;
  }
  
  // 如果是开发环境且请求的是localhost:8080，使用代理
  if (useProxy && url.includes('localhost:8080')) {
    // 将 localhost:8080 后面的路径提取出来
    const path = url.split('localhost:8080')[1];
    // 将请求重定向到我们的代理
    url = `/api/proxy?url=${encodeURIComponent(path.startsWith('/') ? path.substring(1) : path)}`;
  }

  // 默认携带凭证
  if (mergedOptions.credentials === undefined) {
    mergedOptions.credentials = 'include';
  }
  
  // 处理查询参数
  if (options.params) {
    const queryString = new URLSearchParams();
    Object.entries(options.params).forEach(([key, value]) => {
      queryString.append(key, String(value));
    });
    const separator = url.includes('?') ? '&' : '?';
    url = `${url}${separator}${queryString.toString()}`;
    delete mergedOptions.params;
  }
  // 处理请求体
  if (options.data) {
    if (!(options.body instanceof FormData)) {
      // Content-Type已经在请求拦截器中设置，这里只处理body
      mergedOptions.body = JSON.stringify(options.data);
    } else {
      mergedOptions.body = options.data;
    }
    delete mergedOptions.data;
  }

  // 应用请求拦截器
  for (const interceptor of requestInterceptors) {
    mergedOptions = interceptor(mergedOptions);
  }
  
  // 处理超时
  let timeoutId: NodeJS.Timeout | null = null;
  const fetchPromise = fetch(url, mergedOptions);
  
  let finalPromise: Promise<Response<T>>;
  
  if (options.timeout) {
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error(`请求超时: ${options.timeout}ms`));
      }, options.timeout);
    });
    
    finalPromise = Promise.race([fetchPromise, timeoutPromise]) as Promise<Response<T>>;
  } else {
    finalPromise = fetchPromise as Promise<Response<T>>;
  }

  try {
    let response = await finalPromise;
    
    // 清除超时定时器
    if (timeoutId) clearTimeout(timeoutId);
    
    // 构建响应对象
    const responseObject: Response<T> = {
      data: {} as T,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      ok: response.ok
    };
    
    // 解析响应内容
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      responseObject.data = await response.json();
    } else if (contentType && contentType.includes('text/')) {
      responseObject.data = await response.text() as unknown as T;
    } else {
      // 如果是blob或其他类型，保留原始响应
      responseObject.data = response as unknown as T;
    }
    
    // 应用响应拦截器
    let transformedResponse = responseObject;
    for (const { onFulfilled } of responseInterceptors) {
      transformedResponse = await onFulfilled(transformedResponse);
    }
      // 检查HTTP状态码
    if (!response.ok) {
      const error: any = new Error(transformedResponse.statusText || `请求失败: ${response.status}`);
      error.status = response.status;
      error.data = transformedResponse.data;
      
      // 如果是401错误，标记为未授权
      if (response.status === 401) {
        error.isUnauthorized = true;
      }
      
      throw error;
    }
    
    return transformedResponse.data;
  } catch (error) {
    // 清除超时定时器
    if (timeoutId) clearTimeout(timeoutId);
    
    // 应用错误拦截器
    let processedError = error;
    for (const { onRejected } of responseInterceptors) {
      if (onRejected) {
        processedError = onRejected(processedError) || processedError;
      }
    }
    
    throw processedError;
  }
}

// HTTP请求方法
request.get = <T = any>(url: string, options?: RequestOptions) => 
  request<T>(url, { method: 'GET', ...options });

request.post = <T = any>(url: string, data?: any, options?: RequestOptions) => 
  request<T>(url, { method: 'POST', data, ...options });

request.put = <T = any>(url: string, data?: any, options?: RequestOptions) => 
  request<T>(url, { method: 'PUT', data, ...options });

request.delete = <T = any>(url: string, options?: RequestOptions) => 
  request<T>(url, { method: 'DELETE', ...options });

request.patch = <T = any>(url: string, data?: any, options?: RequestOptions) => 
  request<T>(url, { method: 'PATCH', data, ...options });

// 文件上传专用方法
request.upload = async <T = any>(url: string, files: File | File[] | Record<string, File>, data?: Record<string, any>, options?: RequestOptions): Promise<T> => {
  const formData = new FormData();
  
  // 处理文件
  if (files instanceof File) {
    // 单个文件
    formData.append('file', files);
  } else if (Array.isArray(files)) {
    // 文件数组
    files.forEach((file, index) => {
      formData.append(`file${index}`, file);
    });
  } else {
    // 键值对形式的文件
    Object.entries(files).forEach(([key, file]) => {
      formData.append(key, file);
    });
  }
  
  // 添加其他数据
  if (data) {
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });
  }
  
  return request<T>(url, {
    method: 'POST',
    body: formData,
    ...options
  });
};

// 添加用于下载文件的辅助方法
request.download = async (url: string, filename?: string, options?: RequestOptions) => {
  // 首先检查是否需要先获取下载URL
  let downloadUrl = url;
  
  // 如果URL不是直接的文件链接，先发送请求获取下载URL
  if (!url.match(/\.(torrent|zip|pdf|doc|docx|xls|xlsx|jpg|png|gif|mp3|mp4)$/i)) {
    try {
      const response = await request(url, {
        ...options,
        method: options?.method || 'GET'
      });
      
      // 检查响应中是否包含downloadUrl
      if (response && response.data && response.data.downloadUrl) {
        downloadUrl = response.data.downloadUrl;
      } else if (response && response.downloadUrl) {
        downloadUrl = response.downloadUrl;
      } else {
        console.error('下载失败: 响应中没有找到下载URL', response);
        throw new Error('下载失败: 响应中没有找到下载URL');
      }
    } catch (error) {
      console.error('获取下载URL失败:', error);
      throw error;
    }
  }
  
  // 发送请求下载文件
  const response = await fetch(downloadUrl, {
    ...options,
    method: options?.method || 'GET',
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error(`下载失败: ${response.status} ${response.statusText}`);
  }
  
  const blob = await response.blob();
  const objectUrl = window.URL.createObjectURL(blob);
  
  // 尝试从Content-Disposition头中获取文件名
  if (!filename) {
    const contentDisposition = response.headers.get('content-disposition');
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1];
      }
    }
  }
  
  // 如果未能获取文件名，使用URL的最后部分
  if (!filename) {
    filename = downloadUrl.split('/').pop() || 'download';
  }
  
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  
  // 清理
  setTimeout(() => {
    document.body.removeChild(link);
    window.URL.revokeObjectURL(objectUrl);
  }, 100);
  
  return { success: true };
};

export default request;
