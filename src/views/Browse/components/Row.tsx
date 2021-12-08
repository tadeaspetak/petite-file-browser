import { faFile, faFolder } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback } from "react";

import { BrowserItem } from "../../../common/types";
import { classNames } from "../../../utils";

export const Row: React.FC<{
  browseRelative: (value: string) => void;
  item: BrowserItem;
  showPreview: (value: string) => void;
}> = ({ browseRelative, item, showPreview }) => {
  const onClick = useCallback(
    () => (item.type === "dir" ? browseRelative(item.name) : showPreview(item.name)),
    [browseRelative, item.name, item.type, showPreview],
  );

  return (
    <tr className="cursor-pointer hover:bg-gray-700 group" onClick={onClick}>
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
};