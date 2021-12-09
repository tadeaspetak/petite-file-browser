import { faFile, faFolder } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useLocation, useSearchParams } from "react-router-dom";

import { BrowserItem } from "../../../common/types";
import { classNames, joinUrl, setOrDeleteParam } from "../../../utils";

export const Row: React.FC<{ browse: (value: string) => void; item: BrowserItem }> = ({
  browse,
  item,
}) => {
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const preview = (value: string) => void setParams(setOrDeleteParam(params, "preview", value));

  return (
    <tr
      className="cursor-pointer hover:bg-gray-700 group"
      onClick={() =>
        item.type === "dir"
          ? browse(joinUrl("/", location.pathname, item.name))
          : preview(item.name)
      }
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
};
