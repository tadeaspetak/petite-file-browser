import React, { ReactNode, useContext } from "react";
import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { BrowserItem } from "../../../common/types";
import { setOrDeleteParam } from "../../../utils";

export const sortingColumnNames = ["name", "type", "size"] as const;
export type SortingColumnName = typeof sortingColumnNames[number];

const sortingDirectionNames = ["asc", "desc"];
export type SortingDirectionName = typeof sortingDirectionNames[number];

export interface Sorting {
  column: SortingColumnName;
  direction: SortingDirectionName;
}

export type SortColumn = (column: SortingColumnName) => void;

type SortContextType = {
  dirsFirst: boolean;
  setDirsFirst: (value: boolean) => void;

  sorting?: Sorting;
  sortColumn: (column: SortingColumnName) => void;
  setSorting: (sorting?: Sorting) => void;

  applySorting: (items: BrowserItem[]) => BrowserItem[];
};

export const SortContext = React.createContext<SortContextType>(null!);

export const SortProvider = ({ children }: { children: ReactNode }) => {
  const [params, setParams] = useSearchParams();

  const dirsFirst: boolean = useMemo(() => !!params.get("dirs"), [params]);
  const setDirsFirstInternal = useCallback(
    (value: boolean) => setParams(setOrDeleteParam(params, "dirs", value ? "true" : undefined)),
    [params, setParams],
  );

  const sorting: Sorting | undefined = useMemo(() => {
    const sortParam = params.get("sort");
    const hyphenIndex = sortParam?.lastIndexOf("-") ?? -1;
    if (!sortParam || hyphenIndex === -1) return;

    const column = sortParam.substring(0, hyphenIndex) as SortingColumnName;
    if (!sortingColumnNames.includes(column)) {
      console.error(`Invalid sorting column ${column}.`); // eslint-disable-line no-console
      return;
    }

    const direction = sortParam.substring(hyphenIndex + 1) as SortingDirectionName;
    if (!sortingDirectionNames.includes(direction)) {
      console.error(`Invalid sorting direction ${direction}.`); // eslint-disable-line no-console
      return;
    }

    return column && direction ? { column, direction } : undefined;
  }, [params]);

  const setSorting = useCallback(
    (sorting: Sorting | undefined) => {
      if (sorting?.column === "type") setDirsFirstInternal(false);
      setParams(
        setOrDeleteParam(
          params,
          "sort",
          sorting ? `${sorting.column}-${sorting.direction}` : undefined,
        ),
      );
    },
    [params, setParams, setDirsFirstInternal],
  );

  const sortColumn = useCallback(
    (column: SortingColumnName) => {
      const next =
        !sorting || sorting.column !== column
          ? { column, direction: "asc" }
          : sorting.direction === "asc"
          ? { column, direction: "desc" }
          : undefined;
      setSorting(next);
    },
    [sorting, setSorting],
  );

  const setDirsFirst = useCallback(
    (value: boolean) => {
      if (sorting?.column === "type") setSorting(undefined);
      setDirsFirstInternal(value);
    },
    [setDirsFirstInternal, sorting, setSorting],
  );

  const applySorting = useCallback(
    (items: BrowserItem[]) =>
      items.sort((a, b) => {
        if (dirsFirst) {
          if (a.type === "dir" && b.type === "file") return -1;
          if (a.type === "file" && b.type === "dir") return 1;
        }
        if (!sorting) return 0;

        const multiplier = sorting.direction === "desc" ? -1 : 1;
        const valA =
          sorting.column === "size" ? (a.type === "file" ? a.sizeBytes : 0) : a[sorting.column];
        const valB =
          sorting.column === "size" ? (b.type === "file" ? b.sizeBytes : 0) : b[sorting.column];
        if (valA < valB) return multiplier * -1;
        if (valA > valB) return multiplier * 1;
        return 0;
      }),
    [sorting, dirsFirst],
  );

  return (
    <SortContext.Provider
      value={{
        applySorting,
        dirsFirst,
        setDirsFirst,
        setSorting,
        sortColumn,
        sorting,
      }}
    >
      {children}
    </SortContext.Provider>
  );
};

export function useSort() {
  return useContext(SortContext);
}
