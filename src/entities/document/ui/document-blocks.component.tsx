import type { ReactNode } from "react";

import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";

import { Icon } from "@/shared/ui/icon/icon.entry";

import type { DocumentBlockDTO } from "../model/document.types";

const HEADING_CLASSES: Record<number, string> = {
  1: "text-h4",
  2: "text-h5",
  3: "text-h6",
};

interface ICellPlacement {
  row: number;
  col: number;
  rowSpan: number;
  colSpan: number;
  text: string;
}

/** Turns the grid plus merged-cell spans into the cells a browser table actually draws. */
const placeCells = (rows: string[][], spans: number[][] | null): ICellPlacement[][] => {
  const covered = new Set<string>();
  const spanAt = new Map<string, number[]>();
  (spans ?? []).forEach((span) => spanAt.set(`${span[0]}:${span[1]}`, span));

  return rows.map((row, r) =>
    row.flatMap((text, c) => {
      if (covered.has(`${r}:${c}`)) return [];
      const span = spanAt.get(`${r}:${c}`);
      const rowSpan = span ? span[2] : 1;
      const colSpan = span ? span[3] : 1;
      for (let dr = 0; dr < rowSpan; dr++) {
        for (let dc = 0; dc < colSpan; dc++) {
          if (dr || dc) covered.add(`${r + dr}:${c + dc}`);
        }
      }
      return [{ row: r, col: c, rowSpan, colSpan, text }];
    }),
  );
};

interface IDocumentTableProps {
  block: DocumentBlockDTO;
}

const DocumentTable = (props: IDocumentTableProps) => {
  const { block } = props;
  const rows = block.rows ?? [];
  const headerRows = block.headerRows ?? 0;
  const placed = placeCells(rows, block.spans);

  return (
    <div className="overflow-x-auto rounded-xl border border-greyscale-300">
      <table className="min-w-full border-collapse text-sm">
        <tbody>
          {placed.map((cells, r) => (
            <tr key={r} className={twMerge("border-b border-greyscale-200 last:border-b-0", r < headerRows && "bg-greyscale-100")}>
              {cells.map((cell) => {
                const Cell = r < headerRows ? "th" : "td";
                return (
                  <Cell
                    key={`${cell.row}:${cell.col}`}
                    rowSpan={cell.rowSpan}
                    colSpan={cell.colSpan}
                    className={twMerge(
                      "border-r border-greyscale-200 px-3 py-2 text-left align-top whitespace-pre-line text-greyscale-800 last:border-r-0",
                      r < headerRows && "font-semibold text-greyscale-900",
                    )}
                  >
                    {cell.text}
                  </Cell>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

interface IDocumentBlocksProps {
  blocks: DocumentBlockDTO[];
}

export const DocumentBlocks = (props: IDocumentBlocksProps) => {
  const { t } = useTranslation("document");

  const renderBlock = (block: DocumentBlockDTO, index: number): ReactNode => {
    switch (block.type) {
      case "heading":
        return (
          <h3 key={index} className={twMerge("text-greyscale-900", HEADING_CLASSES[block.level ?? 3] ?? "text-h6")}>
            {block.text}
          </h3>
        );
      case "table":
        return <DocumentTable key={index} block={block} />;
      case "stamp":
      case "signature":
        return (
          <span
            key={index}
            className="flex w-fit items-center gap-2 rounded-lg border border-dashed border-electro-300 bg-electro-50 px-3 py-1.5 text-xs text-electro-700"
          >
            <Icon name="stamp" className="size-3.5" />
            {block.type === "signature" ? t("block.signature") : block.text || t("block.stamp")}
          </span>
        );
      default:
        return (
          <p key={index} className="text-sm leading-6 whitespace-pre-line text-greyscale-800">
            {block.text}
          </p>
        );
    }
  };

  return <div className="flex flex-col gap-3">{props.blocks.map(renderBlock)}</div>;
};
