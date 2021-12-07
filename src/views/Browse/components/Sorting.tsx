import React from "react";

import { Checkbox } from "../../../components";
import { useSort } from "../providers";

export const Sorting: React.FC = () => {
  const { dirsFirst, setDirsFirst } = useSort();

  return (
    <div className="flex justify-end mb-4">
      <Checkbox checked={dirsFirst} label="Dirs first" onChange={() => setDirsFirst(!dirsFirst)} />
    </div>
  );
};
