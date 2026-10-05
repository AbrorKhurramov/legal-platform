import { Skeleton } from "local-agro-ui";

export const StatCardSkeleton = () => {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-greyscale-300 bg-white p-5">
      <Skeleton className="size-11 rounded-xl" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-7 w-1/3" />
      </div>
    </div>
  );
};
