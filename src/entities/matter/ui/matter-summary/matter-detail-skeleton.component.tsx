import { Skeleton } from "local-agro-ui";

export const MatterDetailSkeleton = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 rounded-2xl border border-greyscale-300 bg-white p-5">
        <Skeleton className="h-5 w-64" />
        <Skeleton className="h-7 w-2/3" />
        <Skeleton className="h-4 w-40" />
      </div>
      <Skeleton className="h-10 w-96 rounded-xl" />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Skeleton className="h-72 rounded-2xl xl:col-span-2" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    </div>
  );
};
