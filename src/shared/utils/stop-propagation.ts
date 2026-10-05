import type { MouseEvent } from "react";

export const stop = (handler: () => void) => (event: MouseEvent) => {
  event.stopPropagation();
  handler();
};
