import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { DiamondIcon, SeeMoreIcon, SwapIcon } from "../Icons";
import {
  CreateIcon,
  LaunchpadIcon,
  PoolIcon,
} from "../Icons/Mobile/IconMobile";

export default function NavFooter() {
  const [active, setActive] = useState<boolean>(false);
  const router = useRouter();
  const data = [
    { id: 3, name: "Swap", url: `/swap`, icon: SwapIcon },
    { id: 1, name: "Create", url: "/create", icon: CreateIcon },
    { id: 2, name: "Collections", url: "/collections", icon: LaunchpadIcon },
    { id: 4, name: "Pools", url: "/pools", icon: PoolIcon },
    { id: 5, name: "Rewards", url: `/leaderboard`, icon: DiamondIcon },
    {
      id: 6,
      name: "More",
      url: "https://docs.demask.finance/",
      icon: SeeMoreIcon,
    },
  ];
  return (
    <>
      <div
        onClick={() => {
          setActive(false);
        }}
        className={`bgshader_900 ${
          active ? "block" : "hidden"
        } opacity-40 fixed overflow-hidden lg:hidden top-0 right-0 left-0 bottom-0 w-full h-full z-20`}
      ></div>
      <footer className="fixed bottom-0 z-20 w-full bg-shader_900 lg:hidden">
        <ul className="border-t flex justify-between h-16 text-[10px] items-center border-shader_500">
          {data.map((item, index) => (
            <li
              className="flex items-center justify-center flex-1 h-full relative"
              key={index}
            >
              {router.pathname === item.url && (
                <div
                  className={`absolute transition-transform duration-100 ease-linear border-t-[3px] border-primary_500 h-full top-0 w-full`}
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(144, 117, 254, 0.15) 0%, rgba(144, 117, 254, 0.00) 100%)",
                  }}
                ></div>
              )}
              <Link
                href={`${item.url}`}
                className={`flex flex-col items-center gap-2 w-full h-full justify-center`}
              >
                {<item.icon width={20} height={20} className="text-white" />}
                <p className="text-white font-semibold">{item.name}</p>
              </Link>
            </li>
          ))}
        </ul>
      </footer>
    </>
  );
}
