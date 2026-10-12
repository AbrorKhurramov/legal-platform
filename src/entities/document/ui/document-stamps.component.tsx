import { EmptyData } from "local-agro-ui";
import { useTranslation } from "react-i18next";

import { Icon } from "@/shared/ui/icon/icon.entry";

import type { DocumentStampDTO } from "../model/document.types";
import { NeedsReviewBadge } from "./document-tags.component";

interface IDocumentStampsProps {
  stamps: DocumentStampDTO[];
}

export const DocumentStamps = (props: IDocumentStampsProps) => {
  const { t } = useTranslation("document");

  if (!props.stamps.length) return <EmptyData title={t("stamps.empty")} />;

  return (
    <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      {props.stamps.map((stamp, index) => (
        <li key={index} className="flex flex-col gap-2 rounded-xl border border-greyscale-300 p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-sm font-semibold text-greyscale-900">
              <Icon name="stamp" className="size-4 text-electro-500" />
              {t(`stamps.kind.${stamp.kind}`, { defaultValue: stamp.kind })}
              <span className="text-xs font-normal text-greyscale-500">{t("fields.page", { page: stamp.page })}</span>
            </span>
            {stamp.needsConfirmation && <NeedsReviewBadge />}
          </div>
          {stamp.text && <p className="text-sm text-greyscale-800">{stamp.text}</p>}
          <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            {stamp.organization && (
              <>
                <dt className="text-greyscale-500">{t("stamps.organization")}</dt>
                <dd className="text-greyscale-800">{stamp.organization}</dd>
              </>
            )}
            {stamp.number && (
              <>
                <dt className="text-greyscale-500">{t("stamps.number")}</dt>
                <dd className="text-greyscale-800">{stamp.number}</dd>
              </>
            )}
            {(stamp.date || stamp.dateText) && (
              <>
                <dt className="text-greyscale-500">{t("stamps.date")}</dt>
                <dd className="text-greyscale-800">{stamp.date ?? stamp.dateText}</dd>
              </>
            )}
            {stamp.person && (
              <>
                <dt className="text-greyscale-500">{t("stamps.person")}</dt>
                <dd className="text-greyscale-800">{stamp.person}</dd>
              </>
            )}
          </dl>
          {stamp.handwritten.length > 0 && (
            <p className="text-xs text-warning-700">
              {t("stamps.handwritten", { fields: stamp.handwritten.map((name) => t(`stamps.${name}`)).join(", ") })}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
};
