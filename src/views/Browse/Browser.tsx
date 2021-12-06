import {
  faArrowsAltV,
  faFile,
  faFolder,
  faLongArrowAltDown,
  faLongArrowAltUp,
  faReply,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import { ApiBrowseRes } from "../../../common/types";
import { Checkbox, Spinner } from "../../components";
import { useSmartFetch } from "../../hooks";
import { classNames, joinUrl, setOrDeleteParam } from "../../utils";

type Sort = (column: SortingColumn) => void;
enum Direction {
  asc = "asc",
  desc = "desc",
}

type SortingColumn = "name" | "type" | "size";
interface Sorting {
  column: SortingColumn;
  direction: Direction;
}

const HeaderCell: React.FC<{
  className?: string;
  name: string;
  sort: Sort;
  sorting: Sorting | undefined;
}> = ({ children, className, name, sort, sorting }) => {
  const [icon, iconColor] = useMemo(() => {
    if (sorting && sorting.column === name) {
      return sorting.direction === Direction.asc
        ? [faLongArrowAltUp, "text-white"]
        : [faLongArrowAltDown, "text-white"];
    }
    return [faArrowsAltV, "text-gray-600"];
  }, [name, sorting]);
  return (
    <th
      className={`p-3 whitespace-nowrap cursor-pointer select-none ${className}`}
      onClick={() => {
        sort(name as SortingColumn);
      }}
    >
      <div className="flex items-center">
        {children}
        <span className={`ml-2 ${iconColor}`}>
          <FontAwesomeIcon icon={icon} />
        </span>
      </div>
    </th>
  );
};

export const Browser: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { smartFetch } = useSmartFetch();

  const [params, setParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [dirsFirst, setDirsFirst] = useState(true);

  const [contents, setContents] = useState<ApiBrowseRes | undefined>();

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const json: ApiBrowseRes = await smartFetch(
          `/api/browse?path=${location.pathname.replace(/^\/browse/, "")}`,
          {
            method: "GET",
          },
        );
        setContents(json);
        setIsLoading(false);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log("browse smart fetch", e);
      }
    })();
  }, [location.pathname, smartFetch]);

  const goTo = useCallback(
    (name: string) => {
      navigate(joinUrl("/", location.pathname, name));
    },
    [navigate, location.pathname],
  );

  const sorting: Sorting | undefined = useMemo(() => {
    const sortParam = params.get("sort");
    const hyphen = sortParam?.lastIndexOf("-") ?? -1;
    if (!sortParam || !hyphen) return undefined;

    const column = sortParam.substring(0, hyphen) as SortingColumn;
    const direction = Direction[sortParam.substring(hyphen + 1) as Direction];

    return column && direction ? { column, direction } : undefined;
  }, [params]);

  const filter = useMemo(() => params.get("filter") ?? "", [params]);

  const setFilter = useCallback(
    (search: string) => {
      setParams(setOrDeleteParam(params, "filter", search));
    },
    [setParams, params],
  );

  const setSorting = useCallback(
    (sorting: Sorting | undefined) => {
      if (sorting?.column === "type") setDirsFirst(false);
      setParams(
        setOrDeleteParam(
          params,
          "sort",
          sorting ? `${sorting.column}-${sorting.direction}` : undefined,
        ),
      );
    },
    [params, setParams],
  );

  const sort = useCallback(
    (column: SortingColumn) => {
      const next =
        !sorting || sorting.column !== column
          ? { column, direction: Direction.asc }
          : sorting.direction === Direction.asc
          ? { column, direction: Direction.desc }
          : undefined;
      setSorting(next);
    },
    [sorting, setSorting],
  );

  const items = useMemo(() => {
    let raw = [...(contents?.items ?? [])];

    if (filter) {
      raw = raw.filter((i) => i.name.includes(filter));
    }

    raw = raw.sort((a, b) => {
      if (dirsFirst) {
        if (a.type === "file" && b.type === "dir") return 1;
        if (a.type === "dir" && b.type === "file") return -1;
      }
      if (!sorting) return 0;

      const multiplier = sorting.direction === Direction.desc ? -1 : 1;
      const valA =
        sorting.column === "size" ? (a.type === "file" ? a.sizeBytes : 0) : a[sorting.column];
      const valB =
        sorting.column === "size" ? (b.type === "file" ? b.sizeBytes : 0) : b[sorting.column];
      if (valA < valB) return multiplier * -1;
      if (valA > valB) return multiplier * 1;
      return 0;
    });

    return raw;
  }, [contents, filter, sorting, dirsFirst]);

  return (
    <div className="w-full">
      <div className="flex justify-end">
        <label className="relative block text-gray-400 focus-within:text-gray-600">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute w-8 h-8 transform -translate-y-1/2 pointer-events-none top-1/2 left-3"
          />
          <input
            type="text"
            placeholder="File name..."
            className="w-48 px-3 py-2 pl-10 text-gray-700 border rounded appearance-none focus:outline-none"
            onChange={(e) => {
              setFilter(e.target.value);
            }}
            value={filter}
          />
        </label>
      </div>

      <div className="flex items-start mb-4">
        <Checkbox
          checked={dirsFirst}
          onChange={() => {
            if (sorting?.column === "type") setSorting(undefined);
            setDirsFirst(!dirsFirst);
          }}
        />
      </div>

      <div className="w-full">
        <table className="w-full mt-4 table-fixed">
          <thead className="text-sm font-semibold text-white bg-gray-700">
            <tr>
              <HeaderCell name="name" sort={sort} sorting={sorting} className="text-left">
                Name
              </HeaderCell>
              <HeaderCell name="size" sort={sort} sorting={sorting} className="w-16 text-left">
                Size
              </HeaderCell>
              <HeaderCell name="type" sort={sort} sorting={sorting} className="w-16 text-right">
                Type
              </HeaderCell>
            </tr>
          </thead>
          {isLoading && (
            <tbody>
              <tr>
                <td colSpan={3}>
                  <div className="flex py-4">
                    <Spinner className="w-12 text-white" />
                  </div>
                </td>
              </tr>
            </tbody>
          )}
          {!isLoading && contents && (
            <tbody className="divide-y divide-gray-700">
              {!contents.isRoot && (
                <tr
                  className="cursor-pointer hover:bg-gray-700 group"
                  onClick={() => {
                    goTo("../");
                  }}
                >
                  <td colSpan={3} className="p-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faReply} className="mr-2" />
                      <span className="flex-grow group-hover:underline">..</span>
                    </div>
                  </td>
                </tr>
              )}
              {items.map((item) => {
                return (
                  <tr
                    key={`${item.name}-${item.type}`}
                    className="cursor-pointer hover:bg-gray-700 group"
                    onClick={() => {
                      goTo(item.name);
                    }}
                  >
                    <td className="p-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <FontAwesomeIcon
                          icon={item.type === "file" ? faFile : faFolder}
                          className={classNames("mr-2", {
                            "text-blue-400": item.type === "dir",
                          })}
                        />
                        <span className="flex-grow group-hover:underline">{item.name}</span>
                      </div>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {item.type === "file" ? item.sizeHuman : ""}
                    </td>
                    <td className="p-3 text-right whitespace-nowrap">{item.type}</td>
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};
