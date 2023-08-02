import Link from "next/link";
import useSvgComponents from "../Picture/Picture";
import { useState, useEffect } from "react";
const styles = {
  btnActive: "rounded-lg bg-secondary5 px-2",
};

interface MenuOptionsProps {
  active: boolean;
  menu: string;
}

const MenuOptions: React.FC<MenuOptionsProps> = ({ active, menu }) => {
  const svgComponents = useSvgComponents();
  const [activeMode, setActiveMode] = useState<string>("Light");

  const handleModeChange = (choice: string) => {
    setActiveMode(choice);
  };

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

  const styles = {
    btnActive: "rounded-lg bg-secondary5 px-2",
  };
  return (
    <ul className={`${menu === "options" && active ? "block" : "hidden"}`}>
      <div className="pl-8 rounded-t-lg -top-[185px] text-base flex lg:hidden py-4 bg-white border-t w-full right-0 flex-col absolute gap-4 border p-2">
        <div className="flex gap-4 items-end text-base">
          <li className="flex items-center justify-between mb-4">
            <Link
              href="https://docs.demask.finance/"
              className="flex items-center gap-2"
            >
              Docs
            </Link>
          </li>
        </div>
        <div>
          <li className="flex items-center justify-between mb-4">
            <Link href="/about" className="flex items-center gap-2">
              About
            </Link>
          </li>
        </div>

        <div className="flex text-base text-white bg-dark3 p-1 rounded-lg w-max items-center text-center">
          <div
            className={`py-1 cursor-pointer px-4 rounded-lg text-sm flex gap-2 items-center ${
              activeMode === "Light" ? "bg-secondary5" : ""
            }`}
            onClick={() => handleModeChange("Light")}
          >
            Light
            <svgComponents.buttonLight />
          </div>

          <div
            className={`py-2 cursor-pointer px-6 rounded-lg text-sm flex items-center gap-2 ${
              activeChoice === "Dark" ? "bg-dark0" : ""
            }`}
            onClick={() => handleChoiceChange("Dark")}
          >
            Dark
            <svgComponents.buttonDark />
          </div>
          <div className="w-fit border-l pl-8">
            <div className="flex h-[34px] rounded-lg w-auto text-sm bg-dark1 text-white">
              <button
                type="button"
                className={mode === "NEWFEEDS" ? styles.btnActive : "px-2"}
                onClick={() => handleChoiceChange("NEWFEEDS")}
              >
                NEWFEEDS
              </button>
              <button
                type="button"
                className={mode === "REELS" ? styles.btnActive : "px-2"}
                onClick={() => handleChoiceChange("REELS")}
              >
                REELS
              </button>
            </div>
          </div>
        </div>
      </div>
    </ul>
  );
};

export default MenuOptions;
