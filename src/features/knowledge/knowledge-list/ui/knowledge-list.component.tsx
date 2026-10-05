import { useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EmptyData, Pagination, SkeletonWrapper } from "local-agro-ui";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";

import { SearchInput } from "@/shared/components/search-input/search-input.entry";
import { useListState } from "@/shared/hooks/use-list-state";
import { cleanParams } from "@/shared/lib/filter-lib";

import {
  KnowledgeArticleCard,
  KnowledgeArticleCardSkeleton,
  type KnowledgeArticleDTO,
  type KnowledgeCategory,
  type KnowledgeListRequestParams,
  getKnowledgeCategoryOptions,
  knowledgeApi,
  knowledgeApiQueryKeys,
} from "@/entities/knowledge/knowledge.entry";

interface IKnowledgeFilters {
  category?: KnowledgeCategory;
}

export const KnowledgeList = () => {
  const { t } = useTranslation("knowledge");
  const queryClient = useQueryClient();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const list = useListState<IKnowledgeFilters>({});
  const categoryOptions = getKnowledgeCategoryOptions();

  const requestParams: KnowledgeListRequestParams = { ...list.requestParams, ...cleanParams({ ...list.filters, search: list.debouncedSearch }) };

  const { data, isFetching } = useQuery({
    queryFn: () => knowledgeApi.getArticles(requestParams),
    queryKey: knowledgeApiQueryKeys.getKey("getArticles", requestParams),
  });

  const { mutate: markUsed } = useMutation({
    mutationFn: knowledgeApi.actionArticleUse,
    mutationKey: knowledgeApiQueryKeys.getKey("actionArticleUse"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: knowledgeApiQueryKeys.getKey("getArticles") }),
  });

  const handleCopy = async (article: KnowledgeArticleDTO) => {
    try {
      await navigator.clipboard.writeText(article.answer);
      toast.success(t("copied"));
    } catch {
      toast.error(t("copyFailed"));
    }
    markUsed(article.id);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <SearchInput value={list.search} placeholder={t("searchPlaceholder")} onChange={list.setSearch} className="max-w-2xl" />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => list.setFilter("category", undefined)}
            className={twMerge(
              "rounded-full border border-greyscale-300 bg-white px-3 py-1 text-sm text-greyscale-700 transition",
              !list.filters.category && "border-main-green-600 bg-main-green-600 text-white",
            )}
          >
            {t("allCategories")}
          </button>
          {categoryOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => list.setFilter("category", option.value)}
              className={twMerge(
                "rounded-full border border-greyscale-300 bg-white px-3 py-1 text-sm text-greyscale-700 transition hover:border-main-green-400",
                list.filters.category === option.value && "border-main-green-600 bg-main-green-600 text-white",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {isFetching && !data ? (
        <SkeletonWrapper count={5} className="flex flex-col gap-3">
          <KnowledgeArticleCardSkeleton />
        </SkeletonWrapper>
      ) : (
        <div className="flex flex-col gap-3">
          {!data?.data.length && <EmptyData title={t("empty")} className="rounded-2xl bg-white py-10" />}
          {data?.data.map((article) => (
            <KnowledgeArticleCard
              key={article.id}
              article={article}
              isExpanded={expandedId === article.id}
              onToggle={() => setExpandedId((prevState) => (prevState === article.id ? null : article.id))}
              onCopy={() => handleCopy(article)}
            />
          ))}
        </div>
      )}

      {!!data?.totalCount && (
        <Pagination totalCount={data.totalCount} page={list.page} perPage={list.perPage} setPage={list.setPage} setPerPage={list.setPerPage} />
      )}
    </div>
  );
};
