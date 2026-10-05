import { useState } from "react";

import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from "@/shared/const/pagination-const";

import { useDebounce } from "./use-debounce";

export const useListState = <F extends object>(initialFilters: F) => {
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE);
  const [search, setSearchValue] = useState("");
  const [filters, setFilters] = useState<F>(initialFilters);
  const debouncedSearch = useDebounce(search);

  const setFilter = <K extends keyof F>(key: K, value: F[K]) => {
    setFilters((prevState) => ({ ...prevState, [key]: value }));
    setPage(DEFAULT_PAGE);
  };

  const setSearch = (value: string) => {
    setSearchValue(value);
    setPage(DEFAULT_PAGE);
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    setSearchValue("");
    setPage(DEFAULT_PAGE);
  };

  const hasActiveFilters = search !== "" || Object.values(filters).some((value) => value !== undefined && value !== null && value !== false);

  return {
    page,
    setPage,
    perPage,
    setPerPage,
    search,
    debouncedSearch,
    setSearch,
    filters,
    setFilter,
    resetFilters,
    hasActiveFilters,
    requestParams: { page: page - 1, size: perPage },
  };
};
