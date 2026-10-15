export type DiffOperation = "same" | "added" | "removed";

export interface DiffLine {
  operation: DiffOperation;
  text: string;
}

export interface DiffRow {
  left: DiffLine | null;
  right: DiffLine | null;
}

/** Above this many cells of the LCS table the middle part is not compared line by line. */
const MAX_TABLE_CELLS = 6_000_000;

/**
 * Line diff by longest common subsequence. Equal head and tail are cut first, so two versions of
 * one contract with a few edited clauses compare in a small table.
 * Returns null when the changed middle is still too large to compare in the browser.
 */
export const diffLines = (before: string[], after: string[]): DiffLine[] | null => {
  let head = 0;
  while (head < before.length && head < after.length && before[head] === after[head]) head++;
  let tail = 0;
  while (tail < before.length - head && tail < after.length - head && before[before.length - 1 - tail] === after[after.length - 1 - tail]) tail++;

  const left = before.slice(head, before.length - tail);
  const right = after.slice(head, after.length - tail);
  const rows = left.length + 1;
  const columns = right.length + 1;
  if (rows * columns > MAX_TABLE_CELLS) return null;

  // lcs[i][j] = common length of left[i..] and right[j..]
  const lcs = new Uint32Array(rows * columns);
  for (let i = left.length - 1; i >= 0; i--) {
    for (let j = right.length - 1; j >= 0; j--) {
      lcs[i * columns + j] =
        left[i] === right[j] ? lcs[(i + 1) * columns + j + 1] + 1 : Math.max(lcs[(i + 1) * columns + j], lcs[i * columns + j + 1]);
    }
  }

  const middle: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] === right[j]) {
      middle.push({ operation: "same", text: left[i] });
      i++;
      j++;
    } else if (lcs[(i + 1) * columns + j] >= lcs[i * columns + j + 1]) {
      middle.push({ operation: "removed", text: left[i++] });
    } else {
      middle.push({ operation: "added", text: right[j++] });
    }
  }
  while (i < left.length) middle.push({ operation: "removed", text: left[i++] });
  while (j < right.length) middle.push({ operation: "added", text: right[j++] });

  const same = (text: string): DiffLine => ({ operation: "same", text });
  return [...before.slice(0, head).map(same), ...middle, ...after.slice(after.length - tail).map(same)];
};

/** Side-by-side rows: a removed block is paired with the added block that replaced it. */
export const toSideBySide = (lines: DiffLine[]): DiffRow[] => {
  const rows: DiffRow[] = [];
  let index = 0;
  while (index < lines.length) {
    const line = lines[index];
    if (line.operation === "same") {
      rows.push({ left: line, right: line });
      index++;
      continue;
    }
    const removed: DiffLine[] = [];
    const added: DiffLine[] = [];
    while (index < lines.length && lines[index].operation !== "same") {
      (lines[index].operation === "removed" ? removed : added).push(lines[index]);
      index++;
    }
    for (let k = 0; k < Math.max(removed.length, added.length); k++) rows.push({ left: removed[k] ?? null, right: added[k] ?? null });
  }
  return rows;
};
