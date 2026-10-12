import { useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Select, Table, Toggle } from "local-agro-ui";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { FilterBar } from "@/shared/components/filter-bar/filter-bar.entry";
import { SearchInput } from "@/shared/components/search-input/search-input.entry";
import { buildDocumentDetailRoute } from "@/shared/const/route-const";
import { useListState } from "@/shared/hooks/use-list-state";
import { cleanParams } from "@/shared/lib/filter-lib";
import { findOption } from "@/shared/lib/select-lib";

import {
  type FileListRequestParams,
  type FileManagerItemDTO,
  ProcessingStatus,
  documentApi,
  documentApiQueryKeys,
  getProcessingStatusOptions,
} from "@/entities/document/document.entry";

import { getFileManagerColumns } from "../common/file-manager-table.columns";
import { FileMoveModal } from "./file-move-modal.component";

const POLL_INTERVAL_MS = 4000;

interface IFileManagerFilters {
  status?: ProcessingStatus;
  mineOnly: boolean;
}

export const FileManagerTable = () => {
  const { t } = useTranslation("document");
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const list = useListState<IFileManagerFilters>({ mineOnly: false });
  const statusOptions = getProcessingStatusOptions();
  const [moving, setMoving] = useState<FileManagerItemDTO | null>(null);

  const requestParams: FileListRequestParams = {
    ...list.requestParams,
    ...cleanParams({ status: list.filters.status, mineOnly: list.filters.mineOnly || undefined, search: list.debouncedSearch }),
  };

  const { data, isFetching } = useQuery({
    queryFn: () => documentApi.getFiles(requestParams),
    queryKey: documentApiQueryKeys.getKey("getFiles", requestParams),
    refetchInterval: (query) =>
      query.state.data?.data.some((file) => file.status === ProcessingStatus.PENDING || file.status === ProcessingStatus.PROCESSING)
        ? POLL_INTERVAL_MS
        : false,
  });

  const { mutate: reprocess } = useMutation({
    mutationFn: documentApi.actionReprocess,
    mutationKey: documentApiQueryKeys.getKey("actionReprocess"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: documentApiQueryKeys.getRootKey() }),
  });

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-greyscale-300 bg-white pb-5">
      <FilterBar hasActiveFilters={list.hasActiveFilters} onReset={list.resetFilters}>
        <SearchInput value={list.search} placeholder={t("filters.fileSearch")} onChange={list.setSearch} />
        <Select
          placeholder={t("columns.status")}
          options={statusOptions}
          value={findOption(statusOptions, list.filters.status)}
          isClearable
          onChange={(option) => list.setFilter("status", option?.value)}
        />
        <div className="flex items-center">
          <Toggle
            label={t("filters.mineOnly")}
            checked={list.filters.mineOnly}
            onChange={(event) => list.setFilter("mineOnly", event.target.checked)}
          />
        </div>
      </FilterBar>
      <div className="px-5">
        <Table
          data={data?.data}
          columns={getFileManagerColumns(t, { onReprocess: reprocess, onMove: setMoving })}
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
      <FileMoveModal file={moving} onClose={() => setMoving(null)} />
    </div>
  );
};
