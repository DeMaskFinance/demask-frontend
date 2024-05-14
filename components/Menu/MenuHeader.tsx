import AccountContext from "@/context/AccountContext";
import React, { useContext, useState } from "react";
import { ActiveLink } from "../Link";
import Search from "../Search/SearchHeader";
import { DiamondIcon } from "../Icons";
import Tippy from "@tippyjs/react/headless";
import Link from "next/link";
const style = {
  itemSub:
    "flex items-center p-2 transition-all duration-150 ease-in rounded-lg cursor-pointer hover:bg-dark5 text-dark2 font-semibold",
  btnWallet:
    "flex items-center 2xl:w-[184px] hover:border-dark2 dark:hover:bg-dark2 py-2 pl-2 lg:px-4 pr-2 dark:bg-dark1 justify-center text-sm font-medium transition duration-150 ease-out rounded-lg group hover:bg-dark4 bg-dark5 active:bg-dark3 text-dark2 dark:text-white gap-x-2 ",
};
interface MenuHeaderProps {}
const MenuHeader: React.FC<MenuHeaderProps> = () => {
  const [isFocused, setIsFocused] = useState(false);
  const { demask, chainId } = useContext(AccountContext);
  const data = [
    { id: 1, name: "Create", url: "/create" },
    { id: 2, name: "Launchpad", url: "/launchpad" },
    { id: 3, name: "Swap", url: `/swap` },
    { id: 4, name: "Pools", url: "/pools" },
    // { id: 5, name: "Leaderboard", url: "/leaderboard" },
  ];
  const handleFocus = () => {
    setIsFocused(true);
  };
  return (
    <div className="flex gap-x-8">
      <ul className="flex items-center text-lg font-medium 3xl:gap-x-8 gap-x-8">
        {data.map((item) => (
          <React.Fragment key={item.id}>
            <li className="relative text-base text-dark3 hover:text-dark2 active:text-dark1">
              <ActiveLink href={`${item?.url}?chain=${chainId}`}>
                <p className="">{item.name}</p>
              </ActiveLink>
            </li>
          </React.Fragment>
        ))}
        <Tippy
          className=""
          interactive
          render={(attrs) => (
            <div
              className="w-[180px] px-2 pt-1 pb-1 bg-white border text-sm rounded-lg shadow-xl box border-dark4 font-medium dark:bg-darkBG0 dark:border-none"
              tabIndex={-1}
              {...attrs}
            >
              <ul className="flex flex-col mt-2 font-normal gap-y-3">
                <Link
                  href={`/leaderboard?chain=${chainId}`}
                  className={`${style.itemSub} gap-x-2 group justify-between area_input_hover items-center active:bg-dark4
                  } `}
                >
                  Leaderboard
                </Link>
                <Link
                  href={`/referral?chain=${chainId}`}
                  className={`${style.itemSub} gap-x-2 group justify-between area_input_hover items-center active:bg-dark4
                  } `}
                >
                  Referral
                </Link>
              </ul>
            </div>
          )}
        >
          <li className="text-base text-dark3 hover:text-dark2 active:text-dark1 ">
            <Link
              href={`/leaderboard?chain=${chainId}`}
              className="flex items-center gap-x-1"
            >
              <DiamondIcon width={20} height={20} />
              Rewards
            </Link>
          </li>
        </Tippy>
      </ul>
      <Search isFocused={isFocused} handleFocus={handleFocus} />
    </div>
  );
};

export default MenuHeader;
