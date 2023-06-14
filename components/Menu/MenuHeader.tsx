import React, { useEffect, useRef } from "react";
import { ActiveLink} from '../Link'
import Link from "next/link";
import Tippy from "@tippyjs/react/headless";
import { useRouter } from "next/router";

interface MenuHeaderProps {}
const styles = {
  menuSub:"pt-1 pb-1 bg-white border text-sm rounded-lg shadow-xl box border-dark4 font-medium",
  itemSub:"flex items-center justify-between p-2 transition-all duration-100 ease-in rounded-lg cursor-pointer hover:bg-dark4 hover:text-secondary5 active:text-secondary3",
}
const data = [
  { id: 1, name: "Overview", url: "/overview" },
  { id: 2, name: "Trade", subTradeMenu: true },
  { id: 3, name: "Launchpad", url: "/launchpad" },
  { id: 4, name: "Category", subCateMenu: true },
  { id: 5, name: "Creator", url: "/creator" },
];

const subMenuTradeData = [
  { id: 1, name: "Swap", url: "/swap" },
  { id: 2, name: "Liquidity", url: "/liquidity" },
];
const subMenuCateData = [
  { id: 1, name: "Art", url: "/art" },
  { id: 2, name: "Gaming", url: "/gaming" },
  { id: 3, name: "Memberships", url: "/memberships" },
  { id: 4, name: "Music", url: "/music" },
  { id: 5, name: "Film", url: "/film" },
];
const MenuHeader: React.FC<MenuHeaderProps> = () => {
  const tradeRef = useRef<HTMLAnchorElement | null>(null);
  const router = useRouter();
  //change css when switch nav header
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
    <ul className="flex text-lg font-medium 3xl:gap-x-8 text-dark2 gap-x-4">
      {data.map((item) => (
        <React.Fragment key={item.id}>
          {item.subTradeMenu ? (
            <li>
              <Tippy
                interactive
                render={(attrs) => (
                  <div
                    className={styles.menuSub}
                    tabIndex={-1}
                    {...attrs}
                  >
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
                <button className="hover:text-secondary5 active:text-secondary3">
                  <Link ref={tradeRef} href="/swap">Trade</Link>
                </button>
              </Tippy>
            </li>
          ) : item.subCateMenu ? (
            <li >
              <Tippy
                interactive
                render={(attrs) => (
                  <div
                  className={styles.menuSub}
                    tabIndex={-1}
                    {...attrs}
                  >
                    <ul className="flex flex-col">
                      {subMenuCateData.map((cateItem) => (
                        <ActiveLink href={cateItem.url} key={cateItem.id}>
                          <li className={styles.itemSub}>{cateItem.name}</li>
                        </ActiveLink>
                      ))}
                    </ul>
                  </div>
                )}
              >
                <button className="hover:text-secondary5 active:text-secondary3">
                  <Link href="/category">Category</Link>
                </button>
              </Tippy>
            </li>
          ) : (
            <li className="relative hover:text-secondary5 active:text-secondary3">
              <ActiveLink href={item?.url as string}>
                <p>{item.name}</p>
              </ActiveLink>
            </li>
          )}
        </React.Fragment>
      ))}
    </ul>
  );
};

export default MenuHeader;
