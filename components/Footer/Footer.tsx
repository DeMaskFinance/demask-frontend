import { version } from "@/libs/constants";
import Link from "next/link";
import { useContext, useState } from "react";
import { Button } from "../Buttons";
import { EmailIcon } from "../Icons";
import { LogoDeMask } from "../Logo/Logo";
import useSvgComponents from "../Picture/Picture";
import AccountContext from "@/context/AccountContext";
export default function Footer() {
  const svgComponents = useSvgComponents();
  const { demask} = useContext(AccountContext);
  const [activeChoice, setActiveChoice] = useState<string>("Light");

  const handleChoiceChange = (choice: string) => {
    setActiveChoice(choice);
  };
  return (
    <footer className="justify-between hidden items-center px-4 pt-8 pb-10 overflow-hidden lg:flex lg:px-[156px] md:px-14 bg-dark4">
      <div>
        <div className="flex gap-x-[120px]">
          <ul className="flex font-semibold gap-x-8 text-dark2">
            <li>
              <Link href={`/swap/${demask.CREATOR}/${demask.NATIVE_ADDRESS}/${demask.IDNFT}`} className="text-dark1">About</Link>
            </li>
            <li className="transition-all duration-100 hover:text-secondary5">
              <a
                href="https://github.com/DeMaskFinance/demask_brand/tree/master"
                rel="noreferrer noopener"
                target="_blank"
              >
                Brand
              </a>
            </li>
            <li className="transition-all duration-100 hover:text-secondary5">
              <a
                href="https://cryptoviet.info/he-sinh-thai-cryptoviet/demask"
                rel="noreferrer noopener"
                target="_blank"
              >
                Blog
              </a>
            </li>
          </ul>
          <ul className="flex font-semibold gap-x-8 text-dark2">
            <li>
              <Link href={`/swap/${demask.CREATOR}/${demask.NATIVE_ADDRESS}/${demask.IDNFT}`} className="text-dark1">Developer</Link>
            </li>
            <li className="transition-all duration-100 hover:text-secondary5">
              <a
                href="https://github.com/DeMaskFinance"
                rel="noreferrer noopener"
                target="_blank"
              >
                Github
              </a>
            </li>
            <li className="transition-all duration-100 hover:text-secondary5">
              <a
                href=" https://docs.demask.finance/"
                rel="noreferrer noopener"
                target="_blank"
              >
                Documentation
              </a>
            </li>
          </ul>
        </div>
        <div className="flex items-center mt-8 gap-x-8">
          <div className="flex items-center p-1 text-base text-center text-white rounded-lg bg-dark3 w-max">
            <div
              className={`p-2 cursor-pointer rounded-lg text-sm flex gap-2 items-center ${activeChoice === "Light" ? "bg-secondary5" : ""
                }`}
              onClick={() => handleChoiceChange("Light")}
            >
              <svgComponents.buttonLight />
            </div>

            <div
              className={`p-2 cursor-pointer rounded-lg text-sm flex items-center gap-2 ${activeChoice === "Dark" ? "bg-dark0" : ""
                }`}
              onClick={() => handleChoiceChange("Dark")}
            >
              <svgComponents.buttonDark />
            </div>
          </div>
          <a href="mailto:contact@demask.finance">
            <Button third className="flex items-center px-6 py-2 transition-all duration-200 ease-in-out border hover:border-secondary5 gap-x-1 hover:bg-white hover:text-secondary5 group">
              <span>Contact Us</span>
              <span>
                <EmailIcon width={24} height={24} className="group-hover:fill-secondary5" />
              </span>
            </Button>
          </a>
        </div>
      </div>
      <div>
        <Link href={`/swap/${demask.CREATOR}/${demask.NATIVE_ADDRESS}/${demask.IDNFT}`}>
          <LogoDeMask width={245}
            height={56} />
        </Link>
        <p className="text-xs font-semibold text-dark3">{version}</p>
      </div>
    </footer>
  );
}