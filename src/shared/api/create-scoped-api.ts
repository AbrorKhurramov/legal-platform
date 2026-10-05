import type { AxiosRequestConfig } from "axios";

import { api } from "./api-instance";

export const createScopedApi = (prefix: string) => {
  const withPrefix = (url: string) => `/${prefix}${url}`;

  return {
    get: <T>(url: string, config?: AxiosRequestConfig, showToast?: boolean) => api.get<T>(withPrefix(url), config, showToast),
    post: <T>(url: string, body?: unknown, config?: AxiosRequestConfig, showToast?: boolean) => api.post<T>(withPrefix(url), body, config, showToast),
    put: <T>(url: string, body?: unknown, config?: AxiosRequestConfig, showToast?: boolean) => api.put<T>(withPrefix(url), body, config, showToast),
    patch: <T>(url: string, body?: unknown, config?: AxiosRequestConfig, showToast?: boolean) =>
      api.patch<T>(withPrefix(url), body, config, showToast),
    delete: <T>(url: string, config?: AxiosRequestConfig, showToast?: boolean) => api.delete<T>(withPrefix(url), config, showToast),
  };
};
