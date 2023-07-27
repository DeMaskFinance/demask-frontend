import Link from "next/link";
import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Tippy from "@tippyjs/react/headless";
import "tippy.js/dist/tippy.css"; // optional
import { ActiveLink } from "@/components/Link";
import { ModalWallet } from "../Modal/ModalWallet";
import Image from "next/image";
import Icons from "@/public/icons/icon";
import { SearchHeader } from "../Search";
import { LogoDemask } from "../Logo";
import { MenuHeader } from "../Menu";
import { FaBars } from "react-icons/fa";
import {
  BscIcon,
  EtherIcon,
  PolygonIcon,
  ProfileIcon,
  SearchIcon,
} from "../Icons";
import { MdLogout } from "react-icons/md";
import AccountContext from "@/context/AccountContext";
import { getProvider } from "@/libs/connection/getProvider";
import MenuMobile from "../Menu/MenuMobile";
const style = {
  itemNav: `flex 3xl:gap-x-8 text-dark2 text-lg gap-x-4 font-medium`,
  menuSub:
    "pt-1 pb-1 w-full bg-white border text-sm rounded-lg shadow-xl box border-dark4 font-medium",
  itemSub:
    "flex items-center p-2 transition-all duration-100 ease-in rounded-lg cursor-pointer hover:bg-dark4 hover:text-secondary5 active:text-secondary3",
  btnWallet:
    "flex items-center justify-center py-1  pl-4 pr-2 text-sm font-medium transition duration-150 ease-out border rounded-lg group hover:bg-secondary5 active:bg-secondary3 text-secondary4 hover:text-white gap-x-2 border-secondary5",
};

export default function Header() {
  const headerRef = useRef<any>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { account, updateAccount, wallet } = useContext(AccountContext);
  const handleOpen = () => {
    document.body.style.overflowY = "hidden";
    setIsOpen(true);
  };

  const [openMenu, setOpenMenu] = useState(false);
  const disconnectWallet = () => {
    localStorage.removeItem("ACCOUNT_DEMASK");
    localStorage.removeItem("WALLET_DEMASK");
    updateAccount("");
  };
  const provider = getProvider(wallet);
  useEffect(() => {
    const getAddress = async () => {
      if (provider && provider.selectedAddress === null) {
        disconnectWallet();
      }
    };
    getAddress();
  }, [provider]);
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
      <MenuMobile
        account={account}
        style={style}
        disconnectWallet={disconnectWallet}
        handleOpen={handleOpen}
        openMenu={openMenu}
        setOpenMenu={setOpenMenu}
      />
      <header
        ref={headerRef}
        className="fixed top-0 left-0 gap-2 right-0 z-50 flex items-center justify-between transition-all duration-500 ease-in-out bg-white h-header lg:px-primary md:px-14 px-4"
      >
        <div className="flex items-center gap-2 flex-shrink-0">
          <div
            className="lg:hidden md:block block"
            onClick={() => {
              setOpenMenu(!openMenu);
            }}
          >
            <FaBars className="text-dark1" />
          </div>
          <div className="text-center">
            <Link href="/">
              {/* <LogoDemask width={94} height={24} /> */}
              <Image
                src={"/logoHeader.svg"}
                alt=""
                width={94}
                height={24}
              ></Image>
            </Link>
          </div>
          <div className="ml-8 lg:block  hidden">
            <MenuHeader />
          </div>
        </div>

        <div className="flex items-center justify-end gap-x-6 flex-shrink-0">
          <ul className={`${style.itemNav} lg:flex hidden`}>
            <li className="hover:text-secondary5 flex active:text-secondary3">
              <a
                href="https://docs.demask.finance/"
                target="_blank"
                className="text-base"
              >
                Docs
              </a>
            </li>
            <li className="relative hover:text-secondary5 active:text-secondary3">
              <ActiveLink href="/about">
                <p className="text-base">About</p>
              </ActiveLink>
            </li>
          </ul>
          <div className="flex lg:gap-x-6 md:gap-x-4 gap-2">
            {/* <div className="">
              <SearchIcon
                width={32}
                height={32}
                className="cursor-pointer h-full w-full active:fill-secondary3"
              />
            </div> */}
            <Tippy
              className=""
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
                    <li className={`${style.itemSub} gap-x-2 group`}>
                      <EtherIcon
                        width={24}
                        height={24}
                        className="fill-dark2 group-hover:fill-secondary4"
                      />
                      <p>Ethereum</p>
                    </li>
                    <li
                      className={`${style.itemSub} gap-x-2 group text-secondary3`}
                    >
                      <PolygonIcon
                        width={24}
                        height={24}
                        className="fill-secondary4"
                      />
                      <p>Polygon</p>
                    </li>
                    <li className={`${style.itemSub} gap-x-2 group`}>
                      <BscIcon
                        width={24}
                        height={24}
                        className=" group-hover:fill-secondary4"
                      />
                      <p>BNB Smart Chain</p>
                    </li>
                  </ul>
                </div>
              )}
            >
              <button className={`${style.btnWallet} lg:flex md:flex hidden`}>
                <p>Polygon</p>
                <PolygonIcon
                  width={24}
                  height={24}
                  className=" fill-secondary5 group-hover:fill-white"
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
                      <li className={`${style.itemSub}`}>Proflie</li>
                      <li
                        className={`${style.itemSub} justify-between`}
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
                  {`${account.slice(0, 2)}...${account.slice(-4)}`}
                  <ProfileIcon
                    width={24}
                    height={24}
                    className="group-hover:fill-white"
                  />
                </button>
              </Tippy>
            ) : (
              <button className={style.btnWallet} onClick={handleOpen}>
                <p>
                  CONNECT{" "}
                  <span className="lg:inline-block md:inline-block hidden">
                    WALLET
                  </span>
                </p>
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
      <div className="absolute z-[200]">
        <ModalWallet isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
    </>
  );
}
