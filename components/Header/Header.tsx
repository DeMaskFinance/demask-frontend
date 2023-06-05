import Link from "next/link";
import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import Tippy from "@tippyjs/react/headless";
import "tippy.js/dist/tippy.css"; // optional
import { ActiveLink} from "@/components/Link";
import { useRouter } from "next/router";
import { ModalWallet } from "../Modal";
import Image from "next/image";
import Icons from "@/public/icons/icon";
import { SearchHeader } from "../Search";
import { LogoDemask } from "../Logo";
import { MenuHeader } from "../Menu";
import LogoDeMask from "../Logo/LogoDemask";
const style = {
  itemNav: `flex 3xl:gap-x-8 text-base2 text-lg gap-x-4`,
};

export default function Header() {
  const headerRef = useRef<any>(null);
  //scroll header
  useEffect(() => {
    let prevScrollPos = window.scrollY;

    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isScrolledUp = prevScrollPos > currentScrollPos;
      if (headerRef.current) {
        const headerClassList = headerRef.current.classList;
        headerClassList.toggle("translate-y-0", isScrolledUp);
        headerClassList.toggle("translate-y-[-100%]", !isScrolledUp);
      }

      prevScrollPos = currentScrollPos;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between transition-all duration-500 ease-in-out bg-white h-header px-14 "
    >
      <div className="flex">
        <LogoDeMask/>
        <div className="ml-6 ">
          <MenuHeader />
        </div>
      </div>
      {/* Search */}
      <SearchHeader />
      <div className="flex items-center justify-end gap-x-6">
        <ul className={style.itemNav}>
          <li>
            <a href="https://docs.demask.finance/" target="_blank">Docs</a>
          </li>
          <li>
            <ActiveLink href="/about">
              <p>About</p>
            </ActiveLink>
          </li>
        </ul>
        <div className="flex gap-x-6">
          <Tippy
            interactive
            render={(attrs) => (
              <div
                className="bg-gray-500 box w-[150px] p-4"
                tabIndex={-1}
                {...attrs}
              >
                <ul className="flex flex-col gap-y-3">
                  <Link href="/swap">
                    <li>Ethereum</li>
                  </Link>
                  <Link href="/liquidity">
                    <li>Polygon</li>
                  </Link>
                  <Link href="/liquidity">
                    <li>Bsc</li>
                  </Link>
                </ul>
              </div>
            )}
          >
            <button className="w-[134px] h-8 bg-base2 text-sm font-semibold text-secondary4 rounded-full flex items-center justify-center gap-x-2">
              <p>Ethereum</p>
              <Image src={Icons.wind2} alt="chain" />
            </button>
          </Tippy>
          <button className="w-[172px] h-8 group bg-base2 hover:bg-white text-sm font-semibold text-secondary4 hover:text-base2 rounded-full flex items-center justify-center gap-x-2 border border-base2 transition duration-150 ease-out">
            <p>Connect wallet</p>
            <Image
              className="text-secondary4 group-hover:hidden"
              src={Icons.wallet}
              alt="wallet connect"
            />
            <Image
              className="hidden text-secondary4 group-hover:block"
              src={Icons.walletHover}
              alt="wallet connect hover"
            />
          </button>
        </div>
      </div>
      {/* <ModalWallet/> */}
    </header>
  );
}
