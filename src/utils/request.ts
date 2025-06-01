// src/utils/request.ts
/**
 * 请求中间件 - 封装fetch请求
 * 提供统一的请求处理、错误处理和拦截器功能
 */

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

/**
 * 请求函数
 * @param url 请求地址
 * @param options 请求选项
 * @returns Promise
 */
async function request<T = any>(url: string, options: RequestOptions = {}): Promise<T> {
  let mergedOptions = { ...options };
  
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
      mergedOptions.headers = {
        'Content-Type': 'application/json',
        ...mergedOptions.headers,
      };
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
      throw new Error(transformedResponse.statusText || `请求失败: ${response.status}`);
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

// 添加用于下载文件的辅助方法
request.download = async (url: string, filename?: string, options?: RequestOptions) => {
  const response = await fetch(url, {
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
    filename = url.split('/').pop() || 'download';
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
