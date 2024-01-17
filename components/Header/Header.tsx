import { ActiveLink } from "@/components/Link";
import AccountContext from "@/context/AccountContext";
import { getProvider } from "@/libs/connection/getProvider";
import Icons from "@/public/icons/icon";
import Tippy from "@tippyjs/react/headless";
import { ethers } from "ethers";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react";
import { CgClose } from "react-icons/cg";
import { MdLogout } from "react-icons/md";
import "tippy.js/dist/tippy.css"; // optional
import Web3 from "web3";
import {
  ProfileIcon,
  SearchIcon
} from "../Icons";
import { LogoDeMask, LogoDeMaskBeta } from "../Logo/Logo";
import { MenuHeader } from "../Menu";
import { MenuNetwork } from "../Menu/MenuNetwork";
import { ModalWallet } from "../Modal/ModalWallet";
import Search from "../Search/SearchHeader";
import { WrongNetwork } from "../Modal/ModalWrongNetwork";
import { version } from "@/libs/constants";
import { useRouter } from "next/router";
import useInformationToken from "@/hooks/useInformationToken";
import formatNumber from "@/libs/utils/formatNumer";
import { useDispatch } from "react-redux";
import { logout } from "@/store/profileSlice";
const style = {
  itemNav: `flex 3xl:gap-x-8 text-dark2 text-lg gap-x-4 font-medium`,
  menuSub:
    "pt-1 pb-1 w-full bg-white border text-sm rounded-lg shadow-xl box border-dark4 font-medium",
  itemSub:
    "flex items-center p-2 transition-all duration-150 ease-in rounded-lg cursor-pointer border hover:border-secondary5 border-white hover:text-secondary5 active:text-secondary3",
  btnWallet:
    "flex items-center justify-center py-1 pl-2 cursor-pointer lg:px-4 pr-2 text-sm font-medium transition duration-150 ease-out border rounded-lg group hover:bg-white bg-secondary2 active:bg-secondary3 text-white hover:text-secondary2 gap-x-2 border-secondary2 group",
};

