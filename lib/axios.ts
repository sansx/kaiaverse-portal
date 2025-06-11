import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

// 基础配置类型
interface RequestConfig extends AxiosRequestConfig {
  showError?: boolean; // 是否显示错误提示
  loading?: boolean;   // 是否显示加载状态
}

// 响应数据类型
interface ResponseData<T = any> {
  code: number;
  data: T;
  message: string;
}

// 创建 axios 实例的配置类型
interface CreateAxiosConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

// 创建 axios 实例
function createAxiosInstance(config: CreateAxiosConfig = {}): AxiosInstance {
  const {
    baseURL = process.env.NEXT_PUBLIC_API_URL,
    timeout = 10000,
    headers = {
      'Content-Type': 'application/json',
    }
  } = config;

  const instance = axios.create({
    baseURL,
    timeout,
    headers,
  });

  // 请求拦截器
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // 从 localStorage 获取 token
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      // 如果有 token 则添加到请求头
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // 这里可以添加加载状态处理
      const customConfig = config as unknown as RequestConfig;
      if (customConfig.loading) {
        // TODO: 实现加载状态逻辑
      }

      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  // 响应拦截器
  instance.interceptors.response.use(
    (response: AxiosResponse<ResponseData>) => {
      const { data } = response;

      // 根据业务状态码处理
      if (data.code !== 0) {
        // 处理业务错误
        const customConfig = response.config as unknown as RequestConfig;
        if (customConfig.showError !== false) {
          // TODO: 实现错误提示逻辑
          console.error(data.message);
        }
        return Promise.reject(new Error(data.message));
      }

      return data.data;
    },
    (error: AxiosError) => {
      if (error.response) {
        const { status } = error.response;

        // 处理 HTTP 错误
        switch (status) {
          case 401:
            // 未授权，清除 token 并跳转到登录页
            if (typeof window !== 'undefined') {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }
            break;
          case 403:
            console.error('没有权限访问该资源');
            break;
          case 404:
            console.error('请求的资源不存在');
            break;
          case 500:
            console.error('服务器错误');
            break;
          default:
            console.error('发生错误:', error.message);
        }
      } else if (error.request) {
        // 请求已发出但没有收到响应
        console.error('网络错误，请检查您的网络连接');
      } else {
        // 请求配置出错
        console.error('请求配置错误:', error.message);
      }

      return Promise.reject(error);
    }
  );

  return instance;
}

// 创建默认实例
const defaultInstance = createAxiosInstance();

// 封装请求方法
export const request = {
  get: <T = any>(url: string, config?: RequestConfig) => 
    defaultInstance.get<T, T>(url, config),
  
  post: <T = any>(url: string, data?: any, config?: RequestConfig) => 
    defaultInstance.post<T, T>(url, data, config),
  
  put: <T = any>(url: string, data?: any, config?: RequestConfig) => 
    defaultInstance.put<T, T>(url, data, config),
  
  delete: <T = any>(url: string, config?: RequestConfig) => 
    defaultInstance.delete<T, T>(url, config),
  
  patch: <T = any>(url: string, data?: any, config?: RequestConfig) => 
    defaultInstance.patch<T, T>(url, data, config),
};

// 导出创建实例的方法
export const createRequest = (config: CreateAxiosConfig) => {
  const instance = createAxiosInstance(config);
  
  return {
    get: <T = any>(url: string, config?: RequestConfig) => 
      instance.get<T, T>(url, config),
    
    post: <T = any>(url: string, data?: any, config?: RequestConfig) => 
      instance.post<T, T>(url, data, config),
    
    put: <T = any>(url: string, data?: any, config?: RequestConfig) => 
      instance.put<T, T>(url, data, config),
    
    delete: <T = any>(url: string, config?: RequestConfig) => 
      instance.delete<T, T>(url, config),
    
    patch: <T = any>(url: string, data?: any, config?: RequestConfig) => 
      instance.patch<T, T>(url, data, config),
  };
};

export default request; 