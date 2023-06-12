import Link from "next/link";
import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import Tippy from "@tippyjs/react/headless";
import "tippy.js/dist/tippy.css"; // optional
import { ActiveLink } from "@/components/Link";
import { useRouter } from "next/router";
import { ModalWallet } from "../Modal";
import Image from "next/image";
import Icons from "@/public/icons/icon";
import { SearchHeader } from "../Search";
import { LogoDemask } from "../Logo";
import { MenuHeader } from "../Menu";
import LogoDeMask from "../Logo/LogoDemask";
import { BscIcon, EtherIcon, PolygonIcon, ProfileIcon } from "../Icons";
import { disconnectWalletTest } from "@/libs/connection/disconnectWallet";
import { MdLogout } from "react-icons/md";
import { useAccount } from "@/hooks/useAccount";
const style = {
  itemNav: `flex 3xl:gap-x-8 text-dark2 text-lg gap-x-4 font-medium`,
  menuSub:
    "pt-1 pb-1 w-full bg-white border text-sm rounded-lg shadow-xl box border-dark4 font-medium",
  itemSub:
    "flex items-center p-2 transition-all duration-100 ease-in rounded-lg cursor-pointer hover:bg-dark4 hover:text-secondary5 active:text-secondary3",
  btnWallet:
    "flex items-center justify-center h-10 pl-4 pr-2 text-sm font-medium transition duration-150 ease-out border rounded-lg group hover:bg-secondary5 active:bg-secondary3 text-secondary4 hover:text-white gap-x-2 border-secondary5",
};

export default function Header() {
  const headerRef = useRef<any>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [account, setAccount] = useState<any>();
  // const {isLocked,hanldeLock,hanldeAuto} = useBodyScrollLock();
  useEffect(() => {
    const value = localStorage.getItem("ACCOUNT");
    setAccount(value);
  });
  const startAddress = account?.slice(0, 2);
  const endAddress = account?.slice(-4);
  const formattedAddress = `${startAddress}...${endAddress}`;
  console.log(account);
  const handleOpen = () => {
    document.body.style.overflowY = "hidden";
    setIsOpen(true);
  };

  const disconnectWallet = () => {
    localStorage.removeItem("ACCOUNT");
    localStorage.removeItem("WALLET_DEMASK");
    setAccount("");
  };

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
        if (isScrolledUp) {
          headerClassList.add("border-b", "border-solid", "border-gray-300");
        } else {
          headerClassList.remove("border-b", "border-solid", "border-gray-300");
        }
        if (currentScrollPos === 0) {
          headerClassList.remove("border-b", "border-solid", "border-gray-300");
        }
      }

      prevScrollPos = currentScrollPos;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between transition-all duration-500 ease-in-out bg-white h-header px-14 "
      >
        <div className="flex">
          <div className="text-center logo w-[142px] h-[24px]">
            <Link href="/">
              <LogoDemask width={94} height={24} />
            </Link>
          </div>
          <div className="ml-6 ">
            <MenuHeader />
          </div>
        </div>
        {/* Search */}
        <SearchHeader />
        <div className="flex items-center justify-end gap-x-6">
          <ul className={style.itemNav}>
            <li className="hover:text-secondary5 active:text-secondary3">
              <a href="https://docs.demask.finance/" target="_blank">
                Docs
              </a>
            </li>
            <li className="hover:text-secondary5 active:text-secondary3">
              <ActiveLink href="/about">
                <p>About</p>
              </ActiveLink>
            </li>
          </ul>
          <div className="flex gap-x-6 ">
            <Tippy
              interactive
              render={(attrs) => (
                <div
                  className="w-[240px] pt-1 pb-1 bg-white border text-sm rounded-lg shadow-xl box border-dark4 font-medium"
                  tabIndex={-1}
                  {...attrs}
                >
                  <p className="p-2 text-base border-b-[1px] border-dark3">
                    Select a network
                  </p>
                  <ul className="flex flex-col font-normal gap-y-3">
                    <Link href="/swap">
                      <li className={`${style.itemSub} gap-x-2 group`}>
                        <EtherIcon
                          width={24}
                          height={24}
                          className="fill-dark2 group-hover:fill-secondary4"
                        />
                        <p>Ethereum</p>
                      </li>
                    </Link>
                    <Link href="/liquidity">
                      <li className={`${style.itemSub} gap-x-2 group`}>
                        <PolygonIcon
                          width={24}
                          height={24}
                          className="group-hover:fill-secondary4"
                        />
                        <p>Polygon</p>
                      </li>
                    </Link>
                    <Link href="/liquidity">
                      <li className={`${style.itemSub} gap-x-2 group`}>
                        <BscIcon
                          width={24}
                          height={24}
                          className=" group-hover:fill-secondary4"
                        />
                        <p>BNB Smart Chain</p>
                      </li>
                    </Link>
                  </ul>
                </div>
              )}
            >
              <button className={style.btnWallet}>
                <p>ETHEREUM</p>
                <EtherIcon
                  width={24}
                  height={24}
                  className="group-hover:fill-white"
                />
              </button>
            </Tippy>
            {account ? (
              <Tippy
                interactive
                render={(attrs) => (
                  <div
                    className="w-[200px] h-[100px] border rounded-lg shadow-xl box bg-white border-dark4 pb-1 pt-1"
                    tabIndex={-1}
                    {...attrs}
                  >
                    <ul>
                      <li
                        className="flex items-center justify-between px-4 py-2 transition-all duration-100 ease-in rounded-lg cursor-pointer hover:bg-dark4 hover:text-secondary5 active:text-secondary3"
                        onClick={disconnectWallet}
                      >
                        <div>Disconnect</div>
                        <MdLogout />
                      </li>
                    </ul>
                  </div>
                )}
              >
                <button className={style.btnWallet}>
                  {formattedAddress}
                  <ProfileIcon
                    width={24}
                    height={24}
                    className="group-hover:fill-white"
                  />
                </button>
              </Tippy>
            ) : (
              <button className={style.btnWallet} onClick={handleOpen}>
                <p>CONNECT WALLET</p>
                <Image
                  className="group-hover:hidden"
                  src={Icons.wallet}
                  alt="wallet connect"
                />
                <Image
                  className="hidden group-hover:block"
                  src={Icons.walletHover}
                  alt="wallet connect hover"
                />
              </button>
            )}
          </div>
        </div>
      </header>
      <div>
        <ModalWallet isOpen={isOpen} setIsOpen={setIsOpen}/>
      </div>
    </>
  );
}
