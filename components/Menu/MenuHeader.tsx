import AccountContext from "@/context/AccountContext";
import React, { useContext, useState } from "react";
import { ActiveLink } from "../Link";
import Search from "../Search/SearchHeader";
import { DiamondIcon } from "../Icons";
import Tippy from "@tippyjs/react/headless";
import Link from "next/link";
import { useRouter } from "next/router";

interface MenuHeaderProps {}
const MenuHeader: React.FC<MenuHeaderProps> = () => {
  const [isFocused, setIsFocused] = useState(false);
  const { chainId } = useContext(AccountContext);
  const router = useRouter();
  const data = [
    { id: 1, name: "Create", url: "/create" },
    { id: 2, name: "Launchpad", url: "/launchpad" },
    { id: 3, name: "Swap", url: `/swap` },
    { id: 4, name: "Pools", url: "/pools" },
    { id: 5, name: "Rewards", url: "/leaderboard", subRewardMenu: true },
  ];
  const subMenuRewardData = [
    { id: 1, name: "Leaderboard", url: "/leaderboard" },
    { id: 2, name: "Referral", url: "/referral" },
  ];
  const isMatchingUrl = subMenuRewardData.some((menu) =>
    router.pathname.startsWith(menu.url)
  );

  const handleFocus = () => {
    setIsFocused(true);
  };
  return (
    <div className="flex gap-x-8">
      <ul className="flex items-center font-semibold text-shader_100 3xl:gap-x-8 gap-x-8">
        {data.map((item) => (
          <React.Fragment key={item.id}>
            {item.subRewardMenu ? (
              <li>
                <Tippy
                  interactive
                  render={(attrs) => (
                    <div className="" tabIndex={-1} {...attrs}>
                      <ul className="w-40 menu">
                        {subMenuRewardData.map((item) => (
                          <ActiveLink href={item.url} key={item.id}>
                            <li
                              className={`py-2 pl-3 ${
                                router.asPath.startsWith(item.url)
                                  ? "bg-shader_500"
                                  : ""
                              }`}
                            >
                              {item.name}
                            </li>
                          </ActiveLink>
                        ))}
                      </ul>
                    </div>
                  )}
                >
                  <Link
                    href={`/leaderboard?chain=${chainId}`}
                    className={`flex items-center gap-x-1  ${
                      isMatchingUrl &&
                      "text-primary_400 hover:text-primary_400  active:text-primary_400"
                    }`}
                  >
                    <DiamondIcon width={32} height={32} />
                    {item.name}
                  </Link>
                </Tippy>
              </li>
            ) : (
              <React.Fragment key={item.id}>
                <li className="hover:text-primary_500">
                  <ActiveLink href={`${item?.url}?chain=${chainId}`}>
                    <p className="">{item.name}</p>
                  </ActiveLink>
                </li>
              </React.Fragment>
            )}
          </React.Fragment>
        ))}
      </ul>
      <Search
        isFocused={isFocused}
        handleFocus={handleFocus}
        setShowSearch={setIsFocused}
      />
    </div>
  );
};

export default MenuHeader;
