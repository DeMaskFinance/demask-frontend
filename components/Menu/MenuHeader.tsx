import AccountContext from "@/context/AccountContext";
import React, { useContext, useState } from "react";
import { ActiveLink } from "../Link";
import Search from "../Search/SearchHeader";
import { DiamondIcon } from "../Icons";
import Tippy from "@tippyjs/react/headless";
import Link from "next/link";
import { useRouter } from "next/router";

const subMenuRewards = [
  { id: 1, name: "Leaderboard", url: "/leaderboard" },
  { id: 2, name: "Referral", url: "/referral" },
];
const subMenuOthers = [
  { id: 1, name: "Create", url: "/create" },
  { id: 2, name: "Category", url: "/category" },
  // { id: 2, name: "Category", url: "/category" },
];
const MenuHeader = () => {
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const data = [
    { name: "Explore", url: "/explore" },
    { name: "Trade", url: `/trade` },
    // { name: "Launchpad", url: "/launchpad" },
    { name: "Pools", url: "/pools" },
    {
      name: "Rewards",
      url: "/leaderboard",
      subMenu: subMenuRewards,
      icon: <DiamondIcon width={32} height={32} />,
    },
    { name: "Others", url: "/category", subMenu: subMenuOthers },
  ];

  const isMatchingUrl = subMenuRewards.some((menu) =>
    router.pathname.startsWith(menu.url)
  );

  const handleFocus = () => {
    setIsFocused(true);
  };
  return (
    <div className="flex gap-x-8">
      <ul className="flex items-center font-semibold text-shader_100 3xl:gap-x-8 gap-x-8">
        {data.map((item, index) => (
          <React.Fragment key={index}>
            {item.subMenu ? (
              <li>
                <Tippy
                  interactive
                  render={(attrs) => (
                    <div className="" tabIndex={-1} {...attrs}>
                      <ul className="w-40 menu">
                        {item.subMenu.map((item) => (
                          <ActiveLink href={item.url} key={item.id}>
                            <li
                              className={`item_menu ${
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
                    href={`${item.url}`}
                    className={`flex items-center gap-x-1  ${
                      isMatchingUrl &&
                      "text-primary_400 hover:text-primary_400  active:text-primary_400"
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                </Tippy>
              </li>
            ) : (
              <React.Fragment key={index}>
                <li className="hover:text-primary_500">
                  <ActiveLink href={`${item?.url}`}>
                    <p className="">{item.name}</p>
                  </ActiveLink>
                </li>
              </React.Fragment>
            )}
          </React.Fragment>
        ))}
      </ul>
      <Search handleFocus={handleFocus} />
    </div>
  );
};

export default MenuHeader;
