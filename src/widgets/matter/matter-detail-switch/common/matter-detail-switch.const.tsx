import type { JSX } from "react";

import i18next from "i18next";
import type { TabSwitcherItemType } from "local-agro-ui";

import { MatterHistoryFeed } from "@/features/matter/matter-history-feed/matter-history-feed.entry";

import { MatterApprovals, type MatterDetailDTO, MatterDocuments, MatterOpinion, MatterSummary } from "@/entities/matter/matter.entry";

import { MatterDetailTab } from "./matter-detail-switch.types";

export const MATTER_DETAIL_TABS: MatterDetailTab[] = [
  MatterDetailTab.Overview,
  MatterDetailTab.Documents,
  MatterDetailTab.Approvals,
  MatterDetailTab.Opinion,
  MatterDetailTab.History,
];

export const MATTER_DETAIL_COMPONENTS: Record<MatterDetailTab, (props: { matter: MatterDetailDTO }) => JSX.Element> = {
  [MatterDetailTab.Overview]: ({ matter }) => <MatterSummary matter={matter} />,
  [MatterDetailTab.Documents]: ({ matter }) => <MatterDocuments documents={matter.documents} currentVersion={matter.currentVersion} />,
  [MatterDetailTab.Approvals]: ({ matter }) => <MatterApprovals approvals={matter.approvals} />,
  [MatterDetailTab.Opinion]: ({ matter }) => <MatterOpinion opinion={matter.opinion} />,
  [MatterDetailTab.History]: ({ matter }) => <MatterHistoryFeed matterId={matter.id} />,
};

export const getMatterDetailTabItems = (matter?: MatterDetailDTO): TabSwitcherItemType<MatterDetailTab>[] =>
  MATTER_DETAIL_TABS.map((name) => {
    const count =
      name === MatterDetailTab.Documents ? matter?.documents.length : name === MatterDetailTab.Approvals ? matter?.approvals.length : undefined;
    const title = i18next.t(`tabs.${name}`, { ns: "matter" });
    return { name, title: count ? `${title} (${count})` : title };
  });
