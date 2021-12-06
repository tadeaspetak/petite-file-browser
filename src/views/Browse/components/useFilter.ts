import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { BrowserItem } from "../../../../common/types";
import { setOrDeleteParam } from "../../../utils";

export const useFilter = () => {
  const [params, setParams] = useSearchParams();

  const filter = useMemo(() => params.get("filter") ?? "", [params]);

  const applyFilters = useCallback(
    (items: BrowserItem[]) => items.filter((i) => i.name.includes(filter)),
    [filter],
  );

  const setFilter = useCallback(
    (search: string) => {
      setParams(setOrDeleteParam(params, "filter", search));
    },
    [setParams, params],
  );

  return {
    applyFilters,
    filter,
    setFilter,
  };
};
