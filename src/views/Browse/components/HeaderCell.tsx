import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowsAltV,
  faLongArrowAltDown,
  faLongArrowAltUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Sorting, SortingColumnName, useSort } from "../providers";

const pickColors = (name: string, sorting?: Sorting): [IconProp, string] => {
  if (sorting && sorting.column === name) {
    return sorting.direction === "asc"
      ? [faLongArrowAltUp, "text-white"]
      : [faLongArrowAltDown, "text-white"];
  }
  return [faArrowsAltV, "text-gray-600"];
};

export const HeaderCell: React.FC<{
  className?: string;
  name: SortingColumnName;
  sortable?: boolean;
}> = ({ children, className, name, sortable = true }) => {
  const { sortColumn, sorting } = useSort();
  const [icon, color] = pickColors(name, sorting);

  return (
    <th
      className={`p-3 select-none ${className} ${sortable && "cursor-pointer"}`}
      onClick={() => {
        if (sortable) sortColumn(name);
      }}
    >
      <div className="flex items-center">
        {children}
        {sortable && (
          <span className={`ml-2 ${color}`}>
            <FontAwesomeIcon icon={icon} />
          </span>
        )}
      </div>
    </th>
  );
};
