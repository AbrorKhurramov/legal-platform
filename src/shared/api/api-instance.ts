import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import i18next from "i18next";
import toast from "react-hot-toast";

import { STORAGE_KEYS } from "@/shared/const/storage-const";

import type { TBaseResponseDTO } from "./api-types";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_HOST,
  timeout: 30_000,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.accessToken);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  config.headers["Accept-Language"] = i18next.language;
  return config;
});

const UNAUTHORIZED_STATUS = 401;

const getErrorMessage = (error: unknown) => {
  if (error instanceof AxiosError) {
    const body = error.response?.data as Partial<TBaseResponseDTO<unknown>> | undefined;
    if (body?.message) return body.message;
  }
  return i18next.t("common:toast.error");
};

export class RequestWithToast {
  private request = async <T>(method: AxiosRequestConfig["method"], url: string, config: AxiosRequestConfig = {}, showToast = true) => {
    try {
      const response = await axiosInstance.request<TBaseResponseDTO<T>>({ ...config, method, url });
      if (showToast && method !== "get") toast.success(response.data.message || i18next.t("common:toast.success"));
      return { data: response.data.data, message: response.data.message };
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === UNAUTHORIZED_STATUS) {
        localStorage.removeItem(STORAGE_KEYS.accessToken);
        window.location.assign("/login");
      }
      if (showToast) toast.error(getErrorMessage(error));
      throw error;
    }
  };

  get = <T>(url: string, config?: AxiosRequestConfig, showToast?: boolean) => this.request<T>("get", url, config, showToast);

  post = <T>(url: string, body?: unknown, config?: AxiosRequestConfig, showToast?: boolean) =>
    this.request<T>("post", url, { ...config, data: body }, showToast);

  put = <T>(url: string, body?: unknown, config?: AxiosRequestConfig, showToast?: boolean) =>
    this.request<T>("put", url, { ...config, data: body }, showToast);

  patch = <T>(url: string, body?: unknown, config?: AxiosRequestConfig, showToast?: boolean) =>
    this.request<T>("patch", url, { ...config, data: body }, showToast);

  delete = <T>(url: string, config?: AxiosRequestConfig, showToast?: boolean) => this.request<T>("delete", url, config, showToast);
}

export const api = new RequestWithToast();
