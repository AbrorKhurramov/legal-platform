import i18next from "i18next";
import type { TabSwitcherItemType } from "local-agro-ui";

import { ContentSource, type DocumentDetailDTO, ProcessingStatus } from "@/entities/document/document.entry";

import { DocumentDetailTab } from "./document-detail.types";

/**
 * Extracted content exists once processing is done; fields and stamps only for OCR results.
 * The original is a tab only when there is no room to show it beside the content.
 */
export const getDocumentDetailTabs = (document: DocumentDetailDTO, withOriginal: boolean): TabSwitcherItemType<DocumentDetailTab>[] => {
  const tabs: TabSwitcherItemType<DocumentDetailTab>[] = [];
  if (document.status === ProcessingStatus.DONE) tabs.push({ name: DocumentDetailTab.Text, title: i18next.t("tabs.text", { ns: "document" }) });
  if (document.status === ProcessingStatus.DONE && document.source === ContentSource.OCR) {
    tabs.push(
      { name: DocumentDetailTab.Fields, title: `${i18next.t("tabs.fields", { ns: "document" })} (${document.fields.length})` },
      { name: DocumentDetailTab.Stamps, title: `${i18next.t("tabs.stamps", { ns: "document" })} (${document.stamps.length})` },
    );
  }
  tabs.push({ name: DocumentDetailTab.History, title: `${i18next.t("tabs.history", { ns: "document" })} (${document.latestVersionNo})` });
  if (withOriginal) tabs.push({ name: DocumentDetailTab.Original, title: i18next.t("tabs.original", { ns: "document" }) });
  return tabs;
};
