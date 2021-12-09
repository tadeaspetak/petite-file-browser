import { ChangeEvent, FC, useCallback, useEffect, useRef } from "react";

const MultiRangeSlider: FC<{
  format?: (value: number) => string;
  values: { a: number; b: number };
  setValues: (a: number, b: number) => void;
  min: number;
  max: number;
}> = ({ format = (value) => value, min, max, values: { a, b }, setValues }) => {
  const aRef = useRef<HTMLInputElement>(null);
  const bRef = useRef<HTMLInputElement>(null);
  const range = useRef<HTMLDivElement>(null);

  // note: keep `useCallback`, used in the `useEffect`s below
  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max],
  );

  // Set width of the range to decrease from the left side
  useEffect(() => {
    if (bRef.current) {
      const aPercent = getPercent(a);
      const bPercet = getPercent(parseInt(bRef.current.value, 10));

      if (range.current) {
        range.current.style.left = `${aPercent}%`;
        range.current.style.width = `${bPercet - aPercent}%`;
      }
    }
  }, [a, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    if (aRef.current) {
      const minPercent = getPercent(parseInt(aRef.current.value, 10));
      const maxPercent = getPercent(b);

      if (range.current) range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [b, getPercent]);

  return (
    <div className="mt-2 range-slider">
      <input
        type="range"
        min={min}
        max={max}
        value={a}
        ref={aRef}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const value = Math.min(parseInt(event.target.value, 10), b - 1);
          setValues(value, b);
          event.target.value = value.toString();
        }}
        className={`appearance-none pointer-events-none absolute h-0 w-48 outline-none ${
          a > max - 100 ? "z-50" : "z-30"
        }`}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={b}
        ref={bRef}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const value = Math.max(parseInt(event.target.value, 10), a + 1);
          setValues(a, value);
          event.target.value = value.toString();
        }}
        className="absolute z-40 w-48 h-0 outline-none appearance-none pointer-events-none"
      />

      <div className="relative flex flex-col w-48">
        <div className="absolute z-10 w-full h-2 bg-gray-500 rounded"></div>
        <div ref={range} className="absolute z-20 h-2 bg-indigo-700 rounded"></div>
        <div className="flex justify-between mt-4 text-xs text-white">
          <span>{format(a)}</span>
          <span>{format(b)}</span>
        </div>
      </div>
    </div>
  );
};

export default MultiRangeSlider;
