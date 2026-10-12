import { useState } from "react";

import { useTranslation } from "react-i18next";

import { Icon } from "@/shared/ui/icon/icon.entry";

const COPIED_RESET_MS = 2000;

interface ITemporaryPasswordProps {
  username: string;
  password: string;
}

/** Shown once after create or reset; the backend keeps only a hash, so it cannot be looked up later. */
export const TemporaryPassword = (props: ITemporaryPasswordProps) => {
  const { username, password } = props;
  const { t } = useTranslation("admin");
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), COPIED_RESET_MS);
  };

  return (
    <div className="flex items-center gap-3 rounded-xl border border-greyscale-300 bg-greyscale-50 px-4 py-3">
      <Icon name="key" className="size-4 shrink-0 text-greyscale-500" />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-xs text-greyscale-500">{username}</span>
        <code className="font-mono text-base tracking-wide text-greyscale-900 select-all">{password}</code>
      </span>
      <button type="button" onClick={copy} className="flex items-center gap-1 text-sm font-medium text-main-green-700 hover:text-main-green-800">
        <Icon name={copied ? "check" : "copy"} className="size-4" />
        {copied ? t("password.copied") : t("password.copy")}
      </button>
    </div>
  );
};
