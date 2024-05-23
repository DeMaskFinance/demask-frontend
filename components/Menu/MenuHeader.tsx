import AccountContext from "@/context/AccountContext";
import React, { useContext, useState } from "react";
import { ActiveLink } from "../Link";
import Search from "../Search/SearchHeader";
import { DiamondIcon } from "../Icons";
import Tippy from "@tippyjs/react/headless";
import Link from "next/link";
import { useRouter } from "next/router";
const styles = {
  itemNav: `flex 3xl:gap-x-8 text-dark2 text-lg gap-x-4 font-medium`,
  menuSub:
    "pt-1 pb-1 w-full bg-white border text-sm rounded-lg shadow-xl box border-dark4 font-medium area_input",
  itemSub:
    "flex area_input_hover items-center p-2 transition-all duration-150 ease-in rounded-lg cursor-pointer hover:bg-dark5 text-dark2 font-medium",
  btnWallet:
    "flex items-center 2xl:w-[184px] hover:border-dark2 dark:hover:bg-dark2 py-2 pl-2 lg:px-4 pr-2 dark:bg-dark1 justify-center text-sm font-medium transition duration-150 ease-out rounded-lg group hover:bg-dark4 bg-dark5 active:bg-dark3 text-dark2 dark:text-white gap-x-2 ",
  active:
    "text-secondary1 after:block after:absolute after:-bottom-[17px] after:left-0 after:w-full after:h-[2px] after:bg-secondary1",
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
      <ul className="flex items-center text-lg font-medium 3xl:gap-x-8 gap-x-8">
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
                                  ? "bg-dark4"
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
                  <button>
                    <Link href={`/leaderboard?chain=${chainId}`}>
                      <p
                        className={`flex items-center gap-x-1 text-base text-dark3 hover:text-dark2 active:text-dark1 ${
                          isMatchingUrl &&
                          "text-secondary5 hover:text-secondary5  active:text-secondary5"
                        }`}
                      >
                        <DiamondIcon width={20} height={20} />
                        Rewards
                      </p>
                    </Link>
                  </button>
                </Tippy>
              </li>
            ) : (
              <React.Fragment key={item.id}>
                <li className="relative text-base text-dark3 hover:text-dark2 active:text-dark1">
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
