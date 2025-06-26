import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosInstance,
  AxiosError,
  isCancel,
} from "axios";
import auth from "./auth";

// 自定义错误类型
export class HttpError extends Error {
  status: number;
  data?: any;
  isUnauthorized?: boolean;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.data = data;
    this.isUnauthorized = status === 401;
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

export class RequestCancelledError extends Error {
  constructor(message = "请求已取消") {
    super(message);
    this.name = "RequestCancelledError";
    Object.setPrototypeOf(this, RequestCancelledError.prototype);
  }
}

// 可取消请求接口
export interface CancelableRequest<T> {
  promise: Promise<T>;
  cancel: (reason?: string) => void;
}

// 环境变量
const IS_DEVELOPMENT = process.env.NODE_ENV === "development";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const isBrowser = typeof window !== "undefined";
const useProxy =
  isBrowser &&
  process.env.NODE_ENV !== "production" &&
  process.env.NEXT_PUBLIC_USE_PROXY !== "false";

// 创建axios实例
const axiosInstance: AxiosInstance = axios.create({
  baseURL: IS_DEVELOPMENT ? BASE_URL : "",
  timeout: 30000,
  withCredentials: true,
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    if (!(config.data instanceof FormData)) {
      config.headers = config.headers || {};
      config.headers["Content-Type"] =
        config.headers["Content-Type"] || "application/json";
    }
    const token = auth.getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    if (useProxy && config.url && config.url.includes("localhost:8080")) {
      const path = config.url.split("localhost:8080")[1];
      config.url = `/api/proxy?url=${encodeURIComponent(
        path.startsWith("/") ? path.substring(1) : path
      )}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (isCancel(error)) {
      return Promise.reject(new RequestCancelledError());
    }
    if (error.response) {
      const { status, statusText, data } = error.response;
      if (status === 401) {
        auth.removeToken();
        if (
          typeof window !== "undefined" &&
          !window.location.pathname.includes("/login")
        ) {
          window.location.href = "/login";
        }
      }
      return Promise.reject(
        new HttpError(statusText || `请求失败: ${status}`, status, data)
      );
    } else if (error.request) {
      if (error.code === "ECONNABORTED") {
        return Promise.reject(
          new Error(`请求超时: ${error.config.timeout || 30000}ms`)
        );
      }
      return Promise.reject(new Error("未收到响应"));
    }
    return Promise.reject(error);
  }
);

// 创建可取消请求（使用AbortController）
function createCancelableRequest<T>(
  requestFn: (signal: AbortSignal) => Promise<T>
): CancelableRequest<T> {
  const controller = new AbortController();
  return {
    promise: requestFn(controller.signal),
    cancel: (reason?: string) => controller.abort(reason),
    //error.cause获取reason
  };
}

/**
 * 请求函数
 */
async function request<T = any>(
  url: string,
  options: AxiosRequestConfig = {}
): Promise<T> {
  try {
    const response = await axiosInstance.request<T>({
      url,
      ...options,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

// HTTP请求方法
request.get = <T = any>(
  url: string,
  options?: AxiosRequestConfig
): CancelableRequest<T> => {
  return createCancelableRequest((signal) =>
    request<T>(url, { method: "GET", ...options, signal })
  );
};

request.post = <T = any>(
  url: string,
  data?: any,
  options?: AxiosRequestConfig
): CancelableRequest<T> => {
  return createCancelableRequest((signal) =>
    request<T>(url, { method: "POST", data, ...options, signal })
  );
};

request.put = <T = any>(
  url: string,
  data?: any,
  options?: AxiosRequestConfig
): CancelableRequest<T> => {
  return createCancelableRequest((signal) =>
    request<T>(url, { method: "PUT", data, ...options, signal })
  );
};

request.delete = <T = any>(
  url: string,
  options?: AxiosRequestConfig
): CancelableRequest<T> => {
  return createCancelableRequest((signal) =>
    request<T>(url, { method: "DELETE", ...options, signal })
  );
};

request.patch = <T = any>(
  url: string,
  data?: any,
  options?: AxiosRequestConfig
): CancelableRequest<T> => {
  return createCancelableRequest((signal) =>
    request<T>(url, { method: "PATCH", data, ...options, signal })
  );
};

// 下载文件方法
request.download = (
  url: string,
  filename?: string,
  options?: AxiosRequestConfig
): CancelableRequest<{ success: boolean }> => {
  return createCancelableRequest(async (signal) => {
    try {
      const response = await axiosInstance.request({
        url,
        ...options,
        method: options?.method || "GET",
        responseType: "blob",
        signal,
      });
      const blob = new Blob([response.data]);
      const objectUrl = window.URL.createObjectURL(blob);
      if (!filename) {
        const contentDisposition = response.headers["content-disposition"];
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="(.+)"/);
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1];
          }
        }
      }
      if (!filename) {
        filename = url.split("/").pop() || "download";
      }
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(objectUrl);
      }, 100);
      return { success: true };
    } catch (error) {
      console.error("下载失败:", error);
      throw error;
    }
  });
};

// 表单提交方法
request.form = <T = any>(
  url: string,
  formData: FormData,
  options?: AxiosRequestConfig
): CancelableRequest<T> => {
  return createCancelableRequest((signal) =>
    request<T>(url, {
      method: "POST",
      data: formData,
      ...options,
      signal,
    })
  );
};

// 上传文件方法
//进度显示传回调
// (event) => {
//     if (event.total) {
//       const percent = Math.round((event.loaded * 100) / event.total);
//       console.log(`上传进度: ${percent}%`);
//     }
request.upload = <T = any>(
  url: string,
  files: File | File[],
  fieldName = "file",
  options?: AxiosRequestConfig
): CancelableRequest<T> => {
  const formData = new FormData();
  if (Array.isArray(files)) {
    files.forEach((file, index) => {
      formData.append(`${fieldName}[${index}]`, file, file.name);
    });
  } else {
    formData.append(fieldName, files, files.name);
  }
  if (options?.data) {
    Object.entries(options.data).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
  }
  return createCancelableRequest((signal) =>
    request<T>(url, {
      method: "POST",
      data: formData,
      ...options,
      onUploadProgress: options?.onUploadProgress,
      signal,
    })
  );
};

// 批量请求方法
request.all = <T extends any[]>(
  requests: CancelableRequest<T[number]>[]
): CancelableRequest<T> => {
  return {
    promise: Promise.all(requests.map((req) => req.promise)) as Promise<T>,
    cancel: (reason?: string) => {
      requests.forEach((req) => req.cancel(reason));
    },
  };
};

// // 创建独立实例的方法
// request.create = (defaultConfig: AxiosRequestConfig = {}) => {
//   const newAxiosInstance = axios.create({
//     ...axiosInstance.defaults,
//     ...defaultConfig
//   });
//   if (axiosInstance.interceptors.request.handlers && axiosInstance.interceptors.request.handlers.length > 0) {
//     axiosInstance.interceptors.request.handlers.forEach(h =>
//       newAxiosInstance.interceptors.request.use(h.fulfilled, h.rejected)
//     );
//   }
//   if (axiosInstance.interceptors.response.handlers && axiosInstance.interceptors.response.handlers.length > 0) {
//     axiosInstance.interceptors.response.handlers.forEach(h =>
//       newAxiosInstance.interceptors.response.use(h.fulfilled, h.rejected)
//     );
//   }
//   const newRequest = <T = any>(url: string, options?: AxiosRequestConfig): CancelableRequest<T> => {
//     return createCancelableRequest(source => {
//       const config: AxiosRequestConfig = {
//         ...defaultConfig,
//         ...options,
//         url,
//         cancelToken: source.token
//       };
//       return request<T>(url, config);
//     });
//   };
//   Object.keys(request).forEach(key => {
//     if (key !== 'create') {
//       newRequest[key] = request[key];
//     }
//   });
//   return newRequest;
// };

export default request;
