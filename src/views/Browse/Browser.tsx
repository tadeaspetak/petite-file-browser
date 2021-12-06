import { faFile, faFolder, faReply, faSort } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import { ApiBrowseRes } from "../../../common/types";
import { Spinner } from "../../components";
import { classNames, joinUrl } from "../../utils";

type Sort = (column: string) => void;
enum Direction {
  up = "up",
  down = "down",
}

interface Sorting {
  column: string;
  direction: Direction;
}

const HeaderCell: React.FC<{
  className?: string;
  name: string;
  sort: Sort;
  sorting: Sorting | undefined;
}> = ({ children, className, name, sort, sorting }) => {
  return (
    <th
      className={`p-3 whitespace-nowrap ${className}`}
      onClick={() => {
        sort(name);
      }}
    >
      {children}
      <span
        className={`ml-1 ${
          sorting && sorting.column === name && sorting.direction === Direction.up
            ? "active"
            : "inactive"
        }`}
      >
        <FontAwesomeIcon icon={faSort} />
      </span>
    </th>
  );
};

const setOrDelete = (params: URLSearchParams, name: string, value: string | undefined) => {
  if (value) {
    params.set(name, value);
  } else {
    params.delete(name);
  }
  return params;
};

export const Browser: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const [contents, setContents] = useState<ApiBrowseRes | undefined>();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const response = await fetch(
        `/api/browse?path=${location.pathname.replace(/^\/browse/, "")}`,
        {
          method: "GET",
          headers: { "content-type": "application/json" },
        },
      );
      const json: ApiBrowseRes = await response.json();
      setContents(json);
      setIsLoading(false);
    })();
  }, [location.pathname]);

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

    const column = sortParam.substring(0, hyphen);
    const direction = Direction[sortParam.substring(hyphen + 1) as Direction];

    return column && direction ? { column, direction } : undefined;
  }, [params]);

  //   const filtering = useMemo(() => params.get("filter") ?? "", [params]);

  //   const filter = useCallback(
  //     (search: string) => {
  //       setParams(setOrDelete(params, "filter", search));
  //     },
  //     [setParams, params],
  //   );

  const sort = useCallback(
    (column: string) => {
      const next =
        !sorting || sorting.column !== column
          ? { column, direction: Direction.up }
          : sorting.direction === Direction.up
          ? { column, direction: Direction.down }
          : undefined;
      setParams(setOrDelete(params, "sort", next ? `${next.column}-${next.direction}` : undefined));
    },
    [setParams, sorting, params],
  );

  return (
    <div>
      {/* <input
        type="text"
        onChange={(e) => {
          filter(e.target.value);
        }}
        value={filtering}
      /> */}

      <div className="w-full p-3">
        <table className="w-full mt-4 table-auto">
          <thead className="text-xs font-semibold text-white uppercase bg-gray-700 shadow-lg">
            <tr>
              <HeaderCell name="name" sort={sort} sorting={sorting} className="text-left">
                Name
              </HeaderCell>
              <HeaderCell name="size" sort={sort} sorting={sorting} className="text-left">
                Size
              </HeaderCell>
              <HeaderCell name="type" sort={sort} sorting={sorting} className="text-right">
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
                  <td colSpan={3} className="items-center p-3 whitespace-nowrap">
                    <div className="flex">
                      <FontAwesomeIcon icon={faReply} className="mr-2" />
                      <span className="flex-grow group-hover:underline">..</span>
                    </div>
                  </td>
                </tr>
              )}
              {contents.items?.map((item) => {
                return (
                  <tr
                    key={`${item.name}-${item.type}`}
                    className="cursor-pointer hover:bg-gray-700 group"
                    onClick={() => {
                      goTo(item.name);
                    }}
                  >
                    <td className="items-center p-3 whitespace-nowrap">
                      <div className="flex">
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
