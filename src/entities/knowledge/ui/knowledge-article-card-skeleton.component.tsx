import { Skeleton } from "local-agro-ui";

export const KnowledgeArticleCardSkeleton = () => {
  return (
    <div className="flex gap-4 rounded-2xl border border-greyscale-300 bg-white p-5">
      <Skeleton className="size-10 rounded-xl" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-5 w-3/4" />
      </div>
    </div>
  );
};
