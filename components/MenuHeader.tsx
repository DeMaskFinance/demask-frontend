import React, { useEffect, useRef } from "react";
import { ActiveLink } from "./ActiveLink";
import Link from "next/link";
import Tippy from "@tippyjs/react/headless";
import { useRouter } from "next/router";

interface MenuHeaderProps {}
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
      tradeRef.current?.classList.add("active");
    } else {
      tradeRef.current?.classList.remove("active");
    }
  }, [router.pathname]);
  return (
    <ul className="flex text-lg 3xl:gap-x-8 text-base2 gap-x-4">
      {data.map((item) => (
        <React.Fragment key={item.id}>
          {item.subTradeMenu ? (
            <li>
              <Tippy
                interactive
                render={(attrs) => (
                  <div
                    className="bg-white shadow-xl box w-[150px] p-4"
                    tabIndex={-1}
                    {...attrs}
                  >
                    <ul className="flex flex-col gap-y-3">
                      {subMenuTradeData.map((tradeItem) => (
                        <ActiveLink href={tradeItem.url} key={tradeItem.id}>
                          <li>{tradeItem.name}</li>
                        </ActiveLink>
                      ))}
                    </ul>
                  </div>
                )}
              >
                <button>
                  <Link ref={tradeRef} href="/swap">Trade</Link>
                </button>
              </Tippy>
            </li>
          ) : item.subCateMenu ? (
            <li>
              <Tippy
                interactive
                render={(attrs) => (
                  <div
                    className="bg-white shadow-xl box w-[150px] p-4"
                    tabIndex={-1}
                    {...attrs}
                  >
                    <ul className="flex flex-col gap-y-3">
                      {subMenuCateData.map((cateItem) => (
                        <ActiveLink href={cateItem.url} key={cateItem.id}>
                          <li>{cateItem.name}</li>
                        </ActiveLink>
                      ))}
                    </ul>
                  </div>
                )}
              >
                <button>
                  <Link href="/category">Category</Link>
                </button>
              </Tippy>
            </li>
          ) : (
            <li>
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
