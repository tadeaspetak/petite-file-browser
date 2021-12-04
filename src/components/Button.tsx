import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Spinner } from "./Spinner";

type ButtonKind = "primary" | "secondary";

const colors: { [key in ButtonKind]: string } = {
  primary: "indigo",
  secondary: "blue",
};

export const Button: React.FC<{
  disabled?: boolean;
  hint?: string;
  icon?: IconProp;
  kind?: ButtonKind;
  label?: string;
  loading?: boolean;
  onClick?: () => void;
  size?: "sm" | "md";
  type?: "button" | "submit";
}> = ({
  disabled = false,
  hint,
  icon,
  kind = "secondary",
  label,
  loading = false,
  onClick = () => {},
  size,
  type = "button",
}) => {
  const isDisabled = disabled || loading;
  return (
    <button
      className={`
        text-white font-bold rounded relative
        ${size === "sm" ? "text-sm py-1 px-2" : "py-2 px-4"}
        ${
          isDisabled
            ? `bg-${colors[kind]}-300 cursor-not-allowed`
            : `bg-${colors[kind]}-500 hover:bg-${colors[kind]}-700`
        }
      `}
      disabled={isDisabled}
      onClick={onClick}
      type={type}
      title={hint}
    >
      {loading && (
        <span className="absolute left-0 right-0 top-1/2" style={{ transform: "translateY(-50%)" }}>
          <Spinner size={size === "sm" ? 4 : 6} stroke={2} />
        </span>
      )}
      <span className={`${loading ? "invisible" : ""}`}>
        {icon && <FontAwesomeIcon icon={icon} />}
        {label && label}
      </span>
    </button>
  );
};
