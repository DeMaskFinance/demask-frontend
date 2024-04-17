import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import {
  CreateIcon,
  LaunchpadIcon,
  OthersIcon,
  OverviewIcon,
  TradeIcon,
} from "../Icons/Mobile/IconMobile";
import { RankIcon } from "../Icons";
import AccountContext from "@/context/AccountContext";

export default function NavFooter() {
  const [active, setActive] = useState<boolean>(false);
  const [mode, setMode] = useState<string>("");
  const [activeChoice, setActiveChoice] = useState<string>(mode);
  const { chainId } = useContext(AccountContext);
  useEffect(() => {
    setMode(localStorage.getItem("MODE_DEMASK") || "NEWFEEDS");
  }, [activeChoice]);
  const router = useRouter();
  const data = [
    { id: 1, name: "Mint", url: "/mint", icon: OverviewIcon },
    { id: 2, name: "Launchpad", url: "/launchpad", icon: LaunchpadIcon },
    { id: 3, name: "Swap", url: `/swap`, icon: CreateIcon },
    { id: 4, name: "Pools", url: "/pools", icon: TradeIcon },
    { id: 5, name: "Leaderboard", url: `/leaderboard`, icon: RankIcon },
    {
      id: 6,
      name: "Docs",
      url: "https://docs.demask.finance/",
      icon: OthersIcon,
    },
  ];
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
      <footer className="fixed bottom-0 z-20 w-full bg-white lg:hidden">
        <div>
          <ul className="border-t flex justify-between pt-4 pb-2 px-4 gap-4 text-[10px] items-center">
            {data.map((item, index) => (
              <li
                className="flex items-center justify-between mb-4"
                key={index}
              >
                <Link
                  href={`${item.url}?chain=${chainId}`}
                  className={`flex flex-col items-center gap-2 ${
                    router.pathname === "/overview" ? "text-secondary3" : ""
                  }`}
                >
                  {
                    <item.icon
                      width={24}
                      height={24}
                      className={`fill-dark2 ${
                        router.asPath.includes(item.url.split("?")[0])
                          ? "fill-secondary3"
                          : ""
                      }`}
                    />
                  }
                  <p
                    className={`${
                      router.asPath.includes(item.url.split("?")[0])
                        ? "text-secondary3"
                        : ""
                    }`}
                  >
                    {item.name}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </>
  );
}
