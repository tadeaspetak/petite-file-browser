import { useCallback } from "react";

export const ThreeWaySwitch: React.FC<{ state?: number }> = ({ state = 1 }) => {
  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    console.log({ changing: e.target.value });
  }, []);

  return (
    <div className="text-center">
      <div className="relative inline-block m-8 three-way-toggle" data-state="auto">
        <div className="relative z-10 flex items-center h-4">
          <label className="relative flex items-center justify-end w-16 h-6 pr-4">
            <input
              checked={state === 0}
              onChange={onChange}
              value={0}
              name="state-d"
              type="radio"
              className="absolute inset-0 block w-full h-full opacity-0 cursor-pointer"
            />
            <span className="uppercase transition-opacity opacity-50 cursor-pointer">Light</span>
          </label>
          <label className="relative w-6 h-6">
            <input
              value={1}
              name="state-d"
              type="radio"
              checked={state === 1}
              onChange={onChange}
              className="absolute inset-0 block w-full h-full opacity-0 cursor-pointer"
            />
            <span className="absolute block text-xs font-bold uppercase transition-opacity transform -translate-x-1/2 opacity-50 cursor-pointer -top-4 left-1/2">
              Auto
            </span>
          </label>
          <label className="relative flex items-center w-16 h-6 pl-4">
            <input
              value={2}
              name="state-d"
              type="radio"
              onChange={onChange}
              checked={state === 2}
              className="absolute inset-0 block w-full h-full opacity-0 cursor-pointer"
            />
            <span className="uppercase transition-opacity opacity-50 cursor-pointer">Dark</span>
          </label>
        </div>
        <div className="absolute top-0 transform -translate-x-1/2 left-1/2">
          <div className="w-12 h-4 bg-gray-600 rounded-full shadow-inner track"></div>
          <div className="absolute top-0 w-4 h-4 transition-all duration-300 ease-in-out bg-white border-2 border-gray-800 rounded-full thumb left-4"></div>
        </div>
      </div>
    </div>
  );
};
