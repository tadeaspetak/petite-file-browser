import React, { useCallback, useMemo } from "react";

type Position = "left" | "center" | "right";

export const ThreeWaySwitch: React.FC<{
  values: readonly [string, string, string];
  labels: [React.ReactElement, React.ReactElement, React.ReactElement];
  value: string;
  setValue: (value: string) => void;
}> = ({ labels, values, value = "center", setValue }) => {
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value),
    [setValue],
  );

  const position: Position = useMemo(
    () => (value === values[0] ? "left" : value === values[1] ? "center" : "right"),
    [value, values],
  );

  return (
    <div className="flex flex-col items-center three-way-switch">
      <label className="relative flex justify-center w-full cursor-pointer">
        <input
          className="absolute inset-0 block w-full h-full opacity-0 cursor-pointer"
          value={values[1]}
          type="radio"
          checked={position === "center"}
          onChange={onChange}
        />
        <span className="leading-none transition-opacity opacity-50">{labels[1]}</span>
      </label>
      <div className="relative z-10 flex items-center">
        <label className="relative flex items-center justify-end">
          <input
            checked={position === "left"}
            onChange={onChange}
            value={values[0]}
            type="radio"
            className="absolute inset-0 block w-full h-full opacity-0 cursor-pointer"
          />
          <span className="transition-opacity opacity-50 cursor-pointer">{labels[0]}</span>
        </label>
        <div className="relative">
          <div className="w-12 h-4 bg-gray-600 rounded-full shadow-inner"></div>
          <div
            className={`absolute top-0 w-4 h-4 transition-all duration-300 ease-in-out bg-white border-2 border-gray-800 rounded-full ${
              position === "left" ? "left-0" : position === "center" ? "left-4" : "left-8"
            }`}
          ></div>
        </div>
        <label className="relative flex items-center">
          <input
            value={values[2]}
            type="radio"
            onChange={onChange}
            checked={position === "right"}
            className="absolute inset-0 block w-full h-full opacity-0 cursor-pointer"
          />
          <span className="uppercase transition-opacity opacity-50 cursor-pointer">
            {labels[2]}
          </span>
        </label>
      </div>
    </div>
  );
};
