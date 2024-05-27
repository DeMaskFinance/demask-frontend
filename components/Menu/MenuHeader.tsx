import AccountContext from "@/context/AccountContext";
import React, { useContext, useState } from "react";
import { ActiveLink } from "../Link";
import Search from "../Search/SearchHeader";
import { DiamondIcon } from "../Icons";
import Tippy from "@tippyjs/react/headless";
import Link from "next/link";
import { useRouter } from "next/router";
const styles = {
  itemNav: `flex 3xl:gap-x-8 text-shader_600 text-lg gap-x-4 font-medium`,
  menuSub:
    "pt-1 pb-1 w-full bg-white border text-sm rounded-lg shadow-xl box border-shader_500 font-medium bg-shader_700 border-shader_700",
  itemSub:
    "flex items-center p-2 transition-all duration-150 ease-in rounded-lg cursor-pointer hover:bg-shader_600 text-shader_600 font-medium",
  active:
    "text-primary_500 after:block after:absolute after:-bottom-[17px] after:left-0 after:w-full after:h-[2px] after:bg-primary_500",
};
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
    { id: 5, name: "Leaderboard", url: "/leaderboard", subCateMenu: true },
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
            {item.subCateMenu ? (
              <li>
                <Tippy
                  interactive
                  render={(attrs) => (
                    <div className={styles.menuSub} tabIndex={-1} {...attrs}>
                      <ul className="flex flex-col px-2 w-[170px] gap-y-2">
                        {subMenuRewardData.map((cateItem) => (
                          <ActiveLink href={cateItem.url} key={cateItem.id}>
                            <li
                              className={`${styles.itemSub} ${
                                router.asPath.startsWith(cateItem.url)
                                  ? "bg-shader_500"
                                  : ""
                              }`}
                            >
                              {cateItem.name}
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
                    Rewards
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
