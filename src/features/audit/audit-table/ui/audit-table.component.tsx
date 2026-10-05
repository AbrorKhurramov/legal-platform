import { useQuery } from "@tanstack/react-query";
import { RangePicker, Select, Table } from "local-agro-ui";
import { useTranslation } from "react-i18next";

import { FilterBar } from "@/shared/components/filter-bar/filter-bar.entry";
import { SearchInput } from "@/shared/components/search-input/search-input.entry";
import { useListState } from "@/shared/hooks/use-list-state";
import { cleanParams } from "@/shared/lib/filter-lib";
import { findOption } from "@/shared/lib/select-lib";
import { toIsoDate } from "@/shared/utils/format-date";

import {
  type AuditAction,
  type AuditEntityType,
  type AuditLogRequestParams,
  auditApi,
  auditApiQueryKeys,
  getAuditActionOptions,
  getAuditEntityTypeOptions,
} from "@/entities/audit/audit.entry";

import { getAuditColumns } from "../common/audit-table.columns";

interface IAuditFilters {
  action?: AuditAction;
  entityType?: AuditEntityType;
  dateFrom?: Date | null;
  dateTo?: Date | null;
}

export const AuditTable = () => {
  const { t } = useTranslation(["audit", "common"]);
  const list = useListState<IAuditFilters>({});
  const actionOptions = getAuditActionOptions();
  const entityOptions = getAuditEntityTypeOptions();
  const { filters } = list;

  const requestParams: AuditLogRequestParams = {
    ...list.requestParams,
    ...cleanParams({
      action: filters.action,
      entityType: filters.entityType,
      dateFrom: toIsoDate(filters.dateFrom ?? null),
      dateTo: toIsoDate(filters.dateTo ?? null),
      search: list.debouncedSearch,
    }),
  };

  const { data, isFetching } = useQuery({
    queryFn: () => auditApi.getAuditLogs(requestParams),
    queryKey: auditApiQueryKeys.getKey("getAuditLogs", requestParams),
  });

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-greyscale-300 bg-white pb-5">
      <FilterBar hasActiveFilters={list.hasActiveFilters} onReset={list.resetFilters}>
        <SearchInput value={list.search} placeholder={t("audit:searchPlaceholder")} onChange={list.setSearch} />
        <Select
          placeholder={t("audit:fields.action")}
          options={actionOptions}
          value={findOption(actionOptions, filters.action)}
          isClearable
          onChange={(option) => list.setFilter("action", option?.value)}
        />
        <Select
          placeholder={t("audit:fields.entity")}
          options={entityOptions}
          value={findOption(entityOptions, filters.entityType)}
          isClearable
          onChange={(option) => list.setFilter("entityType", option?.value)}
        />
        <RangePicker
          placeholder={t("audit:fields.period")}
          startDate={filters.dateFrom ?? null}
          endDate={filters.dateTo ?? null}
          setRange={(start, end) => {
            list.setFilter("dateFrom", start);
            list.setFilter("dateTo", end);
          }}
          isClearable
        />
      </FilterBar>
      <div className="px-5">
        <Table
          data={data?.data}
          columns={getAuditColumns(t)}
          isLoading={isFetching}
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
