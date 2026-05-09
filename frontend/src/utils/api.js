import axios from 'axios';
import { toFrontend, toBackend } from './fieldMap.js';

const REQUEST_TIMEOUT = 30000;
const MAX_RETRIES = 3;
const RETRY_DELAY_BASE = 1000;

let pendingCount = 0;
const listeners = new Set();
const notifyListeners = () => { listeners.forEach(fn => fn(pendingCount)); };
export const onRequestCountChange = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };
export const getPendingCount = () => pendingCount;
const incrementPending = () => { pendingCount++; notifyListeners(); };
const decrementPending = () => { if (pendingCount > 0) pendingCount--; notifyListeners(); };

const inFlightRequests = new Map();
const pendingRequests = new Map();

const createCancelToken = (key) => {
  const source = axios.CancelToken.source();
  pendingRequests.set(key, source);
  return source;
};

const removePendingRequest = (key) => {
  if (pendingRequests.has(key)) pendingRequests.delete(key);
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const friendlyError = (error) => {
  if (error.isAxiosError && !error.response) return '网络连接失败，请检查网络后重试';
  const status = error.response?.status;
  if (status === 401) return '登录已过期，请重新登录';
  if (status === 403) return '没有权限执行此操作';
  if (status === 404) return '请求的资源不存在';
  if (status === 409) return '数据冲突，请刷新后重试';
  if (status >= 500) return '服务器繁忙，请稍后重试';
  return error.response?.data?.message || error.message || '网络请求失败，请重试';
};

const retryRequest = async (config, retryCount = 0) => {
  try {
    const response = await axios(config);
    return { success: true, data: response.data };
  } catch (error) {
    if (retryCount < MAX_RETRIES && axios.isAxiosError(error) && !error.response) {
      await delay(RETRY_DELAY_BASE * Math.pow(2, retryCount));
      return retryRequest(config, retryCount + 1);
    }
    return { success: false, error: friendlyError(error), status: error.response?.status, isNetworkError: !error.response && axios.isAxiosError(error) };
  }
};

const detectEntityType = (url) => {
  const path = url.replace(/^\//, '').split('/')[0];
  if (path === 'students') return 'students';
  if (path === 'courses') return 'courses';
  if (path === 'grades') return 'grades';
  return null;
};

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: REQUEST_TIMEOUT,
  headers: { 'Content-Type': 'application/json' }
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  const requestKey = `${config.method}-${config.url}-${Date.now()}`;
  config.requestKey = requestKey;
  config.cancelToken = createCancelToken(requestKey).token;
  return config;
}, (error) => Promise.reject(error));

apiClient.interceptors.response.use((response) => {
  if (response.config.requestKey) removePendingRequest(response.config.requestKey);
  return response;
}, (error) => {
  if (error.config?.requestKey) removePendingRequest(error.config.requestKey);
  return Promise.reject(error);
});

export const request = async (options) => {
  const entityType = detectEntityType(options.url);
  const requestData = (options.method === 'POST' || options.method === 'PUT')
    ? toBackend(options.data, entityType) : options.data;

  const config = {
    method: options.method || 'GET', url: options.url,
    data: requestData, params: options.params, headers: options.headers || {}
  };

  const dedupKey = options.dedup !== false && config.method === 'GET'
    ? `${config.method}:${config.url}:${JSON.stringify(config.params || {})}` : null;

  if (dedupKey && inFlightRequests.has(dedupKey)) return inFlightRequests.get(dedupKey);

  incrementPending();
  const promise = (async () => {
    const result = await retryRequest(config);
    if (result.success) {
      return (config.method === 'GET' || config.method === 'DELETE')
        ? toFrontend(result.data, entityType) : result.data;
    } else {
      const error = new Error(result.error);
      error.isNetworkError = result.isNetworkError;
      error.status = result.status;
      throw error;
    }
  })();

  if (dedupKey && config.method === 'GET') {
    inFlightRequests.set(dedupKey, promise);
    promise.finally(() => { inFlightRequests.delete(dedupKey); });
  }
  promise.finally(() => { decrementPending(); });
  return promise;
};

export const get = (url, params = {}, options = {}) => request({ ...options, method: 'GET', url, params });
export const post = (url, data = {}, options = {}) => request({ ...options, method: 'POST', url, data });
export const put = (url, data = {}, options = {}) => request({ ...options, method: 'PUT', url, data });
export const del = (url, options = {}) => request({ ...options, method: 'DELETE', url });

export const cancelAllRequests = () => {
  pendingRequests.forEach((source) => { source.cancel('所有请求已取消'); });
  pendingRequests.clear();
};

export const requestCache = new Map();
export const cachedRequest = async (key, requestFn, cacheTime = 5 * 60 * 1000) => {
  const cached = requestCache.get(key);
  if (cached && Date.now() - cached.timestamp < cacheTime) return cached.data;
  const data = await requestFn();
  requestCache.set(key, { data, timestamp: Date.now() });
  return data;
};
export const invalidateCache = (pattern) => {
  if (!pattern) { requestCache.clear(); return; }
  for (const key of requestCache.keys()) { if (key.includes(pattern)) requestCache.delete(key); }
};
export default apiClient;
