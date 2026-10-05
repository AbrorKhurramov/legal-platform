import { MatterStatus } from "@/entities/matter/matter.entry";
import { OpinionRegistryStatus } from "@/entities/opinion/opinion.entry";

import { getDb } from "../mock-db";
import { mockRoute } from "../mock-router";
import { canSeeMatter, toShortUser } from "../mock-rules";
import { matchesSearch, ok, paginate } from "../mock-utils";

const SUMMARY_LENGTH = 180;

export const registerOpinionHandlers = () => {
  mockRoute("get", "/opinion-service/opinions", (request) => {
    const db = getDb();
    const { search, result } = request.query;
    const items = db.matters
      .filter((matter) => matter.opinion && (matter.status === MatterStatus.ON_APPROVAL || matter.status === MatterStatus.COMPLETED))
      .filter((matter) => canSeeMatter(request.user!, matter))
      .filter((matter) => !result || matter.opinion!.result === result)
      .filter((matter) => matchesSearch(search, matter.opinion!.number, matter.number, matter.title))
      .sort((a, b) => b.opinion!.createdAt.localeCompare(a.opinion!.createdAt))
      .map((matter) => {
        const opinion = matter.opinion!;
        const lastApproval = [...matter.approvals].reverse().find((approval) => approval.decidedAt);
        const isApproved = matter.status === MatterStatus.COMPLETED;
        return {
          id: opinion.id,
          number: opinion.number,
          matterId: matter.id,
          matterNumber: matter.number,
          matterTitle: matter.title,
          matterType: matter.type,
          result: opinion.result,
          status: isApproved ? OpinionRegistryStatus.APPROVED : OpinionRegistryStatus.ON_APPROVAL,
          lawyer: toShortUser(db, opinion.lawyerId),
          approvedBy: isApproved && lastApproval ? toShortUser(db, lastApproval.approverId) : null,
          createdAt: opinion.createdAt,
          approvedAt: isApproved ? matter.completedAt : null,
          summary: opinion.text.length > SUMMARY_LENGTH ? `${opinion.text.slice(0, SUMMARY_LENGTH)}…` : opinion.text,
        };
      });
    return ok(paginate(items, request.query));
  });
};
