export const Checkbox: React.FC<{ checked: boolean; label: string; onChange: () => void }> = ({
  checked,
  label,
  onChange,
}) => {
  return (
    <label className="flex p-2 text-white cursor-pointer">
      <div className="flex items-center justify-center w-6 h-6 p-1 mr-2 text-indigo-500 bg-white rounded shadow">
        <input type="checkbox" className="hidden" value="" onChange={onChange} />
        <svg
          className={`w-4 h-4 pointer-events-none text-purple ${checked ? "block" : "hidden"}`}
          viewBox="0 0 172 172"
        >
          <g
            fill="none"
            strokeWidth="none"
            strokeMiterlimit={10}
            fontFamily="none"
            fontWeight="none"
            fontSize="none"
            textAnchor="none"
            style={{ mixBlendMode: "normal" }}
          >
            <path d="M0 172V0h172v172z" />
            <path
              d="M145.433 37.933L64.5 118.8658 33.7337 88.0996l-10.134 10.1341L64.5 139.1341l91.067-91.067z"
              fill="currentColor"
              strokeWidth="1"
            />
          </g>
        </svg>
      </div>
      <span className="select-none">{label}</span>
    </label>
  );
};
