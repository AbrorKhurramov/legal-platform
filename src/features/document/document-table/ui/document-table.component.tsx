import { useEffect } from "react";

import { useQuery } from "@tanstack/react-query";
import { Select, Table, Toggle } from "local-agro-ui";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { FilterBar } from "@/shared/components/filter-bar/filter-bar.entry";
import { SearchInput } from "@/shared/components/search-input/search-input.entry";
import { DEFAULT_PAGE } from "@/shared/const/pagination-const";
import { buildDocumentDetailRoute } from "@/shared/const/route-const";
import { useListState } from "@/shared/hooks/use-list-state";
import { cleanParams } from "@/shared/lib/filter-lib";
import { findOption } from "@/shared/lib/select-lib";

import {
  type ContentSource,
  type DocumentListRequestParams,
  documentApi,
  documentApiQueryKeys,
  getContentSourceOptions,
  getDocTypeOptions,
} from "@/entities/document/document.entry";

import { getDocumentColumns } from "../common/document-table.columns";

interface IDocumentFilters {
  docType?: string;
  source?: ContentSource;
  needsReview: boolean;
}

interface IDocumentTableProps {
  /** Selected in the folder tree; covers subfolders too. */
  folderId?: string | null;
}

export const DocumentTable = (props: IDocumentTableProps) => {
  const { folderId } = props;
  const { t } = useTranslation("document");
  const navigate = useNavigate();
  const list = useListState<IDocumentFilters>({ needsReview: false });
  const docTypeOptions = getDocTypeOptions();
  const sourceOptions = getContentSourceOptions();
  const { setPage } = list;

  useEffect(() => setPage(DEFAULT_PAGE), [folderId, setPage]);

  const requestParams: DocumentListRequestParams = {
    ...list.requestParams,
    ...cleanParams({
      docType: list.filters.docType,
      source: list.filters.source,
      needsReview: list.filters.needsReview || undefined,
      search: list.debouncedSearch,
      folderId: folderId ?? undefined,
    }),
  };

  const { data, isFetching } = useQuery({
    queryFn: () => documentApi.getDocuments(requestParams),
    queryKey: documentApiQueryKeys.getKey("getDocuments", requestParams),
  });

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-greyscale-300 bg-white pb-5">
      <FilterBar hasActiveFilters={list.hasActiveFilters} onReset={list.resetFilters}>
        <SearchInput value={list.search} placeholder={t("filters.documentSearch")} onChange={list.setSearch} />
        <Select
          placeholder={t("columns.docType")}
          options={docTypeOptions}
          value={findOption(docTypeOptions, list.filters.docType)}
          isClearable
          onChange={(option) => list.setFilter("docType", option?.value)}
        />
        <Select
          placeholder={t("columns.source")}
          options={sourceOptions}
          value={findOption(sourceOptions, list.filters.source)}
          isClearable
          onChange={(option) => list.setFilter("source", option?.value)}
        />
        <div className="flex items-center">
          <Toggle
            label={t("filters.needsReview")}
            checked={list.filters.needsReview}
            onChange={(event) => list.setFilter("needsReview", event.target.checked)}
          />
        </div>
      </FilterBar>
      <div className="px-5">
        <Table
          data={data?.data}
          columns={getDocumentColumns(t)}
          isLoading={isFetching && !data}
          onRowClick={(row) => navigate(buildDocumentDetailRoute(row.id))}
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
