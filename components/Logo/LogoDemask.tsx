import Icons from "@/public/icons/icon";
import Image from "next/image";
import Link from "next/link";
import { FunctionComponent } from "react";

interface LogoProps {
    
}
 
const LogoDeMask: FunctionComponent<LogoProps> = () => {
    return ( 
        <div className="text-center logo w-[142px] h-[24px]">
          <Link href="/">
            <Image
              src={Icons.logoDeMask}
              alt="logoDeMask"
              width={142}
              height={24}
            />
          </Link>
        </div>
     );
}
 
export default LogoDeMask;