export default function Header() {
  const headerRef = useRef<HTMLParagraphElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();
  const { account, updateAccount, wallet, chainId, demask } = useContext(AccountContext);
  const { ROUTER: routerAddress, RPC: rpc, NATIVE_ADDRESS: nativeAddress } = demask;
  const { balanceToken, isLoadingBalance } =
    useInformationToken(account, nativeAddress, wallet, routerAddress, rpc, nativeAddress, true);
  const dispatch = useDispatch();
  const handleOpen = () => {
    document.body.style.overflowY = "hidden";
    setIsOpen(true);
  };

  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };
  const disconnectWallet = () => {
    localStorage.removeItem("ACCOUNT_DEMASK");
    // localStorage.removeItem("WALLET_DEMASK");
    updateAccount("");
    dispatch(logout());
  };

  // const provider = getProvider(wallet);
  // useEffect(() => {
  //   const getAddress = async () => {
  //     const provider = await getProvider(wallet);
  //     if (provider) {
  //       const test = new ethers.providers.Web3Provider(provider) as any;
  //       if (provider && test.provider.selectedAddress === null) {
  //         console.log(provider);
  //         console.log(provider.selectedAddress);
  //         console.log(provider.chainId);
  //         const web3 = new Web3(provider);
  //         const accounts = await web3.eth.getAccounts();
  //         const selectedAddress = accounts[0];
  //         console.log(selectedAddress);
  //         disconnectWallet();
  //       }
  //     }
  //   };
  //   getAddress();
  // }, [provider]);
  useEffect(() => {
    if (window.innerWidth >= 768) {
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
    }
  }, []);

  const [showSearch, setShowSearch] = useState(false);
  const a = 0;
  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between gap-2 transition-all duration-500 ease-in-outshadow-md bg-secondary1 h-header lg:px-primary md:px-14"
      >
        <div className="flex items-center flex-shrink-0 gap-2">
          <div className="text-center">
            <Link href='https://demask.finance/' target="_blank" className={`p-2 border border-secondary1 rounded-xl block hover:border-white ${router.pathname === '/' ? "bg-white" : ""}`}>
              <LogoDeMask width={94} height={24} className={`${router.pathname === '/' ? "fill-[#7413DC]" : "fill-white"}`} />
            </Link>
            <p className="text-xs font-semibold text-dark3 lg:hidden">{version}</p>
          </div>
          <div className="hidden ml-8 lg:block">
            <MenuHeader />
          </div>
        </div>

        <div className="flex items-center justify-end flex-shrink-0 gap-x-6">
          <div
            onClick={() => {
              setShowSearch(false);
              document.body.style.overflowY = "auto";
            }}
            className={`${showSearch ? "block" : "hidden"
              } fixed bg-black z-50 top-0 opacity-40 right-0 w-full h-full`}
          ></div>
          <div className="flex gap-2 lg:gap-x-6 md:gap-x-4">
            <div
              className="text-secondary5 lg:hidden"
              onClick={() => {
                setShowSearch(!showSearch);
                document.body.style.overflowY = "hidden";
              }}
            >
              <SearchIcon
                width={32}
                height={32}
                className="cursor-pointer fill-secondary3 active:fill-secondary2"
              />
            </div>

            <div
              className={`${showSearch ? "translate-y-[10%]" : "translate-y-[150%]"
                } fixed w-[100%] rounded-3xl px-3 pt-12 lg:hidden h-[100vh] bg-white z-[60] shadow-home duration-300 transition-all top-0 right-0 bottom-0`}
            >
              <div className="ml-2 ">
                <Search isFocused={isFocused} handleFocus={handleFocus} setShowSearch={setShowSearch} />
              </div>

              <button
                onClick={() => {
                  setShowSearch(false);
                  document.body.style.overflowY = "auto";
                }}
                className={`absolute top-2 right-4 flex items-center p-1 rounded-full shadow-md bg-white`}
              >
                <CgClose className="text-xl transition-colors duration-100 ease-linear hover:text-red" />
              </button>
            </div>
            <MenuNetwork />
            {account ? (
              <Tippy
                interactive
                render={(attrs) => (
                  <div
                    className="w-[200px] px-2  border rounded-lg shadow-xl box bg-white border-dark4 pb-1 pt-1"
                    tabIndex={-1}
                    {...attrs}
                  >
                    <ul className="pb-2 mt-2">
                      <Link href={`/profile?chain=${chainId}`} className={`${style.itemSub}`}>Profile</Link>
                      <Link href={`/profile/edit?chain=${chainId}`} className={`${style.itemSub}`}>Edit profile</Link>
                      <li
                        className={`${style.itemSub} justify-between mb-2`}
                        onClick={disconnectWallet}
                      >
                        <div>Disconnect</div>
                        <MdLogout />
                      </li>
                    </ul>
                  </div>
                )}
              >
                <div>
                  <div className={style.btnWallet}>
                    <ProfileIcon
                      width={24}
                      height={24}
                      className="fill-white"
                    />
                    {`${account.slice(0, 2)}...${account.slice(-4)}`}
                    <div className="items-center hidden pl-2 transition duration-150 ease-out border-l border-white lg:flex group-hover:border-secondary5">
                      <Image
                        className="hidden group-hover:block"
                        src={Icons.wallet}
                        alt="wallet connect"
                      />
                      <Image
                        className="block group-hover:hidden"
                        src={Icons.walletHover}
                        alt="wallet connect hover"
                      />
                      {isLoadingBalance ? (
                        <div className="w-[30px] h-[10px] border rounded-lg ml-2 bg-slate-200 animate-pulse"></div>
                      ) : (
                        <span className="ml-2">{formatNumber(balanceToken)}</span>
                      )}
                      <span className="ml-1">ETH</span>
                    </div>
                  </div>

                </div>
              </Tippy>
            ) : (
              <button className={style.btnWallet} onClick={handleOpen}>
                <Image
                  className="hidden group-hover:block"
                  src={Icons.wallet}
                  alt="wallet connect"
                />
                <Image
                  className="block group-hover:hidden"
                  src={Icons.walletHover}
                  alt="wallet connect hover"
                />
                <p>
                  CONNECT{" "}
                  <span className="hidden lg:inline-block md:inline-block">
                    WALLET
                  </span>
                </p>
              </button>
            )}
          </div>
        </div>
      </header>
      <div className="absolute z-[50]">
        <ModalWallet isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
      <WrongNetwork />
    </>
  );
}
