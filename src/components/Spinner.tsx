export const Spinner: React.FC<{
  className?: string;
  stroke?: number;
}> = ({ className = "", stroke = 1 }) => {
  return (
    <svg
      className={`mx-auto animate-spin ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="-2 -2 28 28"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="12"
        stroke="currentColor"
        strokeWidth={stroke}
      ></circle>
      <path
        className="opacity-75"
        fill="none"
        strokeWidth="1"
        stroke="currentColor"
        d="M 0 12 a 12 12 0 0 0 19 9.745"
      ></path>
    </svg>
  );
};
