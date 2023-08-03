import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import MenuOptions from "../Menu/MenuOptions";
const styles = {
  btnActive: "rounded-lg bg-secondary5 px-2",
};
export default function NavFooter({ reels }: any) {
  const [active, setActive] = useState<boolean>(false);
  const [menu, setMenu] = useState<string>("");
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

  const handleActiveMenu = (menuActive: string) => {
    setMenu(menuActive);
    setActive(true);
  };

  return (
    <>
      <div
        onClick={() => {
          setActive(false);
        }}
        className={`bg-dark ${
          active ? "block" : "hidden"
        } opacity-40 fixed overflow-hidden lg:hidden top-0 right-0 left-0 bottom-0 w-full h-full z-20`}
      ></div>
      <footer className="bg-white lg:hidden sticky bottom-0 z-20">
        <div>
          <ul className="border-t flex justify-between pt-4 pb-2 px-6 gap-4 text-[10px] items-center">
            <div>
              <li className="flex items-center justify-between mb-4">
                <Link
                  href="/overview"
                  className="flex items-center gap-2 flex-col"
                >
                  <Image
                    src={"/images/mobiles/overview.svg"}
                    width={24}
                    height={24}
                    alt=""
                  />
                  Overview
                </Link>
              </li>
            </div>

            <div
              className="group"
              onClick={() => {
                handleActiveMenu("trade");
              }}
            >
              <li className="flex items-center justify-between mb-4">
                <span className="flex items-center gap-2 flex-col">
                  <Image
                    src={"/images/mobiles/trade.svg"}
                    width={24}
                    height={24}
                    alt=""
                  />
                  Trade
                </span>
              </li>

              <ul
                className={`${menu === "trade" && active ? "block" : "hidden"}`}
              >
                <div className="pl-8 rounded-t-lg top-0 text-base flex -translate-y-[98px] transition-all py-4 bg-white border-t w-full right-0 flex-col absolute gap-4 border p-2">
                  <li>
                    <Link
                      href={
                        "/swap/0x519d124e4F2E536f36Ce9f54ADd6CD3022C16c70/MATIC/4544751815?dmlAddress=0xa88b1d7ed8e62A94C12693FcCBC41ccDcAA14bEC"
                      }
                    >
                      Swap
                    </Link>
                  </li>
                  <li className="pb-2">
                    <Link href={"/liquidity"}>Liquidity</Link>
                  </li>
                </div>
              </ul>
            </div>

            <div>
              <li className="flex items-center justify-between mb-4">
                <Link
                  href="/launchpad"
                  className="flex items-center gap-2 flex-col"
                >
                  <Image
                    src={"/images/mobiles/laudpad.svg"}
                    width={24}
                    height={24}
                    alt=""
                  />
                  Launchpad
                </Link>
              </li>
            </div>

            <div
              className="group"
              onClick={() => {
                handleActiveMenu("category");
              }}
            >
              <li className="flex items-center  justify-between mb-4">
                <Link
                  href="/category"
                  className="flex items-center gap-2 flex-col"
                >
                  <Image
                    src={"/images/mobiles/category.svg"}
                    width={24}
                    height={24}
                    alt=""
                  />
                  Category
                </Link>
              </li>
              <ul
                className={`${
                  menu === "category" && active ? "block" : "hidden"
                }`}
              >
                <div className="pl-8 rounded-t-lg top-0 text-base flex -translate-y-[210px] py-4 bg-white border-t w-full right-0 flex-col absolute gap-4 border p-2">
                  <li>
                    <Link href={"/category/art"}>Art</Link>
                  </li>
                  <li>
                    <Link href={"/category/gaming"}>Gaming</Link>
                  </li>
                  <li>
                    <Link href={"/category/memberships"}>Memberships</Link>
                  </li>
                  <li>
                    <Link href={"/category/music"}>Music</Link>
                  </li>
                  <li>
                    <Link href={"/category/others"}>Others</Link>
                  </li>
                </div>
              </ul>
            </div>
            <div>
              <li className="flex items-center justify-between mb-4">
                <Link
                  href="/create"
                  className="flex items-center gap-2 flex-col"
                >
                  <Image
                    src={"/images/mobiles/creator.svg"}
                    width={24}
                    height={24}
                    alt=""
                  />
                  Create
                </Link>
              </li>
            </div>

            <div
              className="group"
              onClick={() => {
                handleActiveMenu("options");
              }}
            >
              <li className="flex items-center justify-between mb-4">
                <span className="flex items-center gap-2 flex-col">
                  <Image
                    src={"/images/mobiles/solar.svg"}
                    width={24}
                    height={24}
                    alt=""
                  />
                </span>
              </li>

              <MenuOptions active={active} menu={menu} reels={reels} />
            </div>
          </ul>
        </div>
      </footer>
    </>
  );
}
