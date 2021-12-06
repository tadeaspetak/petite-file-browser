import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo } from "react";

import { classNames } from "../utils";
import { Spinner } from "./Spinner";

type ButtonKind = "primary" | "secondary" | "gray";

const colors: { [key in ButtonKind]: [string, string, string] } = {
  primary: ["bg-indigo-300", "bg-indigo-600", "bg-indigo-700"],
  secondary: ["bg-blue-300", "bg-blue-600", "bg-blue-700"],
  gray: ["bg-gray-300", "bg-gray-600", "bg-gray-700"],
};

interface ButtonProps {
  className?: string;
  disabled?: boolean;
  hint?: string;
  icon?: IconProp;
  kind?: ButtonKind;
  label?: string;
  loading?: boolean;
  onClick?: () => void;
  round?: boolean;
  size?: "sm" | "md";
  type?: "button" | "submit";
}

export const Button: React.FC<ButtonProps> = ({
  className = "",
  disabled = false,
  hint,
  icon,
  kind = "secondary",
  label,
  loading = false,
  onClick = () => {},
  round = false,
  size,
  type = "button",
}) => {
  const isDisabled = useMemo(() => disabled || loading, [disabled, loading]);
  const isSmall = useMemo(() => size === "sm", [size]);
  return (
    <button
      className={classNames(
        "text-white font-bold rounded relative",
        className,
        { "text-sm": isSmall },
        { [`rounded-full ${isSmall ? "w-6 h-6" : "w-10 h-10"}`]: round },
        { [`${isSmall ? "py-1 px-3" : "py-2 px-5"}`]: !round },
        { [`${colors[kind][0]} cursor-not-allowed`]: isDisabled },
        { [`${colors[kind][1]} hover:${colors[kind][2]}`]: !isDisabled },
      )}
      disabled={isDisabled}
      onClick={onClick}
      type={type}
      title={hint}
    >
      {loading && (
        <span className="absolute left-0 right-0 top-1/2" style={{ transform: "translateY(-50%)" }}>
          <Spinner className={`${isSmall ? "w-4" : "w-6"} text-black`} stroke={2} />
        </span>
      )}
      <span className={`${loading ? "invisible" : ""}`}>
        {icon && <FontAwesomeIcon icon={icon} />}
        {label && label}
      </span>
    </button>
  );
};
