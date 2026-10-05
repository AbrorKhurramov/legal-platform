export {
  ApprovalDecision,
  MatterAction,
  MatterComplexity,
  MatterHistoryType,
  MatterPriority,
  MatterStatus,
  MatterType,
  OpinionResult,
  MATTER_STATUSES,
  MATTER_TYPES,
  getMatterPriorityOptions,
  getMatterStatusOptions,
  getMatterTypeOptions,
  getOpinionResultOptions,
} from "./model/matter.const";
export type {
  CreateMatterRequestBody,
  MatterActionRequestBody,
  MatterDetailDTO,
  MatterHistoryItemDTO,
  MatterListItemDTO,
  MatterListRequestParams,
  MatterStatisticsDTO,
} from "./model/matter.types";
export { matterApi, matterApiQueryKeys } from "./model/matter.api";
export { MatterActionConfig, MatterStatusChartColor } from "./common/status.config";
export { ConfidentialBadge, MatterPriorityTag, MatterStatusTag, OpinionResultBadge } from "./ui/matter-tags/matter-tags.component";
export { MatterDeadline } from "./ui/matter-deadline/matter-deadline.component";
export { MatterHeader } from "./ui/matter-summary/matter-header.component";
export { MatterSummary } from "./ui/matter-summary/matter-summary.component";
export { MatterDetailSkeleton } from "./ui/matter-summary/matter-detail-skeleton.component";
export { MatterDocuments } from "./ui/matter-documents/matter-documents.component";
export { MatterApprovals } from "./ui/matter-approvals/matter-approvals.component";
export { MatterOpinion } from "./ui/matter-opinion/matter-opinion.component";
export { MatterHistory } from "./ui/matter-history/matter-history.component";
export { MatterHistorySkeleton } from "./ui/matter-history/matter-history-skeleton.component";
