import type { SelectOptionType } from "local-agro-ui";

import type { FolderDTO, FolderNode } from "./folder.types";

const byName = (a: FolderNode, b: FolderNode) => a.name.localeCompare(b.name);

/** The backend returns a flat list; the tree, depths and recursive counts are built here. */
export const buildFolderTree = (folders: FolderDTO[] = []): FolderNode[] => {
  const nodes = new Map<string, FolderNode>(folders.map((folder) => [folder.id, { ...folder, depth: 0, path: [], totalCount: 0, children: [] }]));
  const roots: FolderNode[] = [];
  nodes.forEach((node) => {
    const parent = node.parentId ? nodes.get(node.parentId) : undefined;
    if (parent) parent.children.push(node);
    else roots.push(node);
  });

  const walk = (node: FolderNode, depth: number, path: string[]): number => {
    node.depth = depth;
    node.path = [...path, node.name];
    node.children.sort(byName);
    node.totalCount = node.documentCount + node.children.reduce((sum, child) => sum + walk(child, depth + 1, node.path), 0);
    return node.totalCount;
  };
  roots.sort(byName).forEach((root) => walk(root, 0, []));
  return roots;
};

/** Depth-first order, the way the tree reads top to bottom. */
export const flattenFolderTree = (tree: FolderNode[]): FolderNode[] => tree.flatMap((node) => [node, ...flattenFolderTree(node.children)]);

export type FolderOption = SelectOptionType<string, { depth: number; name: string }>;

/** The label is the full path, so typing any part of it finds the folder; the menu shows it indented. */
export const mapFoldersToOptions = (tree: FolderNode[]): FolderOption[] =>
  flattenFolderTree(tree).map((node) => ({ value: node.id, label: node.path.join(" / "), depth: node.depth, name: node.name }));
