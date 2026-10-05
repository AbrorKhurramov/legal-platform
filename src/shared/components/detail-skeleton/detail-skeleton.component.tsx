import { Skeleton, SkeletonWrapper } from "local-agro-ui";

export const DetailSkeleton = () => {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-6 w-2/3" />
      <SkeletonWrapper count={8} className="grid grid-cols-2 gap-4">
        <Skeleton className="h-10" />
      </SkeletonWrapper>
      <SkeletonWrapper count={3} className="flex flex-col gap-2">
        <Skeleton className="h-12 rounded-xl" />
      </SkeletonWrapper>
    </div>
  );
};
