import {
  faArrowsAltV,
  faLongArrowAltDown,
  faLongArrowAltUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useMemo } from "react";

import { SortingColumnName, useSort } from "../providers";

export const HeaderCell: React.FC<{
  className?: string;
  name: SortingColumnName;
  sortable?: boolean;
}> = ({ children, className, name, sortable = true }) => {
  const { sortColumn, sorting } = useSort();

  const [icon, iconColor] = useMemo(() => {
    if (sorting && sorting.column === name) {
      return sorting.direction === "asc"
        ? [faLongArrowAltUp, "text-white"]
        : [faLongArrowAltDown, "text-white"];
    }
    return [faArrowsAltV, "text-gray-600"];
  }, [name, sorting]);

  const sort = useCallback(() => {
    if (sortable) sortColumn(name);
  }, [name, sortable, sortColumn]);

  return (
    <th className={`p-3 select-none ${className} ${sortable && "cursor-pointer"}`} onClick={sort}>
      <div className="flex items-center">
        {children}
        {sortable && (
          <span className={`ml-2 ${iconColor}`}>
            <FontAwesomeIcon icon={icon} />
          </span>
        )}
      </div>
    </th>
  );
};
