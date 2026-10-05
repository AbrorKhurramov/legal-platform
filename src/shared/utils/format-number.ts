const numberFormatter = new Intl.NumberFormat("ru-RU");

export const formatNumber = (value: number) => numberFormatter.format(value);

export const formatMoney = (value?: number | null) => (value === undefined || value === null ? "—" : `${numberFormatter.format(value)} so'm`);

export const formatMoneyShort = (value: number) => {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)} mlrd`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)} mln`;
  return numberFormatter.format(value);
};

export const formatFileSize = (bytes: number) => (bytes >= 1_048_576 ? `${(bytes / 1_048_576).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`);
