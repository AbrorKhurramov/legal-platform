export const ROUTES = {
  login: "/login",
  dashboard: "/",
  matters: "/matters",
  matterDetail: "/matters/:matterId",
  opinions: "/opinions",
  courtCases: "/court-cases",
  legislation: "/legislation",
  risks: "/risks",
  knowledge: "/knowledge",
  audit: "/audit",
  forbidden: "/403",
} as const;

export const buildMatterDetailRoute = (matterId: string) => ROUTES.matterDetail.replace(":matterId", matterId);
