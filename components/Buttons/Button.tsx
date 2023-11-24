import { FunctionComponent,MouseEventHandler } from "react";

interface ButtonProps {
  children: any;
  secondary?: boolean;
  fullWidth?: boolean;
  large?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  primary?:boolean;
  active?:boolean;
  outline?: boolean;
  className?: string;
  type?:"button" | "submit" | "reset" | undefined;
  third?:boolean
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
  third
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      type={type}
      className={`
      rounded-lg
      text-sm
      ${primary ? "bg-secondary2 text-white font-medium hover:bg-white hover:text-secondary5 border boder-white hover:border-secondary5 rounded-lg transition-all duration-150 ease-linear" : ""}
      ${third ? "bg-secondary5 text-white font-medium text-sm" : ""}
      ${active ? "bg-dark2 text-white" : ""}
      ${secondary ? "bg-white text-dark3" : ""}
      ${outline ? " border border-dark3 " : ""}
      ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;