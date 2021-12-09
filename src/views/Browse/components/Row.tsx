import { faFile, faFolder } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

import { BrowserItem } from "../../../common/types";
import { classNames } from "../../../utils";

export const Row: React.FC<{
  browseRelative: (value: string) => void;
  item: BrowserItem;
  preview: (value: string) => void;
}> = React.memo(({ browseRelative, item, preview }) => {
  return (
    <tr
      className="cursor-pointer hover:bg-gray-700 group"
      onClick={() => (item.type === "dir" ? browseRelative(item.name) : preview(item.name))}
    >
      <td className="p-3">
        <div className="flex items-center">
          <FontAwesomeIcon
            icon={item.type === "file" ? faFile : faFolder}
            className={classNames("mr-2", { "text-blue-400": item.type === "dir" })}
          />
          <span className="flex-grow break-all group-hover:underline">{item.name}</span>
        </div>
      </td>
      <td className="p-3">{item.type === "file" ? item.sizeHuman : ""}</td>
      <td className="p-3 text-right">{item.type}</td>
    </tr>
  );
});
