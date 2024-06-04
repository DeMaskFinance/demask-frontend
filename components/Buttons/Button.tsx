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
  red?: boolean;
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
  red,
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
      transition-all duration-150 ease-linear
      font-semibold
      ${
        primary
          ? "bg-primary_500 text-white  hover:bg-primary_600 rounded-lg"
          : ""
      }
      ${third && "bg-primary_500 bg-opacity-[0.15] text-white px-3 py-2"}
      ${
        active &&
        "bg-shader_500 px-3 py-2 text-white hover:bg-shader_600 border border-shader_500 hover:border-shader_600"
      }
      ${secondary ? "bg-white text-shader_500" : ""}
      ${outline ? " border border-shader_500  " : ""}
      ${
        green &&
        "bg-green border-green hover:bg-opacity-80 text-white  border rounded-lg"
      }
      ${
        red &&
        "bg-red border-red hover:bg-opacity-80 text-white  border rounded-lg"
      }
      ${gradient && "bg_gradient text-white "}
      ${
        green_2 &&
        "bg-green text-white bg-opacity-[15%] py-2 px-3 hover:bg-opacity-[25%] border border-green w-max"
      }
      ${isLoadingBtn && "opacity-[0.35]"}
      ${className}
      `}
    >
      {isLoadingBtn ? (
        <div className="flex items-center justify-center px-8 py-3 rounded-lg bg-primary_500">
          <BiLoaderAlt className="mr-2 text-base text-white animate-spin" />
          <p>Fetching Quotes</p>
        </div>
      ) : (
        <>{children}</>
      )}
    </button>
  );
};

export default Button;
