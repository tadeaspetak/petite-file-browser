import { faReply } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useLocation } from "react-router-dom";

import { joinUrl } from "../../../utils";

export const RowBack: React.FC<{ browse: (url: string) => void }> = ({ browse }) => {
  const location = useLocation();

  return (
    <tr
      className="cursor-pointer hover:bg-gray-700 group"
      onClick={() => void browse(joinUrl("/", location.pathname, "../"))}
    >
      <td colSpan={3} className="p-3">
        <div className="flex items-center">
          <FontAwesomeIcon icon={faReply} className="mr-2" />
          <span className="flex-grow group-hover:underline">..</span>
        </div>
      </td>
    </tr>
  );
};
