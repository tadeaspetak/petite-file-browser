import { useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";

export const useDeferredParams = () => {
  const [params, setParams] = useSearchParams();
  const refParams = useRef<URLSearchParams>(params);

  // `useCallback` to keep the function stable across re-renders of the hook
  const getParams = useCallback(() => refParams.current, []);
  useEffect(() => {
    refParams.current = params;
  }, [params]);

  return { getParams, setParams };
};
