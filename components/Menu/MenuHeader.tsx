import Tippy from "@tippyjs/react/headless";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { ActiveLink } from "../Link";
import Search from "../Search/SearchHeader";

interface MenuHeaderProps {}
const styles = {
  menuSub:
    "pt-1 pb-1 bg-white border text-base rounded-lg shadow-xl box border-dark4 font-medium",
  itemSub:
    "flex items-center justify-between text-base p-2 transition-all duration-100 ease-in rounded-lg cursor-pointer hover:bg-dark4 hover:text-secondary5 active:text-secondary3",
};
const data = [
  { id: 1, name: "Overview", url: "/overview" },
  { id: 2, name: "Trade", subTradeMenu: true },
  { id: 3, name: "Launchpad", url: "/launchpad" },
  { id: 4, name: "Category", subCateMenu: true },
  { id: 5, name: "Create", url: "/create" },
];

const subMenuTradeData = [
  {
    id: 1,
    name: "Swap",
    url: "/swap/0x519d124e4F2E536f36Ce9f54ADd6CD3022C16c70/MATIC/4544751815?dmlAddress=0xa88b1d7ed8e62A94C12693FcCBC41ccDcAA14bEC",
  },
  { id: 2, name: "Liquidity", url: "/liquidity" },
];
const subMenuCateData = [
  { id: 1, name: "Art", url: "/category/art" },
  { id: 2, name: "Gaming", url: "/category/gaming" },
  { id: 3, name: "Memberships", url: "/category/memberships" },
  { id: 4, name: "Music", url: "/category/music" },
  { id: 5, name: "Film", url: "/category/film" },
  { id: 6, name: "Others", url: "/category/others" },
];
const MenuHeader: React.FC<MenuHeaderProps> = () => {
  const tradeRef = useRef<HTMLAnchorElement | null>(null);
  const router = useRouter();
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  useEffect(() => {
    if (
      tradeRef.current &&
      (router.pathname === "/swap" || router.pathname === "/liquidity")
    ) {
      tradeRef.current?.classList.add("text-secondary1");
    } else {
      tradeRef.current?.classList.remove("text-secondary1");
    }
  }, [router.pathname]);
  return (
    <ul className="flex items-center text-lg font-medium 3xl:gap-x-12 text-dark2 gap-x-8">
      {data.map((item) => (
        <React.Fragment key={item.id}>
          {item.subTradeMenu ? (
            <li>
              <Tippy
                interactive
                render={(attrs) => (
                  <div className={styles.menuSub} tabIndex={-1} {...attrs}>
                    <ul className="flex flex-col">
                      {subMenuTradeData.map((tradeItem) => (
                        <Link href={tradeItem.url} key={tradeItem.id}>
                          <li className={styles.itemSub}>{tradeItem.name}</li>
                        </Link>
                      ))}
                    </ul>
                  </div>
                )}
              >
                <button className="hover:text-secondary5 flex active:text-secondary3">
                  <Link
                    className=" text-base"
                    ref={tradeRef}
                    href="/swap/0x519d124e4F2E536f36Ce9f54ADd6CD3022C16c70/MATIC/4544751815?dmlAddress=0xa88b1d7ed8e62A94C12693FcCBC41ccDcAA14bEC"
                  >
                    Trade
                  </Link>
                </button>
              </Tippy>
            </li>
          ) : item.subCateMenu ? (
            <li>
              <Tippy
                interactive
                render={(attrs) => (
                  <div className={styles.menuSub} tabIndex={-1} {...attrs}>
                    <ul className="flex flex-col text-base">
                      {subMenuCateData.map((cateItem) => (
                        <ActiveLink href={cateItem.url} key={cateItem.id}>
                          <li className={styles.itemSub}>{cateItem.name}</li>
                        </ActiveLink>
                      ))}
                    </ul>
                  </div>
                )}
              >
                <button className="hover:text-secondary5 flex active:text-secondary3 text-base">
                  <Link href="/category">Category</Link>
                </button>
              </Tippy>
            </li>
          ) : (
            <li className="relative hover:text-secondary5 active:text-secondary3 text-base">
              <ActiveLink href={item?.url as string}>
                <p>{item.name}</p>
              </ActiveLink>
            </li>
          )}
        </React.Fragment>
      ))}

      <Search isFocused={isFocused} handleFocus={handleFocus} />
    </ul>
  );
};

export default MenuHeader;
