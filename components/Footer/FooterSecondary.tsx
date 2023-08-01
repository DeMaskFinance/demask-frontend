import Link from "next/link";
import React, { useState, useEffect } from "react";
import { LogoDemask } from "../Logo";
import { TeleIcon, TwitterIcon } from "../Icons";
import { TabGroups } from "../NavChoice";
import Image from "next/image";
import useSvgComponents from "../Picture/Picture";
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

  return (
    <footer className="lg:flex hidden items-center gap-x-8 h-[66px] lg:px-primary md:px-14 px-4 bg-dark4 fixed bottom-0 left-0 right-0 z-[100] overflow-hidden">
      <div className="mr-2">
        <Link href="/">
          <Image src={"/logoHeader.svg"} alt="" width={94} height={24}></Image>
        </Link>
      </div>
      <div className="flex gap-x-4">
        <Link href="/">
          <TwitterIcon
            width={24}
            height={24}
            className="fill-dark3 hover:fill-secondary5"
          />
        </Link>
        <Link href="/">
          <TeleIcon
            width={24}
            height={24}
            className="fill-dark3 hover:fill-secondary5"
          />
        </Link>
      </div>
      <div className="gap-4 items-center lg:flex md:flex hidden">
        <div>
          <p className="font-medium text-dark2">Gas price: $0.001</p>
        </div>
        <div className="flex text-base text-white bg-dark2 p-1 rounded-lg w-max items-center text-center">
          <div
            className={`py-1 cursor-pointer px-4 rounded-lg text-sm flex gap-2 items-center ${
              activeMode === "Light" ? "bg-secondary5" : ""
            }`}
            onClick={() => setAciveMode("Light")}
          >
            Light
            <svgComponents.buttonLight />
          </div>

          <div
            className={`py-1 cursor-pointer px-4 rounded-lg text-sm flex gap-2 items-center ${
              activeMode === "Dark" ? "bg-dark0" : ""
            }`}
            onClick={() => setAciveMode("Dark")}
          >
            Dark
            <svgComponents.buttonDark />
          </div>
        </div>
      </div>
      <div>
        <div className="flex text-base text-white bg-dark3 p-1 rounded-lg w-max items-center text-center">
          <button
            type="button"
            className={`${
              mode === "NEWFEEDS" ? "bg-secondary5" : ""
            } py-1 px-4 rounded-lg`}
            onClick={() => handleChoiceChange("NEWFEEDS")}
          >
            NEWFEEDS
          </button>

          <button
            type="button"
            className={`${
              mode === "REELS" ? "bg-secondary5" : "px-2"
            } py-1 px-4 rounded-lg`}
            onClick={() => handleChoiceChange("REELS")}
          >
            REELS
          </button>
        </div>
      </div>
    </footer>
  );
}
