import { useQuery } from "@tanstack/react-query";
import { Select, Table } from "local-agro-ui";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { FilterBar } from "@/shared/components/filter-bar/filter-bar.entry";
import { SearchInput } from "@/shared/components/search-input/search-input.entry";
import { buildMatterDetailRoute } from "@/shared/const/route-const";
import { useListState } from "@/shared/hooks/use-list-state";
import { cleanParams } from "@/shared/lib/filter-lib";
import { findOption } from "@/shared/lib/select-lib";

import {
  type OpinionListRequestParams,
  type OpinionRegistryResult,
  getOpinionRegistryResultOptions,
  opinionApi,
  opinionApiQueryKeys,
} from "@/entities/opinion/opinion.entry";

import { getOpinionColumns } from "../common/opinion-table.columns";

interface IOpinionFilters {
  result?: OpinionRegistryResult;
}

export const OpinionTable = () => {
  const { t } = useTranslation(["opinion", "matter"]);
  const navigate = useNavigate();
  const list = useListState<IOpinionFilters>({});
  const resultOptions = getOpinionRegistryResultOptions();

  const requestParams: OpinionListRequestParams = { ...list.requestParams, ...cleanParams({ ...list.filters, search: list.debouncedSearch }) };

  const { data, isFetching } = useQuery({
    queryFn: () => opinionApi.getOpinions(requestParams),
    queryKey: opinionApiQueryKeys.getKey("getOpinions", requestParams),
  });

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-greyscale-300 bg-white pb-5">
      <FilterBar hasActiveFilters={list.hasActiveFilters} onReset={list.resetFilters}>
        <SearchInput value={list.search} placeholder={t("opinion:searchPlaceholder")} onChange={list.setSearch} />
        <Select
          placeholder={t("opinion:fields.result")}
          options={resultOptions}
          value={findOption(resultOptions, list.filters.result)}
          isClearable
          onChange={(option) => list.setFilter("result", option?.value)}
        />
      </FilterBar>
      <div className="px-5">
        <Table
          data={data?.data}
          columns={getOpinionColumns(t)}
          isLoading={isFetching}
          onRowClick={(row) => navigate(`${buildMatterDetailRoute(row.matterId)}?tab=opinion`)}
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
