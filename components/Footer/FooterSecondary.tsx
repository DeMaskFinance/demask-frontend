import Link from "next/link";
import React, { useState, useEffect } from "react";
import { TeleIcon, TwitterIcon } from "../Icons";
import { TabGroups } from "../NavChoice";
import Image from "next/image";
import useSvgComponents from "../Picture/Picture";
import { LogoDeMask } from "../Logo/Logo";
import { MdOutlineKeyboardDoubleArrowUp } from "react-icons/md";
const styles = {
  btnActive: "rounded-lg bg-secondary5 px-2",
};
export default function FooterSecondary() {
  const [mode, setMode] = useState<string>("");
  const [activeChoice, setActiveChoice] = useState<string>(mode);
  useEffect(() => {
    setMode(localStorage.getItem("MODE_DEMASK") || "NEWFEEDS");
  }, [activeChoice]);
  const handleChoiceChange = (choice: string) => {
    localStorage.setItem("MODE_DEMASK", choice);
    window.dispatchEvent(new Event("storage"));
    setActiveChoice(choice);
  };

  const svgComponents = useSvgComponents();

  const [activeMode, setAciveMode] = useState<string>("Light");
  const [showFooter, setShowFooter] = useState(true);
  return (
    <>
      <button
        onClick={() => setShowFooter(!showFooter)}
        className="bg-secondary5 mr-14 fixed bottom-0 right-4 z-[110] lg:block hidden px-6 py-1 rounded-t-lg text-white"
      // onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <MdOutlineKeyboardDoubleArrowUp
          className={`${showFooter ? "rotate-180" : ""} transition-all`}
        />
      </button>

      <footer
        className={`${!showFooter ? "translate-y-[100%]" : "translate-y-[0]"
          } lg:flex hidden transition-all items-center gap-x-8 h-[66px] lg:px-primary md:px-14 sticky px-4 bg-dark4 bottom-0 left-0 right-0 z-[100] overflow-hidden`}
      >
        <div className="mr-2">
          <Link href="/">
            <LogoDeMask width={94} height={24} />
          </Link>
        </div>
        <div className="flex gap-x-4">
          <a
            href="https://twitter.com/DemaskFinance"
            rel="noreferrer noopener"
            target="_blank"
          >
            <TwitterIcon
              width={24}
              height={24}
              className="fill-dark3 hover:fill-secondary5"
            />
          </a>
          <a
            href="https://web.telegram.org/k/#@DemaskFinance"
            rel="noreferrer noopener"
            target="_blank"
          >
            <TeleIcon
              width={24}
              height={24}
              className="fill-dark3 hover:fill-secondary5"
            />
          </a>
        </div>
        <div className="items-center hidden gap-4 lg:flex md:flex">
          <div>
            <p className="font-medium text-dark2">Gas price: $0.001</p>
          </div>
          <div className="flex items-center p-1 text-base text-center text-white rounded-lg bg-dark2 w-max">
            <div
              className={`py-1 cursor-pointer px-2 rounded-lg text-sm flex gap-2 items-center ${activeMode === "Light" ? "bg-secondary5" : ""
                }`}
              onClick={() => setAciveMode("Light")}
            >
              <svgComponents.buttonLight />
            </div>

            <div
              className={`py-1 cursor-pointer px-2 rounded-lg text-sm flex gap-2 items-center ${activeMode === "Dark" ? "bg-dark0" : ""
                }`}
              onClick={() => setAciveMode("Dark")}
            >
              <svgComponents.buttonDark />
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center p-1 text-base text-center text-white rounded-lg bg-dark3 w-max">
            <button
              type="button"
              className={`${mode === "NEWFEEDS" ? "bg-secondary5" : ""
                } py-1 px-4 rounded-lg`}
              onClick={() => handleChoiceChange("NEWFEEDS")}
            >
              NEWFEEDS
            </button>

            <button
              type="button"
              className={`${mode === "REELS" ? "bg-secondary5" : "px-2"
                } py-1 px-4 rounded-lg`}
              onClick={() => handleChoiceChange("REELS")}
            >
              REELS
            </button>
          </div>
        </div>
      </footer>
    </>
  );
}
