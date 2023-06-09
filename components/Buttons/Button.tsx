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
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      type={type}
      className={`
      rounded-lg
      text-sm
      ${primary ? "bg-secondary5 text-white" : ""}
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
