import { twMerge } from "tailwind-merge";

import { Icon } from "@/shared/ui/icon/icon.entry";
import { formatFileSize } from "@/shared/utils/format-number";

import { DocumentFormatConfig } from "../common/document-status.config";
import type { DocumentFormat } from "../model/document.const";

interface IFileNameCellProps {
  name: string;
  format: DocumentFormat;
  sizeBytes?: number;
  confidential: boolean;
}

export const FileNameCell = (props: IFileNameCellProps) => {
  const { name, format, sizeBytes, confidential } = props;
  const config = DocumentFormatConfig[format];

  return (
    <span className="flex max-w-96 items-center gap-3">
      <span className={twMerge("flex size-9 shrink-0 items-center justify-center rounded-lg", config.className)}>
        <Icon name={config.icon} className="size-4.5" />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="flex items-center gap-1.5">
          {confidential && <Icon name="lock" className="size-3.5 shrink-0 text-error-400" />}
          <span className="truncate font-medium text-greyscale-900">{name}</span>
        </span>
        <span className="text-xs text-greyscale-500">{sizeBytes === undefined ? format : `${format} · ${formatFileSize(sizeBytes)}`}</span>
      </span>
    </span>
  );
};
