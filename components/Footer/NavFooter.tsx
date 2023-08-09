import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import MenuOptions from "../Menu/MenuOptions";
import { CategoryIcon, CreateIcon, LaunchpadIcon, OthersIcon, OverviewIcon, TradeIcon } from "../Icons/Mobile/IconMobile";
import { useRouter } from "next/router";
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
  const router = useRouter();
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
        className={`bg-dark ${active ? "block" : "hidden"
          } opacity-40 fixed overflow-hidden lg:hidden top-0 right-0 left-0 bottom-0 w-full h-full z-20`}
      ></div>
      <footer className="sticky bottom-0 z-20 bg-white lg:hidden">
        <div>
          <ul className="border-t flex justify-between pt-4 pb-2 px-6 gap-4 text-[10px] items-center">
            <div>
              <li className="flex items-center justify-between mb-4">
                <Link
                  href="/overview"
                  className={`flex flex-col items-center gap-2 ${router.pathname === "/overview" ? "text-secondary3" : ""}`}
                >
                  <OverviewIcon width={24} height={24} className={`fill-dark2 ${router.pathname === "/overview" ? "fill-secondary3" : ""}`} />
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
                <span className={`flex flex-col items-center gap-2 ${(router.pathname.startsWith("/swap") || router.pathname.startsWith("/add") || router.pathname.startsWith("/liquidity")) ? "text-secondary3" : ""}`}>
                  <TradeIcon width={24} height={24} className={`fill-dark2 ${(router.pathname.startsWith("/swap") || router.pathname.startsWith("/add") || router.pathname.startsWith("/liquidity")) ? "fill-secondary3" : ""}`} />
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
                        "/swap/0x519d124e4F2E536f36Ce9f54ADd6CD3022C16c70/MATIC/4544751815"
                      }
                      className="block w-full"
                    >
                      Swap
                    </Link>
                  </li>
                  <li className="pb-2">
                    <Link href={"/liquidity"} className="block w-full">Liquidity</Link>
                  </li>
                </div>
              </ul>
            </div>

            <div>
              <li className="flex items-center justify-between mb-4">
                <Link
                  href="/launchpad"
                  className={`flex flex-col items-center gap-2 ${router.pathname === "/launchpad" ? "text-secondary3" : ""}`}
                >
                  <LaunchpadIcon width={24} height={24} className={`fill-dark2 ${router.pathname === "/launchpad" ? "fill-secondary3" : ""}`} />
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
              <li className="flex items-center justify-between mb-4">
                <Link
                  href="/category"
                  className={`flex flex-col items-center gap-2 ${router.pathname.startsWith("/category") ? "text-secondary3" : ""}`}
                >
                  <CategoryIcon width={24} height={24} className={`fill-dark2 ${router.pathname.startsWith("/category") ? "fill-secondary3" : ""}`} />
                  Category
                </Link>
              </li>
              <ul
                className={`${menu === "category" && active ? "block" : "hidden"
                  }`}
              >
                <div className="pl-8 rounded-t-lg top-0 text-base flex -translate-y-[210px] py-4 bg-white border-t w-full right-0 flex-col absolute gap-4 border p-2">
                  <li>
                    <Link href={"/category/art"} className="block w-full">Art</Link>
                  </li>
                  <li>
                    <Link href={"/category/gaming"} className="block w-full">Gaming</Link>
                  </li>
                  <li>
                    <Link href={"/category/memberships"} className="block w-full">Memberships</Link>
                  </li>
                  <li>
                    <Link href={"/category/music"} className="block w-full">Music</Link>
                  </li>
                  <li>
                    <Link href={"/category/others"} className="block w-full">Others</Link>
                  </li>
                </div>
              </ul>
            </div>
            <div>
              <li className="flex items-center justify-between mb-4">
                <Link
                  href="/create"
                  className={`flex flex-col items-center gap-2 ${router.pathname === "/create" ? "text-secondary3" : ""}`}
                >
                  <CreateIcon width={24} height={24} className={`fill-dark2 ${router.pathname === "/create" ? "fill-secondary3" : ""}`} />
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
              <li className="flex items-center justify-between mb-4" >
                <span className={`fill-dark2 ${router.pathname === "/about" ? "fill-secondary3" : ""}`}>
                  <OthersIcon width={24} height={24} className={`fill-dark2 ${router.pathname === "/about" ? "fill-secondary3" : ""}`} />
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
