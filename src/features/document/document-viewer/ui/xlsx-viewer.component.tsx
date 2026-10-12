import { type CSSProperties, useEffect, useState } from "react";

import type { Cell, Workbook, Worksheet } from "exceljs";
import { Skeleton } from "local-agro-ui";
import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";

import { XLSX_MAX_COLUMNS, XLSX_MAX_ROWS } from "../common/document-viewer.const";

const CHAR_WIDTH_PX = 7;
const DEFAULT_COLUMN_CHARS = 10;

interface IMerge {
  rowSpan: number;
  colSpan: number;
}

const columnLetter = (index: number): string => {
  let letters = "";
  for (let n = index; n > 0; n = Math.floor((n - 1) / 26)) letters = String.fromCharCode(65 + ((n - 1) % 26)) + letters;
  return letters;
};

const columnIndex = (letters: string) => [...letters].reduce((sum, char) => sum * 26 + char.charCodeAt(0) - 64, 0);

const parseAddress = (address: string) => {
  const [, letters, digits] = /^([A-Z]+)(\d+)$/.exec(address) ?? [];
  return { row: Number(digits), col: columnIndex(letters ?? "A") };
};

/** "B2:D4" → the top-left cell keeps the spans, the covered cells are skipped. */
const readMerges = (sheet: Worksheet) => {
  const anchors = new Map<string, IMerge>();
  const covered = new Set<string>();
  const ranges: string[] = (sheet.model as { merges?: string[] }).merges ?? [];
  ranges.forEach((range) => {
    const [from, to] = range.split(":").map(parseAddress);
    if (!from || !to) return;
    anchors.set(`${from.row}:${from.col}`, { rowSpan: to.row - from.row + 1, colSpan: to.col - from.col + 1 });
    for (let row = from.row; row <= to.row; row++) {
      for (let col = from.col; col <= to.col; col++) if (row !== from.row || col !== from.col) covered.add(`${row}:${col}`);
    }
  });
  return { anchors, covered };
};

/** ARGB "FF1F4E79" → "#1F4E79"; theme and indexed colours have no value here and are skipped. */
const toCssColor = (argb?: string) => (argb && argb.length === 8 ? `#${argb.slice(2)}` : undefined);

const cellStyle = (cell: Cell): CSSProperties => {
  const fill = cell.fill?.type === "pattern" && cell.fill.pattern === "solid" ? toCssColor(cell.fill.fgColor?.argb) : undefined;
  return {
    fontWeight: cell.font?.bold ? 600 : undefined,
    fontStyle: cell.font?.italic ? "italic" : undefined,
    color: toCssColor(cell.font?.color?.argb),
    backgroundColor: fill,
    textAlign: (["left", "center", "right"] as const).find((value) => value === cell.alignment?.horizontal),
    whiteSpace: cell.alignment?.wrapText ? "pre-wrap" : "nowrap",
    verticalAlign: cell.alignment?.vertical === "middle" ? "middle" : cell.alignment?.vertical === "bottom" ? "bottom" : "top",
  };
};

interface ISheetTableProps {
  sheet: Worksheet;
}

const SheetTable = (props: ISheetTableProps) => {
  const { sheet } = props;
  const { t } = useTranslation("document");
  const rowCount = Math.min(sheet.rowCount, XLSX_MAX_ROWS);
  const columnCount = Math.min(sheet.columnCount, XLSX_MAX_COLUMNS);
  const isCut = sheet.rowCount > XLSX_MAX_ROWS || sheet.columnCount > XLSX_MAX_COLUMNS;
  const { anchors, covered } = readMerges(sheet);
  const columns = Array.from({ length: columnCount }, (_, index) => index + 1);
  const rows = Array.from({ length: rowCount }, (_, index) => index + 1);

  if (!rowCount || !columnCount) return <p className="p-6 text-sm text-greyscale-500">{t("viewer.emptySheet")}</p>;

  return (
    <>
      {isCut && (
        <p className="sticky left-0 bg-warning-50 px-3 py-2 text-xs text-warning-800">
          {t("viewer.sheetCut", { rows: XLSX_MAX_ROWS, columns: XLSX_MAX_COLUMNS })}
        </p>
      )}
      <table className="border-separate border-spacing-0 bg-white text-xs text-greyscale-900">
        <colgroup>
          <col className="w-10" />
          {columns.map((col) => (
            <col key={col} style={{ width: `${Math.round((sheet.getColumn(col).width ?? DEFAULT_COLUMN_CHARS) * CHAR_WIDTH_PX + 8)}px` }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            <th className="sticky top-0 left-0 z-2 border-r border-b border-greyscale-300 bg-greyscale-100" />
            {columns.map((col) => (
              <th
                key={col}
                className="sticky top-0 z-1 border-r border-b border-greyscale-300 bg-greyscale-100 px-2 py-1 font-medium text-greyscale-600"
              >
                {columnLetter(col)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((rowNumber) => {
            const row = sheet.getRow(rowNumber);
            return (
              <tr key={rowNumber}>
                <th className="sticky left-0 z-1 border-r border-b border-greyscale-300 bg-greyscale-100 px-2 py-1 text-right font-medium text-greyscale-600">
                  {rowNumber}
                </th>
                {columns.map((col) => {
                  const key = `${rowNumber}:${col}`;
                  if (covered.has(key)) return null;
                  const cell = row.getCell(col);
                  const merge = anchors.get(key);
                  return (
                    <td
                      key={col}
                      rowSpan={merge?.rowSpan}
                      colSpan={merge?.colSpan}
                      style={cellStyle(cell)}
                      className="max-w-96 overflow-hidden border-r border-b border-greyscale-200 px-2 py-1 text-ellipsis"
                    >
                      {cell.text}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

interface IXlsxViewerProps {
  data: ArrayBuffer;
  onError(): void;
}

export const XlsxViewer = (props: IXlsxViewerProps) => {
  const { data, onError } = props;
  const [workbook, setWorkbook] = useState<Workbook | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setWorkbook(null);
    setActive(0);
    import("exceljs")
      .then(async ({ default: ExcelJS }) => {
        const loaded = new ExcelJS.Workbook();
        await loaded.xlsx.load(data.slice(0));
        if (!cancelled) setWorkbook(loaded);
      })
      .catch(() => !cancelled && onError());
    return () => {
      cancelled = true;
    };
  }, [data, onError]);

  if (!workbook) return <Skeleton className="m-4 h-64 rounded-lg" />;

  const sheets = workbook.worksheets.filter((sheet) => sheet.state === "visible");
  const sheet = sheets[active] ?? sheets[0];

  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1 overflow-auto bg-greyscale-50">{sheet && <SheetTable key={sheet.id} sheet={sheet} />}</div>
      {sheets.length > 1 && (
        <div className="flex shrink-0 gap-1 overflow-x-auto border-t border-greyscale-300 bg-greyscale-100 px-2 py-1.5">
          {sheets.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(index)}
              className={twMerge(
                "shrink-0 rounded-md px-3 py-1 text-xs whitespace-nowrap",
                item === sheet ? "bg-white font-medium text-main-green-700 shadow-sm" : "text-greyscale-600 hover:bg-white/60",
              )}
            >
              {item.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
