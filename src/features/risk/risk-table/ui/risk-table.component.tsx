import { useQuery } from "@tanstack/react-query";
import { Select, Table } from "local-agro-ui";
import { useTranslation } from "react-i18next";

import { FilterBar } from "@/shared/components/filter-bar/filter-bar.entry";
import { SearchInput } from "@/shared/components/search-input/search-input.entry";
import { useListState } from "@/shared/hooks/use-list-state";
import { cleanParams } from "@/shared/lib/filter-lib";
import { findOption } from "@/shared/lib/select-lib";

import {
  type RiskCategory,
  type RiskLevel,
  type RiskListRequestParams,
  type RiskStatus,
  getRiskCategoryOptions,
  getRiskLevelOptions,
  getRiskStatusOptions,
  riskApi,
  riskApiQueryKeys,
} from "@/entities/risk/risk.entry";

import { getRiskColumns } from "../common/risk-table.columns";

interface IRiskFilters {
  category?: RiskCategory;
  level?: RiskLevel;
  status?: RiskStatus;
}

interface IRiskTableProps {
  onOpen(id: string): void;
}

export const RiskTable = (props: IRiskTableProps) => {
  const { onOpen } = props;
  const { t } = useTranslation("risk");
  const list = useListState<IRiskFilters>({});
  const categoryOptions = getRiskCategoryOptions();
  const levelOptions = getRiskLevelOptions();
  const statusOptions = getRiskStatusOptions();

  const requestParams: RiskListRequestParams = { ...list.requestParams, ...cleanParams({ ...list.filters, search: list.debouncedSearch }) };

  const { data, isFetching } = useQuery({
    queryFn: () => riskApi.getRisks(requestParams),
    queryKey: riskApiQueryKeys.getKey("getRisks", requestParams),
  });

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-greyscale-300 bg-white pb-5">
      <FilterBar hasActiveFilters={list.hasActiveFilters} onReset={list.resetFilters}>
        <SearchInput value={list.search} placeholder={t("searchPlaceholder")} onChange={list.setSearch} />
        <Select
          placeholder={t("fields.category")}
          options={categoryOptions}
          value={findOption(categoryOptions, list.filters.category)}
          isClearable
          onChange={(option) => list.setFilter("category", option?.value)}
        />
        <Select
          placeholder={t("fields.level")}
          options={levelOptions}
          value={findOption(levelOptions, list.filters.level)}
          isClearable
          onChange={(option) => list.setFilter("level", option?.value)}
        />
        <Select
          placeholder={t("fields.status")}
          options={statusOptions}
          value={findOption(statusOptions, list.filters.status)}
          isClearable
          onChange={(option) => list.setFilter("status", option?.value)}
        />
      </FilterBar>
      <div className="px-5">
        <Table
          data={data?.data}
          columns={getRiskColumns(t)}
          isLoading={isFetching}
          onRowClick={(row) => onOpen(row.id)}
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
