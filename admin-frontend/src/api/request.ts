import axios from 'axios';
import { App } from 'antd';
import type { ApiResponse } from '@/types';
import type { MessageInstance } from 'antd/es/message/interface';

let messageInstance: MessageInstance | null = null;

export function setMessageInstance(instance: MessageInstance) {
  messageInstance = instance;
}

const request = axios.create({
  baseURL: '/api',
  timeout: 15000,
});

request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

request.interceptors.response.use(
  (response) => {
    const res = response.data as ApiResponse;
    if (res.code !== 200) {
      messageInstance?.error(res.message || '请求失败');
      return Promise.reject(new Error(res.message));
    }
    return res.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      window.location.href = '/login';
    }
    messageInstance?.error(error.message || '网络错误');
    return Promise.reject(error);
  }
);

export default request;
