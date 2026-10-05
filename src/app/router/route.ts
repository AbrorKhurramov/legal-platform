import { createBrowserRouter } from "react-router";

import { AuditListPage } from "@/pages/audit/audit-list/audit-list.entry";
import { CourtCaseListPage } from "@/pages/court-case/court-case-list/court-case-list.entry";
import { DashboardPage } from "@/pages/dashboard/dashboard.entry";
import { KnowledgeHomePage } from "@/pages/knowledge/knowledge-home/knowledge-home.entry";
import { LegislationListPage } from "@/pages/legislation/legislation-list/legislation-list.entry";
import { LoginPage } from "@/pages/login/login.entry";
import { MatterDetailPage } from "@/pages/matter/matter-detail/matter-detail.entry";
import { MatterListPage } from "@/pages/matter/matter-list/matter-list.entry";
import { OpinionListPage } from "@/pages/opinion/opinion-list/opinion-list.entry";
import { RiskListPage } from "@/pages/risk/risk-list/risk-list.entry";
import { NotFoundPage } from "@/pages/system/not-found/not-found.entry";

import { ROUTES } from "@/shared/const/route-const";

import { RoleBasedGuard } from "@/entities/user/user.entry";

import { AppLayout } from "../layouts/app-layout/app-layout.entry";
import { AuthLayout } from "../layouts/auth-layout/auth-layout.entry";
import type { RouteHandle } from "./route.types";

const handle = (value: RouteHandle) => value;

export const router = createBrowserRouter([
  {
    Component: AuthLayout,
    children: [{ path: ROUTES.login, Component: LoginPage }],
  },
  {
    path: ROUTES.dashboard,
    Component: AppLayout,
    handle: handle({ crumb: "breadcrumbs.home" }),
    children: [
      { index: true, Component: DashboardPage, handle: handle({ guard: RoleBasedGuard.dashboard["display:route"] }) },
      {
        path: ROUTES.matters,
        handle: handle({ crumb: "breadcrumbs.matters", guard: RoleBasedGuard.matters["display:route"] }),
        children: [
          { index: true, Component: MatterListPage },
          { path: ROUTES.matterDetail, Component: MatterDetailPage, handle: handle({ crumb: "breadcrumbs.matterDetail" }) },
        ],
      },
      {
        path: ROUTES.opinions,
        Component: OpinionListPage,
        handle: handle({ crumb: "breadcrumbs.opinions", guard: RoleBasedGuard.opinions["display:route"] }),
      },
      {
        path: ROUTES.courtCases,
        Component: CourtCaseListPage,
        handle: handle({ crumb: "breadcrumbs.courtCases", guard: RoleBasedGuard.courtCases["display:route"] }),
      },
      {
        path: ROUTES.legislation,
        Component: LegislationListPage,
        handle: handle({ crumb: "breadcrumbs.legislation", guard: RoleBasedGuard.legislation["display:route"] }),
      },
      { path: ROUTES.risks, Component: RiskListPage, handle: handle({ crumb: "breadcrumbs.risks", guard: RoleBasedGuard.risks["display:route"] }) },
      {
        path: ROUTES.knowledge,
        Component: KnowledgeHomePage,
        handle: handle({ crumb: "breadcrumbs.knowledge", guard: RoleBasedGuard.knowledge["display:route"] }),
      },
      { path: ROUTES.audit, Component: AuditListPage, handle: handle({ crumb: "breadcrumbs.audit", guard: RoleBasedGuard.audit["display:route"] }) },
      { path: "*", Component: NotFoundPage },
    ],
  },
]);
