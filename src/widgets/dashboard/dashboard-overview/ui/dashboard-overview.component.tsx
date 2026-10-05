import { DashboardCourt } from "./dashboard-court.component";
import { DashboardDeadlines } from "./dashboard-deadlines.component";
import { DashboardKpi } from "./dashboard-kpi.component";
import { DashboardMatterCharts } from "./dashboard-matter-charts.component";
import { DashboardRisk } from "./dashboard-risk.component";
import { DashboardWorkload } from "./dashboard-workload.component";

export const DashboardOverview = () => {
  return (
    <div className="flex flex-col gap-5">
      <DashboardKpi />
      <DashboardMatterCharts />
      <DashboardDeadlines />
      <DashboardWorkload />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <DashboardCourt />
        <DashboardRisk />
      </div>
    </div>
  );
};
