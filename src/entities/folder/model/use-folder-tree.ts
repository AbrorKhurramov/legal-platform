import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

import { folderApi, folderApiQueryKeys } from "./folder.api";
import { buildFolderTree } from "./folder.mapper";

export const useFolderTree = (enabled = true) => {
  const { data, isFetching } = useQuery({
    queryFn: folderApi.getFolders,
    queryKey: folderApiQueryKeys.getKey("getFolders"),
    enabled,
  });
  const tree = useMemo(() => buildFolderTree(data), [data]);
  return { folders: data, tree, isFetching };
};
