import { FunctionComponent, MouseEventHandler } from "react";
import { BiLoaderAlt } from "react-icons/bi";

interface ButtonProps {
  children: any;
  secondary?: boolean;
  fullWidth?: boolean;
  large?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  primary?: boolean;
  active?: boolean;
  outline?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset" | undefined;
  third?: boolean;
  green?: boolean;
  isLoadingBtn?: boolean;
}

const Button: FunctionComponent<ButtonProps> = ({
  children,
  secondary,
  fullWidth,
  onClick,
  large,
  disabled,
  primary,
  active,
  outline,
  className,
  type,
  third,
  green,
  isLoadingBtn,
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      type={type}
      className={`
      rounded-lg
      text-sm
      flex
      items-center
      justify-center
      ${
        primary
          ? "bg-secondary2 text-white font-medium hover:bg-secondary5 border boder-white hover:border-secondary5 active:bg-secondary4 rounded-lg transition-all duration-150 ease-linear dark:bg-se dark:border-secondary2"
          : ""
      }
      ${third ? "bg-secondary5 text-white font-medium text-sm" : ""}
      ${
        active
          ? "bg-dark3 px-3 py-2 text-white hover:bg-dark2 dark:bg-dark1 dark:border-dark1 border border-dark3 hover:border-dark2 dark:hover:bg-dark2"
          : ""
      }
      ${secondary ? "bg-white text-dark3" : ""}
      ${outline ? " border border-dark3 dark:border-dark1 dark:text-white" : ""}
      ${
        green &&
        "bg-green hover:bg-white hover:text-green boder-green hover:border-green text-white transition-all duration-150 ease-linear border rounded-lg"
      }
      ${className}
      `}
    >
      {children}
      {isLoadingBtn && <BiLoaderAlt className="ml-2 text-white animate-spin" />}
    </button>
  );
};

export default Button;
