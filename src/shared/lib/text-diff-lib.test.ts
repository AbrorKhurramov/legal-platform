import { describe, expect, it } from "vitest";

import { diffLines, toSideBySide } from "./text-diff-lib";

describe("diffLines", () => {
  it("marks an edited clause as removed and added, keeping the rest", () => {
    const before = ["1. Predmet", "2. Foiz 24%", "3. Muddat"];
    const after = ["1. Predmet", "2. Foiz 22%", "3. Muddat", "4. Yangi band"];

    expect(diffLines(before, after)).toEqual([
      { operation: "same", text: "1. Predmet" },
      { operation: "removed", text: "2. Foiz 24%" },
      { operation: "added", text: "2. Foiz 22%" },
      { operation: "same", text: "3. Muddat" },
      { operation: "added", text: "4. Yangi band" },
    ]);
  });

  it("returns only same lines for identical texts", () => {
    expect(diffLines(["a", "b"], ["a", "b"])?.every((line) => line.operation === "same")).toBe(true);
  });

  it("gives up instead of freezing the tab on a huge rewrite", () => {
    const before = Array.from({ length: 3000 }, (_, index) => `old ${index}`);
    const after = Array.from({ length: 3000 }, (_, index) => `new ${index}`);
    expect(diffLines(before, after)).toBeNull();
  });
});

describe("toSideBySide", () => {
  it("pairs a replaced line with its replacement", () => {
    const rows = toSideBySide(diffLines(["a", "b", "c"], ["a", "x", "c"])!);
    expect(rows[1]).toEqual({ left: { operation: "removed", text: "b" }, right: { operation: "added", text: "x" } });
    expect(rows).toHaveLength(3);
  });
});
