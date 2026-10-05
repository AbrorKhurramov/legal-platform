import { useQuery } from "@tanstack/react-query";
import { Select, Table } from "local-agro-ui";
import { useTranslation } from "react-i18next";

import { FilterBar } from "@/shared/components/filter-bar/filter-bar.entry";
import { SearchInput } from "@/shared/components/search-input/search-input.entry";
import { useListState } from "@/shared/hooks/use-list-state";
import { cleanParams } from "@/shared/lib/filter-lib";
import { findOption } from "@/shared/lib/select-lib";

import {
  type CourtCaseCategory,
  type CourtCaseListRequestParams,
  type CourtCaseResult,
  type CourtCaseStage,
  courtCaseApi,
  courtCaseApiQueryKeys,
  getCourtCaseCategoryOptions,
  getCourtCaseResultOptions,
  getCourtCaseStageOptions,
} from "@/entities/court-case/court-case.entry";

import { getCourtCaseColumns } from "../common/court-case-table.columns";

interface ICourtCaseFilters {
  category?: CourtCaseCategory;
  stage?: CourtCaseStage;
  result?: CourtCaseResult;
}

interface ICourtCaseTableProps {
  onOpen(id: string): void;
}

export const CourtCaseTable = (props: ICourtCaseTableProps) => {
  const { onOpen } = props;
  const { t } = useTranslation("court");
  const list = useListState<ICourtCaseFilters>({});
  const categoryOptions = getCourtCaseCategoryOptions();
  const stageOptions = getCourtCaseStageOptions();
  const resultOptions = getCourtCaseResultOptions();

  const requestParams: CourtCaseListRequestParams = { ...list.requestParams, ...cleanParams({ ...list.filters, search: list.debouncedSearch }) };

  const { data, isFetching } = useQuery({
    queryFn: () => courtCaseApi.getCourtCases(requestParams),
    queryKey: courtCaseApiQueryKeys.getKey("getCourtCases", requestParams),
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
          placeholder={t("fields.stage")}
          options={stageOptions}
          value={findOption(stageOptions, list.filters.stage)}
          isClearable
          onChange={(option) => list.setFilter("stage", option?.value)}
        />
        <Select
          placeholder={t("fields.result")}
          options={resultOptions}
          value={findOption(resultOptions, list.filters.result)}
          isClearable
          onChange={(option) => list.setFilter("result", option?.value)}
        />
      </FilterBar>
      <div className="px-5">
        <Table
          data={data?.data}
          columns={getCourtCaseColumns(t)}
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
