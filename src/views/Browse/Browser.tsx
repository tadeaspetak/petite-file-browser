import { faFile, faFolder, faReply, faSearch, faSlidersH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { ApiBrowseRes } from "../../../common/types";
import { Button, Checkbox, Spinner, ThreeWaySwitch } from "../../components";
import { useSmartFetch } from "../../hooks";
import { classNames, joinUrl } from "../../utils";
import { HeaderCell, useFilter, useSort } from "./components";

export const Browser: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { filter, applyFilters, setFilter } = useFilter();
  const { sorting, dirsFirst, sortColumn, applySorting, setDirsFirst } = useSort();
  const { smartFetch } = useSmartFetch();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [contents, setContents] = useState<ApiBrowseRes | undefined>();

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const json: ApiBrowseRes = await smartFetch(
          `/api/browse?path=${location.pathname.replace(/^\/browse/, "")}`,
          { method: "GET" },
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
    (name: string) => navigate(joinUrl("/", location.pathname, name)),
    [navigate, location.pathname],
  );

  const items = useMemo(
    () => applySorting(applyFilters([...(contents?.items ?? [])])),
    [applyFilters, applySorting, contents],
  );

  return (
    <div className="w-full">
      <div className="flex items-stretch justify-end">
        <label className="relative block mr-2 text-gray-400 focus-within:text-gray-600">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute w-8 h-8 transform -translate-y-1/2 pointer-events-none top-1/2 left-3"
          />
          <input
            type="text"
            placeholder="File name..."
            className="w-56 px-3 py-2 pl-10 text-gray-700 border rounded appearance-none focus:outline-none"
            onChange={(e) => {
              setFilter(e.target.value);
            }}
            value={filter}
          />
        </label>
        {/* <Button
          icon={faSlidersH}
          kind="secondary"
          size="md"
          onClick={() => {
            setIsFilterOpen(true);
          }}
        /> */}
        <ThreeWaySwitch />
      </div>

      <div className="flex justify-end mb-8">
        <Checkbox
          checked={dirsFirst}
          label="Directories first"
          onChange={() => {
            setDirsFirst(!dirsFirst);
          }}
        />
      </div>

      <div className="w-full">
        <table className="w-full mt-4 table-fixed">
          <thead className="text-sm font-semibold text-white bg-gray-700">
            <tr>
              <HeaderCell name="name" sort={sortColumn} sorting={sorting} className="text-left">
                Name
              </HeaderCell>
              <HeaderCell
                name="size"
                sort={sortColumn}
                sorting={sorting}
                className="w-16 text-left"
              >
                Size
              </HeaderCell>
              <HeaderCell
                name="type"
                sort={sortColumn}
                sorting={sorting}
                className="w-16 text-right"
              >
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
                      // TODO: differentiate between files and directories
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
