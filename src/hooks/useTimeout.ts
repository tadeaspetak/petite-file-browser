import { useEffect, useLayoutEffect, useRef } from "react";

export function useTimeout(callback: () => void, delay?: number) {
  const savedCallback = useRef(callback);

  useLayoutEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (typeof delay === "undefined") return;
    const id = setTimeout(() => savedCallback.current(), delay);
    return () => clearTimeout(id);
  }, [delay]);
}
