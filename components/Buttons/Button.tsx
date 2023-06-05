import { FunctionComponent,MouseEventHandler } from "react";

interface ButtonProps {
  children: string;
  secondary?: boolean;
  fullWidth?: boolean;
  large?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  outline?: boolean;
  className?: string;
  type?:"button" | "submit" | "reset" | undefined;
}

const Button: FunctionComponent<ButtonProps> = ({
  children,
  secondary,
  fullWidth,
  onClick,
  large,
  disabled,
  outline,
  className,
  type,
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      type={type}
      className={`
      rounded-full
      text-sm
      ${secondary ? "bg-dark2" : "bg-base2"}
      ${secondary ? "text-dark" : "text-white"}
      ${outline ? "bg-transparent" : ""}
      ${outline ? "border-white" : ""}
      ${outline ? "text-white" : ""}
      ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
