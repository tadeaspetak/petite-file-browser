import React, { ReactNode, useCallback, useContext, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { BrowserItem } from "../../../common/types";
import { setOrDeleteParam } from "../../../utils";

export const typeFilterValues = ["file", "all", "dir"] as const; // preserve the order, it's important for the ThreeWaySwitch component
export type TypeFilterValue = typeof typeFilterValues[number];

type FilterContextType = {
  nameFilter: string;
  setNameFilter: (search: string) => void;

  typeFilter?: TypeFilterValue;
  setTypeFilter: (type: TypeFilterValue) => void;

  sizeFilter?: { min: number; max: number };
  setSizeFilter: (values?: { min: number; max: number }) => void;

  applyFilters: (items: BrowserItem[]) => BrowserItem[];
};

export const FilterContext = React.createContext<FilterContextType>(null!);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [params, setParams] = useSearchParams();

  // note: keep `useMemo` to update only when URL params change, keeping `applyFilters` stable
  const nameFilter = useMemo(() => params.get("name") ?? "", [params]);
  const setNameFilter = (search: string) => setParams(setOrDeleteParam(params, "name", search));

  // note: keep `useMemo` to update only when URL params change, keeping `applyFilters` stable
  const sizeFilter = useMemo(() => {
    const sizeParam = params.get("size");
    if (!sizeParam) return;

    const sizes = sizeParam.split("-").map((v) => parseInt(v, 10));
    if (sizes.length !== 2 || sizes.find((v) => isNaN(v)) !== undefined) {
      console.log("invalid size filter"); // eslint-disable-line no-console
      return;
    }

    return { min: sizes[0], max: sizes[1] };
  }, [params]);
  const setSizeFilter = (values?: { min: number; max: number }) =>
    setParams(setOrDeleteParam(params, "size", values ? `${values.min}-${values.max}` : undefined));

  // note: keep `useMemo` to update only when URL params change, keeping `applyFilters` stable
  const typeFilter = useMemo(() => {
    const typeParam = params.get("type") as TypeFilterValue | undefined;
    if (!typeParam) return;

    if (!typeFilterValues.includes(typeParam)) {
      console.log(`Invalid type filter ${typeParam}`); // eslint-disable-line no-console
      return;
    }

    return typeParam === "all" ? undefined : typeParam;
  }, [params]);
  const setTypeFilter = (value?: TypeFilterValue) => {
    setParams(setOrDeleteParam(params, "type", value && value !== "all" ? value : undefined));
  };

  // note: keep `useCallback` so this can be used as a dependency to auto-apply filters when they change
  const applyFilters = useCallback(
    (items: BrowserItem[]) => {
      let next = items;
      if (nameFilter) next = next.filter((i) => i.name.includes(nameFilter));
      if (sizeFilter) {
        next = next.filter((i) =>
          i.type === "dir" ? true : i.sizeBytes >= sizeFilter.min && i.sizeBytes <= sizeFilter.max,
        );
      }
      if (typeFilter) next = next.filter((i) => i.type === typeFilter);
      return next;
    },
    [nameFilter, sizeFilter, typeFilter],
  );

  return (
    <FilterContext.Provider
      value={{
        nameFilter,
        setNameFilter,
        sizeFilter,
        setSizeFilter,
        typeFilter,
        setTypeFilter,
        applyFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export function useFilter() {
  return useContext(FilterContext);
}
