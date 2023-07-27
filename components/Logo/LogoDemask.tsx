import Icons from "@/public/icons/icon";
import Image from "next/image";
import Link from "next/link";
import { FunctionComponent } from "react";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

const LogoDeMask: React.FunctionComponent<LogoProps> = ({
  className,
  width,
  height,
}) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 94 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="94" height="24" fill="url(#pattern0)" />
  
    </svg>

    
  );
};

export default LogoDeMask;
