import { Skeleton, SkeletonWrapper } from "local-agro-ui";

export const DocumentDetailSkeleton = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 rounded-2xl border border-greyscale-300 bg-white p-5">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-7 w-2/3" />
      </div>
      <Skeleton className="h-10 w-80 rounded-xl" />
      <SkeletonWrapper count={6} className="flex flex-col gap-3 rounded-2xl border border-greyscale-300 bg-white p-5">
        <Skeleton className="h-4 w-full" />
      </SkeletonWrapper>
    </div>
  );
};
