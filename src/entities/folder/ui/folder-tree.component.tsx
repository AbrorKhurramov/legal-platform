import { type ReactNode, useEffect, useState } from "react";

import { twMerge } from "tailwind-merge";

import { Icon } from "@/shared/ui/icon/icon.entry";

import { flattenFolderTree } from "../model/folder.mapper";
import type { FolderNode } from "../model/folder.types";

interface IFolderTreeProps {
  tree: FolderNode[];
  selectedId: string | null;
  allLabel: string;
  onSelect(folderId: string | null): void;
  /** Extra controls shown on a row's hover, e.g. rename and delete. */
  renderActions?(node: FolderNode): ReactNode;
}

const rowClassName = "group flex w-full items-center gap-2 rounded-lg py-1.5 pr-2 text-left text-sm transition";

export const FolderTree = (props: IFolderTreeProps) => {
  const { tree, selectedId, allLabel, onSelect, renderActions } = props;
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  // A folder opened from the URL must be visible: unfold its ancestors once the tree arrives.
  useEffect(() => {
    const byId = new Map(flattenFolderTree(tree).map((node) => [node.id, node]));
    const ancestors: string[] = [];
    for (let parentId = selectedId && byId.get(selectedId)?.parentId; parentId; parentId = byId.get(parentId)?.parentId) ancestors.push(parentId);
    if (ancestors.length) setExpanded((prevState) => new Set([...prevState, ...ancestors]));
  }, [tree, selectedId]);

  const toggle = (id: string) =>
    setExpanded((prevState) => {
      const next = new Set(prevState);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const renderNode = (node: FolderNode): ReactNode => {
    const isOpen = expanded.has(node.id);
    const isSelected = node.id === selectedId;
    return (
      <li key={node.id}>
        <div
          className={twMerge(rowClassName, isSelected ? "bg-main-green-50 text-main-green-800" : "text-greyscale-800 hover:bg-greyscale-100")}
          style={{ paddingLeft: `${node.depth * 16 + 4}px` }}
        >
          <button
            type="button"
            aria-label={node.name}
            className={twMerge("flex size-5 shrink-0 items-center justify-center text-greyscale-500", !node.children.length && "invisible")}
            onClick={() => toggle(node.id)}
          >
            <Icon name={isOpen ? "chevron-down" : "chevron-right"} className="size-3.5" />
          </button>
          <button type="button" className="flex min-w-0 flex-1 items-center gap-2" title={node.path.join(" / ")} onClick={() => onSelect(node.id)}>
            <Icon name={isSelected ? "folder-open" : "folder"} className="size-4 shrink-0 text-warning-500" />
            <span className={twMerge("truncate", isSelected && "font-medium")}>{node.name}</span>
          </button>
          {renderActions && <span className="hidden shrink-0 items-center gap-0.5 group-hover:flex">{renderActions(node)}</span>}
          <span className="shrink-0 text-xs text-greyscale-500 group-hover:hidden">{node.totalCount}</span>
        </div>
        {isOpen && node.children.length > 0 && <ul>{node.children.map(renderNode)}</ul>}
      </li>
    );
  };

  return (
    <nav className="flex flex-col gap-0.5">
      <button
        type="button"
        className={twMerge(
          rowClassName,
          "pl-1",
          selectedId === null ? "bg-main-green-50 font-medium text-main-green-800" : "text-greyscale-800 hover:bg-greyscale-100",
        )}
        onClick={() => onSelect(null)}
      >
        <span className="flex size-5 shrink-0 items-center justify-center">
          <Icon name="layers" className="size-4" />
        </span>
        <span className="flex-1">{allLabel}</span>
      </button>
      <ul>{tree.map(renderNode)}</ul>
    </nav>
  );
};
