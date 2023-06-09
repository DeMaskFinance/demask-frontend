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
import { EtherIcon, ProfileIcon } from "../Icons";
import { useAccount } from "@/hooks/useAccount";
import { disconnectWallet } from "@/libs/connection/disconnectWallet";
import Web3Modal from "web3modal";
import { MdLogout } from "react-icons/md";
import Web3 from "web3";
const style = {
  itemNav: `flex 3xl:gap-x-8 text-dark2 text-lg gap-x-4 font-medium`,
  btnWallet:
    "flex items-center justify-center h-10 pl-4 pr-2 text-sm font-medium transition duration-150 ease-out border rounded-lg group hover:bg-secondary5 active:bg-secondary3 text-secondary4 hover:text-white gap-x-2 border-secondary5",
};

export default function Header() {
  const headerRef = useRef<any>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isConnect, setIsConnect] = useState<boolean>(false);
  const { account, disconnect } = useAccount();
  const startAddress = account?.slice(0, 2);
  const endAddress = account?.slice(-4);
  const formattedAddress = `${startAddress}...${endAddress}`;
  console.log(account);
  const handleOpen = () => {
    setIsOpen(true);
  };
  const disconnectWallet = async () => {
    await disconnect();
  };
  console.log(account);
  const isLoggedIn = account !== null;

  console.log(isLoggedIn);
  
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
          <LogoDeMask />
          <div className="ml-6 ">
            <MenuHeader />
          </div>
        </div>
        {/* Search */}
        <SearchHeader />
        <div className="flex items-center justify-end gap-x-6">
          <ul className={style.itemNav}>
            <li>
              <a href="https://docs.demask.finance/" target="_blank">
                Docs
              </a>
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
              <button className={style.btnWallet}>
                <p>ETHEREUM</p>
                <EtherIcon
                  width="24px"
                  height="24px"
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
                        className="flex items-center justify-between px-4 py-2 transition-all duration-100 ease-in rounded-lg cursor-pointer hover:bg-dark3 hover:text-white"
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
                    width="24px"
                    height="24px"
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
        <ModalWallet isOpen={isOpen} setIsOpen={setIsOpen} account={account} />
      </div>
    </>
  );
}
