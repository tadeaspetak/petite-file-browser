import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { BrowserItem } from "../../../../common/types";
import { setOrDeleteParam } from "../../../utils";

export const columnNames = ["name", "type", "size"] as const;
export type SortingColumn = typeof columnNames[number];

const directionNames = ["asc", "desc"];
export type SortingDirection = typeof directionNames[number];

export interface Sorting {
  column: SortingColumn;
  direction: SortingDirection;
}
export type SortColumn = (column: SortingColumn) => void;

export const useSort = () => {
  const [params, setParams] = useSearchParams();

  const dirsFirst: boolean = useMemo(() => !!params.get("dirsFirst"), [params]);
  const setDirsFirstInternal = useCallback(
    (value: boolean) => {
      setParams(setOrDeleteParam(params, "dirsFirst", value ? "true" : undefined));
    },
    [params, setParams],
  );

  const sorting: Sorting | undefined = useMemo(() => {
    const sortParam = params.get("sort");
    const hyphenIndex = sortParam?.lastIndexOf("-") ?? -1;
    if (!sortParam || hyphenIndex === -1) return;

    const column = sortParam.substring(0, hyphenIndex) as SortingColumn;
    if (!columnNames.includes(column)) {
      console.error(`Invalid sorting column ${column}.`); // eslint-disable-line no-console
      // setParams(setOrDeleteParam(params, "sort"));
      return;
    }

    const direction = sortParam.substring(hyphenIndex + 1) as SortingDirection;
    if (!directionNames.includes(direction)) {
      console.error(`Invalid sorting direction ${direction}.`); // eslint-disable-line no-console
      // setParams(setOrDeleteParam(params, "sort"));
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
    (column: SortingColumn) => {
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

  return {
    applySorting,
    dirsFirst,
    setDirsFirst: useCallback(
      (value: boolean) => {
        if (sorting?.column === "type") setSorting(undefined);
        setDirsFirstInternal(value);
      },
      [setDirsFirstInternal, sorting, setSorting],
    ),
    setSorting,
    sortColumn,
    sorting,
  };
};
