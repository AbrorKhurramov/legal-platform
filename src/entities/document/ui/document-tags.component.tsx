import { Tag } from "local-agro-ui";
import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";

import { Icon } from "@/shared/ui/icon/icon.entry";

import { ContentSourceColor, ProcessingStatusColor } from "../common/document-status.config";
import { type ContentSource, ProcessingStatus } from "../model/document.const";

interface IProcessingStatusTagProps {
  status: ProcessingStatus;
}

export const ProcessingStatusTag = (props: IProcessingStatusTagProps) => {
  const { t } = useTranslation("document");
  const isRunning = props.status === ProcessingStatus.PENDING || props.status === ProcessingStatus.PROCESSING;

  return (
    <Tag
      colorType={ProcessingStatusColor[props.status]}
      sizeType="sm"
      rounded
      leftIcon={isRunning ? <Icon name="refresh" className="size-3 animate-spin" /> : null}
      dotted={!isRunning}
    >
      {t(`status.${props.status}`)}
    </Tag>
  );
};

interface IContentSourceTagProps {
  source: ContentSource;
}

export const ContentSourceTag = (props: IContentSourceTagProps) => {
  const { t } = useTranslation("document");

  return (
    <Tag colorType={ContentSourceColor[props.source]} sizeType="sm" variantType="Outlined" rounded>
      {t(`source.${props.source}`)}
    </Tag>
  );
};

interface IDocTypeLabelProps {
  docType: string | null;
}

export const DocTypeLabel = (props: IDocTypeLabelProps) => {
  const { t } = useTranslation("document");

  if (!props.docType) return <span className="text-greyscale-500">{t("docType.unknown")}</span>;
  return <span className="text-greyscale-800">{t(`docType.${props.docType}`, { defaultValue: props.docType })}</span>;
};

export const NeedsReviewBadge = () => {
  const { t } = useTranslation("document");

  return (
    <Tag colorType="Amber" sizeType="sm" rounded leftIcon={<Icon name="alert" className="size-3" />}>
      {t("needsReview")}
    </Tag>
  );
};

interface IFolderNameProps {
  name?: string | null;
  emptyLabel: string;
}

export const FolderName = (props: IFolderNameProps) => {
  const { name, emptyLabel } = props;

  return (
    <span
      className={twMerge("flex max-w-48 items-center gap-1.5 text-sm", name ? "text-greyscale-800" : "text-greyscale-400")}
      title={name ?? undefined}
    >
      <Icon name="folder" className={twMerge("size-4 shrink-0", name ? "text-warning-500" : "text-greyscale-400")} />
      <span className="truncate">{name ?? emptyLabel}</span>
    </span>
  );
};
