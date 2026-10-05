import { useQuery } from "@tanstack/react-query";
import { Select, Table } from "local-agro-ui";
import { useTranslation } from "react-i18next";

import { FilterBar } from "@/shared/components/filter-bar/filter-bar.entry";
import { SearchInput } from "@/shared/components/search-input/search-input.entry";
import { useListState } from "@/shared/hooks/use-list-state";
import { cleanParams } from "@/shared/lib/filter-lib";
import { findOption } from "@/shared/lib/select-lib";

import {
  type ImpactLevel,
  type LegislationListRequestParams,
  type LegislationSource,
  type LegislationStatus,
  getImpactLevelOptions,
  getLegislationSourceOptions,
  getLegislationStatusOptions,
  legislationApi,
  legislationApiQueryKeys,
} from "@/entities/legislation/legislation.entry";

import { getLegislationColumns } from "../common/legislation-table.columns";

interface ILegislationFilters {
  source?: LegislationSource;
  status?: LegislationStatus;
  impactLevel?: ImpactLevel;
}

interface ILegislationTableProps {
  onOpen(id: string): void;
}

export const LegislationTable = (props: ILegislationTableProps) => {
  const { onOpen } = props;
  const { t } = useTranslation("legislation");
  const list = useListState<ILegislationFilters>({});
  const sourceOptions = getLegislationSourceOptions();
  const statusOptions = getLegislationStatusOptions();
  const impactOptions = getImpactLevelOptions();

  const requestParams: LegislationListRequestParams = { ...list.requestParams, ...cleanParams({ ...list.filters, search: list.debouncedSearch }) };

  const { data, isFetching } = useQuery({
    queryFn: () => legislationApi.getLegislationChanges(requestParams),
    queryKey: legislationApiQueryKeys.getKey("getLegislationChanges", requestParams),
  });

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-greyscale-300 bg-white pb-5">
      <FilterBar hasActiveFilters={list.hasActiveFilters} onReset={list.resetFilters}>
        <SearchInput value={list.search} placeholder={t("searchPlaceholder")} onChange={list.setSearch} />
        <Select
          placeholder={t("fields.source")}
          options={sourceOptions}
          value={findOption(sourceOptions, list.filters.source)}
          isClearable
          onChange={(option) => list.setFilter("source", option?.value)}
        />
        <Select
          placeholder={t("fields.status")}
          options={statusOptions}
          value={findOption(statusOptions, list.filters.status)}
          isClearable
          onChange={(option) => list.setFilter("status", option?.value)}
        />
        <Select
          placeholder={t("fields.impactLevel")}
          options={impactOptions}
          value={findOption(impactOptions, list.filters.impactLevel)}
          isClearable
          onChange={(option) => list.setFilter("impactLevel", option?.value)}
        />
      </FilterBar>
      <div className="px-5">
        <Table
          data={data?.data}
          columns={getLegislationColumns(t)}
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
