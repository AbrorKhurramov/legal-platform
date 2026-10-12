export interface FolderDTO {
  id: string;
  name: string;
  parentId: string | null;
  /** Files directly in this folder that the current user may see; not recursive. */
  documentCount: number;
}

export interface FolderRefDTO {
  id: string;
  name: string;
}

export interface FolderNode extends FolderDTO {
  depth: number;
  /** Names from the root down to this folder. */
  path: string[];
  /** This folder's files plus every descendant's. */
  totalCount: number;
  children: FolderNode[];
}

export interface CreateFolderRequestBody {
  name: string;
  parentId: string | null;
}

export interface RenameFolderRequestBody {
  id: string;
  name: string;
}
