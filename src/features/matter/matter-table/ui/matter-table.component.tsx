import { useQuery } from "@tanstack/react-query";
import { Select, Table, Toggle } from "local-agro-ui";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router";

import { FilterBar } from "@/shared/components/filter-bar/filter-bar.entry";
import { SearchInput } from "@/shared/components/search-input/search-input.entry";
import { buildMatterDetailRoute } from "@/shared/const/route-const";
import { useListState } from "@/shared/hooks/use-list-state";
import { cleanParams } from "@/shared/lib/filter-lib";
import { findOption } from "@/shared/lib/select-lib";

import { branchApi, branchApiQueryKeys, mapBranchesToOptions } from "@/entities/branch/branch.entry";
import {
  type MatterListRequestParams,
  type MatterPriority,
  type MatterStatus,
  type MatterType,
  getMatterPriorityOptions,
  getMatterStatusOptions,
  getMatterTypeOptions,
  matterApi,
  matterApiQueryKeys,
} from "@/entities/matter/matter.entry";
import { UserRole, useCurrentUser } from "@/entities/user/user.entry";

import { getMatterColumns } from "../common/matter-table.columns";

interface IMatterFilters {
  status?: MatterStatus;
  type?: MatterType;
  priority?: MatterPriority;
  branchId?: string;
  overdueOnly: boolean;
  mineOnly: boolean;
}

export const MatterTable = () => {
  const { t } = useTranslation(["matter", "common"]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const user = useCurrentUser();
  const isLegalTeam = user?.role === UserRole.LAWYER || user?.role === UserRole.HEAD;

  const list = useListState<IMatterFilters>({
    status: (searchParams.get("status") as MatterStatus | null) ?? undefined,
    overdueOnly: searchParams.get("overdueOnly") === "true",
    mineOnly: false,
  });
  const { filters, setFilter } = list;

  const statusOptions = getMatterStatusOptions();
  const typeOptions = getMatterTypeOptions();
  const priorityOptions = getMatterPriorityOptions();

  const { data: branches } = useQuery({
    queryFn: branchApi.getBranches,
    queryKey: branchApiQueryKeys.getKey("getBranches"),
    enabled: isLegalTeam,
  });
  const branchOptions = mapBranchesToOptions(branches);

  const requestParams: MatterListRequestParams = {
    ...list.requestParams,
    ...cleanParams({
      ...filters,
      search: list.debouncedSearch,
      overdueOnly: filters.overdueOnly || undefined,
      mineOnly: filters.mineOnly || undefined,
    }),
  };

  const { data, isFetching } = useQuery({
    queryFn: () => matterApi.getMatters(requestParams),
    queryKey: matterApiQueryKeys.getKey("getMatters", requestParams),
  });

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-greyscale-300 bg-white pb-5">
      <FilterBar hasActiveFilters={list.hasActiveFilters} onReset={list.resetFilters}>
        <SearchInput value={list.search} placeholder={t("matter:filters.searchPlaceholder")} onChange={list.setSearch} />
        <Select
          placeholder={t("matter:fields.status")}
          options={statusOptions}
          value={findOption(statusOptions, filters.status)}
          isClearable
          onChange={(option) => setFilter("status", option?.value)}
        />
        <Select
          placeholder={t("matter:fields.type")}
          options={typeOptions}
          value={findOption(typeOptions, filters.type)}
          isClearable
          onChange={(option) => setFilter("type", option?.value)}
        />
        {isLegalTeam ? (
          <Select
            placeholder={t("matter:fields.branch")}
            options={branchOptions}
            value={findOption(branchOptions, filters.branchId)}
            isClearable
            onChange={(option) => setFilter("branchId", option?.value)}
          />
        ) : (
          <Select
            placeholder={t("matter:fields.priority")}
            options={priorityOptions}
            value={findOption(priorityOptions, filters.priority)}
            isClearable
            onChange={(option) => setFilter("priority", option?.value)}
          />
        )}
      </FilterBar>
      <div className="flex flex-wrap items-center gap-6 px-5">
        <Toggle
          label={t("matter:filters.overdueOnly")}
          checked={filters.overdueOnly}
          onChange={(event) => setFilter("overdueOnly", event.target.checked)}
        />
        <Toggle label={t("matter:filters.mineOnly")} checked={filters.mineOnly} onChange={(event) => setFilter("mineOnly", event.target.checked)} />
      </div>
      <div className="px-5">
        <Table
          data={data?.data}
          columns={getMatterColumns(t)}
          isLoading={isFetching}
          onRowClick={(row) => navigate(buildMatterDetailRoute(row.id))}
          isPagination
          pagesSyncQuery
          page={list.page}
          setPage={list.setPage}
          perPage={list.perPage}
          setPerPage={list.setPerPage}
          totalCount={data?.totalCount || 0}
          textSize="sm"
        />
      </div>
    </div>
  );
};
