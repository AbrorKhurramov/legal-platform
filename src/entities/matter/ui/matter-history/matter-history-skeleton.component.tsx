import { Skeleton, SkeletonWrapper } from "local-agro-ui";

export const MatterHistorySkeleton = () => {
  return (
    <SkeletonWrapper count={5} className="flex flex-col gap-5">
      <div className="flex gap-3">
        <Skeleton isCircle className="size-8" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    </SkeletonWrapper>
  );
};
