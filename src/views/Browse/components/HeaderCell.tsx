import {
  faArrowsAltV,
  faLongArrowAltDown,
  faLongArrowAltUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo } from "react";

import { SortColumn, Sorting, SortingColumn } from "./useSort";

export const HeaderCell: React.FC<{
  className?: string;
  name: SortingColumn;
  sort: SortColumn;
  sorting: Sorting | undefined;
}> = ({ children, className, name, sort, sorting }) => {
  const [icon, iconColor] = useMemo(() => {
    if (sorting && sorting.column === name) {
      return sorting.direction === "asc"
        ? [faLongArrowAltUp, "text-white"]
        : [faLongArrowAltDown, "text-white"];
    }
    return [faArrowsAltV, "text-gray-600"];
  }, [name, sorting]);

  return (
    <th
      className={`p-3 whitespace-nowrap cursor-pointer select-none ${className}`}
      onClick={() => void sort(name)}
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
