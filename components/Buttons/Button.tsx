import React, { FunctionComponent } from "react";
import { BiLoaderAlt } from "react-icons/bi";

interface ButtonProps {
  children: React.ReactNode;
  secondary?: boolean;
  fullWidth?: boolean;
  onClick?: any;
  large?: boolean;
  disabled?: boolean;
  primary?: boolean;
  active?: boolean;
  outline?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  third?: boolean;
  green?: boolean;
  isLoadingBtn?: boolean;
  gradient?: boolean;
  green_2?: boolean;
  red?: boolean;
  red_2?: boolean;
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
  type = "button",
  third,
  green,
  isLoadingBtn,
  gradient,
  green_2,
  red,
  red_2,
}) => {
  const buttonClassNames = `
    rounded-lg
    text-sm
    flex
    items-center
    justify-center
    transition-all duration-150 ease-linear
    font-semibold
    ${primary ? "bg-primary_500 text-white hover:bg-primary_600" : ""}
    ${third
      ? "bg-primary_500 bg-opacity-[0.15] text-white px-3 py-2 hover:bg-opacity-[0.25]"
      : ""
    }
    ${active && !isLoadingBtn
      ? "bg-shader_500 px-3 py-2 text-white hover:bg-shader_600 border border-shader_500 hover:border-shader_600"
      : ""
    }
    ${secondary ? "bg-blue bg-opacity-[0.15] text-white" : ""}
    ${outline ? "border border-shader_500" : ""}
    ${green ? "bg-green border-green hover:bg-opacity-80 text-white" : ""}
    ${red ? "bg-red border-red hover:bg-opacity-80 text-white" : ""}
    ${gradient ? "bg_gradient text-white hover:opacity-[0.85]" : ""}
    ${green_2
      ? "bg-green text-white bg-opacity-15 py-2 px-3 hover:bg-opacity-[25%] border border-green border-opacity-15"
      : ""
    }
    ${red_2
      ? "bg-red text-white bg-opacity-15 py-2 px-3 hover:bg-opacity-[25%] border border-red border-opacity-15"
      : ""
    }
    ${fullWidth ? "w-full" : ""}
    ${large ? "py-3 px-6 text-base" : "py-2 px-4 text-sm"}
    ${className || ""}
  `;

  return isLoadingBtn ? (
    <button
      className={`flex items-center justify-center rounded-lg bg-primary_500 ${className}`}
    >
      <BiLoaderAlt className="mr-2 text-base text-white animate-spin" />
      <p className="text-white">Fetching Quotes</p>
    </button>
  ) : (
    <button
      disabled={disabled}
      onClick={onClick}
      type={type}
      className={`${buttonClassNames}`}
    >
      {children}
    </button>
  );
};

export default Button;
