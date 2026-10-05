import { useEffect, useState } from "react";

const DEFAULT_DELAY = 400;

export const useDebounce = <T>(value: T, delay = DEFAULT_DELAY) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};
