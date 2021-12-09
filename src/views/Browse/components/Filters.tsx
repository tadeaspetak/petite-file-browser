import { faFile, faFolder, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useMemo } from "react";

import { BrowserFile, BrowserItem } from "../../../common/types";
import { getHumanSize } from "../../../common/utils";
import { ThreeWaySwitch } from "../../../components";
import MultiRangeSlider from "../../../components/RangeSlider";
import { TypeFilterValue, typeFilterValues, useFilter } from "../providers";

export const Filters: React.FC<{ items: BrowserItem[] }> = ({ items }) => {
  const { nameFilter, setNameFilter, sizeFilter, setSizeFilter, typeFilter, setTypeFilter } =
    useFilter();

  // note: keep `useMemo` to avoid re-iterating over the array (which might get expensive)
  const sizeMinMax = useMemo(() => {
    const sizes = (items.filter((i) => i.type === "file") as BrowserFile[]).map((i) => i.sizeBytes);
    if (sizes.length < 2) return;
    return { min: Math.min(...sizes), max: Math.max(...sizes) };
  }, [items]);

  return (
    <div className="flex flex-col items-center justify-center w-full p-4 bg-gray-900 border-gray-900 rounded shadow-2xl sm:flex-row">
      {sizeMinMax && sizeFilter && (
        <div className="mb-2 sm:mb-0">
          <MultiRangeSlider
            values={{ a: sizeFilter.min, b: sizeFilter.max }}
            setValues={(a, b) => setSizeFilter({ min: a, max: b })}
            min={sizeMinMax.min}
            max={sizeMinMax.max}
            format={(v: number) => getHumanSize(v)}
          />
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:ml-auto">
        <label className="relative block mb-2 text-gray-400 sm:mr-4 focus-within:text-gray-600 sm:mb-0">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute w-8 h-8 transform -translate-y-1/2 pointer-events-none top-1/2 left-3"
          />
          <input
            type="text"
            placeholder="File name..."
            className="w-56 px-3 py-2 pl-10 text-sm text-gray-700 border rounded appearance-none focus:outline-none"
            onChange={(e) => setNameFilter(e.target.value)}
            value={nameFilter}
          />
        </label>
        <ThreeWaySwitch
          labels={[
            <FontAwesomeIcon icon={faFile} className="mr-1" />,
            <span className="text-xs leading-none uppercase">All</span>,
            <FontAwesomeIcon icon={faFolder} className="ml-1" />,
          ]}
          values={typeFilterValues}
          value={typeFilter ?? "all"}
          setValue={(a?: string) => setTypeFilter((a ?? "all") as TypeFilterValue)}
        />
      </div>
    </div>
  );
};
