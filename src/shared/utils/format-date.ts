import { DATE_FORMAT, DATE_TIME_FORMAT, dayjs } from "@/shared/lib/dayjs-lib";

export const formatDate = (value?: string | null) => (value ? dayjs(value).format(DATE_FORMAT) : "—");

export const formatDateTime = (value?: string | null) => (value ? dayjs(value).format(DATE_TIME_FORMAT) : "—");

export const fromNow = (value: string) => dayjs(value).fromNow();

export const daysUntil = (value: string) => dayjs(value).startOf("day").diff(dayjs().startOf("day"), "day");

export const toIsoDate = (value: Date | null) => (value ? dayjs(value).format("YYYY-MM-DD") : undefined);
