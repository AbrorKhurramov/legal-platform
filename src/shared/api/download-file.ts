import { axiosInstance } from "./api-instance";

const FILENAME_UTF8 = /filename\*=UTF-8''([^;]+)/i;
const FILENAME_PLAIN = /filename="?([^";]+)"?/i;

const fileNameFrom = (disposition: string | undefined, fallback: string) => {
  if (!disposition) return fallback;
  const encoded = FILENAME_UTF8.exec(disposition)?.[1];
  if (encoded) return decodeURIComponent(encoded);
  return FILENAME_PLAIN.exec(disposition)?.[1] ?? fallback;
};

/**
 * Downloads a binary endpoint (no BaseResponse envelope) and hands it to the browser as a file.
 * The name comes from Content-Disposition, so Cyrillic names survive.
 */
export const downloadFile = async (url: string, fallbackName: string) => {
  const response = await axiosInstance.get<Blob>(url, { responseType: "blob" });
  const name = fileNameFrom(response.headers["content-disposition"] as string | undefined, fallbackName);
  const href = URL.createObjectURL(response.data);
  const link = document.createElement("a");
  link.href = href;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(href);
};
