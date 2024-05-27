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
  gradient?: boolean;
  isLoadingBtn?: boolean;
  green_2?: boolean;
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
  gradient,
  green_2,
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
          ? "bg-primary_500 text-white font-medium hover:bg-primary_400 border boder-white hover:border-primary_400 active:bg-primary_400 rounded-lg transition-all duration-150 ease-linear dark:bg-se dark:border-primary_500"
          : ""
      }
      ${third ? "bg-primary_400 text-white font-medium text-sm" : ""}
      ${
        active
          ? "bg-shader_500 px-3 py-2 text-white hover:bg-shader_600 dark:bg-shader_700 dark:border-shader_700 border border-shader_500 hover:border-shader_600 dark:hover:bg-shader_600"
          : ""
      }
      ${secondary ? "bg-white text-shader_500" : ""}
      ${
        outline
          ? " border border-shader_500 dark:border-shader_700 dark:text-white"
          : ""
      }
      ${
        green &&
        "bg-green hover:bg-white hover:text-green boder-green hover:border-green text-white transition-all duration-150 ease-linear border rounded-lg"
      }
      ${gradient && "bg_gradient text-white"}
      ${
        green_2 &&
        "bg-green text-white bg-opacity-[15%] py-2 px-3 hover:bg-opacity-[25%] border border-green w-max"
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
