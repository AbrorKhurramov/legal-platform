import dayjs from "dayjs";
import "dayjs/locale/ru";
import "dayjs/locale/uz-latn";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const DATE_FORMAT = "DD.MM.YYYY";
export const DATE_TIME_FORMAT = "DD.MM.YYYY HH:mm";

export const setDayjsLocale = (language: string) => dayjs.locale(language === "ru" ? "ru" : "uz-latn");

export { dayjs };
