import AccountContext from "@/context/AccountContext";
import useInformationToken from "@/hooks/useInformationToken";
import { getProvider } from "@/libs/connection/getProvider";
import formatNumber from "@/libs/utils/formatNumer";
import { logout, selectProfile } from "@/store/profileSlice";
import Tippy from "@tippyjs/react/headless";
import { ethers } from "ethers";
import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react";
import { CgClose } from "react-icons/cg";
import { MdLogout } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import "tippy.js/dist/tippy.css"; // optional
import Web3 from "web3";
import Maintenance from "../Common/Maintenance";
import { ProfileIcon, SearchIcon, WalletIcon } from "../Icons";
import { LogoDeMask } from "../Logo/Logo";
import { MenuHeader } from "../Menu";
import { MenuNetwork } from "../Menu/MenuNetwork";
import { ModalWallet } from "../Modal/ModalWallet";
import { WrongNetwork } from "../Modal/ModalWrongNetwork";
import Search from "../Search/SearchHeader";
const style = {
  itemNav: `flex 3xl:gap-x-8 text-dark2 text-lg gap-x-4 font-medium`,
  menuSub:
    "pt-1 pb-1 w-full bg-white border text-sm rounded-lg shadow-xl box border-dark4 font-medium",
  itemSub:
    "flex area_input_hover items-center p-2 transition-all duration-150 ease-in rounded-lg cursor-pointer hover:bg-dark5 text-dark2 font-medium",
  btnWallet:
    "flex items-center h-10 hover:border-dark2 dark:hover:bg-dark2 pl-2 lg:px-4 pr-2 justify-center dark:bg-dark1 dark:text-white text-sm font-medium transition duration-150 ease-out rounded-lg group hover:bg-dark4 bg-dark5 active:bg-dark3 text-dark2 gap-x-2 ",
};

export default function Header() {
  const headerRef = useRef<HTMLParagraphElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const {
    account,
    updateAccount,
    wallet,
    chainId,
    demask,
    isEvent,
    setIsEvent,
  } = useContext(AccountContext);
  const {
    ROUTER: routerAddress,
    RPC: rpc,
    NATIVE_ADDRESS: nativeAddress,
  } = demask;
  const { isLoggedIn } = useSelector(selectProfile);
  const { balanceToken, isLoadingBalance } = useInformationToken(
    account,
    nativeAddress,
    wallet,
    routerAddress,
    rpc,
    nativeAddress,
    true
  );
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

  const provider = getProvider(wallet);
  useEffect(() => {
    const getAddress = async () => {
      const provider = await getProvider(wallet);
      if (provider) {
        const test = new ethers.providers.Web3Provider(provider) as any;
        // console.log("name:", provider.selectedAddress);
        // console.log("test1", test.provider.selectedAddress);
        const web3 = new Web3(provider);
        const accounts = await web3.eth.getAccounts();
        const selectedAddress = accounts[0];
        // console.log("selectedADD", selectedAddress);
        if (provider && test.provider.selectedAddress === null) {
          disconnectWallet();
        }
      }
    };
    getAddress();
  }, [provider, wallet]);
  useEffect(() => {
    if (window.innerWidth >= 768) {
      let prevScrollPos = window.scrollY;

      const handleScroll = () => {
        const currentScrollPos = window.scrollY;
        const isScrolledUp = prevScrollPos > currentScrollPos;
        if (headerRef.current) {
          const headerClassList = headerRef.current.classList;
          headerClassList.toggle("translate-y-0", isScrolledUp);
          headerClassList.toggle(
            "translate-y-[-100%]",
            !isScrolledUp && currentScrollPos > 120
          );
          if (isScrolledUp) {
            headerClassList.add(
              "border-b",
              "border-solid",
              "border-gray-300",
              "dark:border-none"
            );
          } else {
            headerClassList.remove(
              "border-b",
              "border-solid",
              "border-gray-300",
              "dark:border-none"
            );
          }
          if (currentScrollPos === 0) {
            headerClassList.remove(
              "border-b",
              "border-solid",
              "border-gray-300"
            );
          }
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
  return (
    <div
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out"
    >
      {/* {isEvent && (
        <div>
          <a
            href="https://galxe.com/MeeT2AiDRo73NiBYKoZdwa/campaign/GCd7Ft4Npv"
            rel="noopener noreferrer"
            target="_blank"
            className="block cursor-pointer text-white text-[8px] bg-gradient-to-b from-[#BA8DE6] to-[#7B54E8] text-sm font-light"
          >
            <Marquee autoFill pauseOnHover gradient gradientColor="#7F57E8">
              <div className="flex items-center justify-center h-10 mr-20 gap-x-3">
                <span>
                  <LightIcon width={24} height={24} />
                </span>
                <span>
                  Blast Big Bang - The airdrop Demask Finance x BleBle Campaign
                  on Galxe
                </span>
              </div>
            </Marquee>
          </a>
          <button
            onClick={() => {
              setIsEvent(false);
            }}
            className={`absolute top-2 right-4 flex items-center p-1 z-[60]`}
          >
            <CgClose className="text-xl text-white transition-colors duration-100 ease-linear hover:text-red" />
          </button>
        </div>
      )} */}
      <header className="flex items-center justify-between gap-2 px-4 ease-in-out bg-white shadow-md lg:shadow-none h-header lg:px-primary md:px-14">
        <div className="flex items-center flex-1 flex-shrink-0 gap-x-4 lg:gap-x-8">
          <div className="text-center">
            <Link href="https://demask.finance/" target="_blank">
              <LogoDeMask width={105} height={24} className="dark:fill-white" />
            </Link>
          </div>
          <div className="hidden w-full lg:block">
            <MenuHeader />
          </div>
        </div>
        {/* Search mobile */}
        <div className="flex items-center justify-end flex-shrink-0 gap-x-6 ">
          <div
            onClick={() => {
              setShowSearch(false);
              document.body.style.overflowY = "auto";
            }}
            className={`${
              showSearch ? "block" : "hidden"
            } fixed bg-black z-50 top-0 opacity-40 right-0 w-full h-full`}
          ></div>
          <div className="flex items-center lg:gap-x-6 gap-x-4">
            <div
              className="text-secondary5 lg:hidden"
              onClick={() => {
                setShowSearch(!showSearch);
                document.body.style.overflowY = "hidden";
              }}
            >
              <SearchIcon width={30} height={30} className="cursor-pointer" />
            </div>

            <div
              className={`${
                showSearch ? "translate-y-[10%]" : "translate-y-[150%]"
              } fixed w-[100%] rounded-3xl px-3 pt-12 lg:hidden h-[100vh] bg-white z-[60] shadow-home duration-300 transition-all top-0 right-0 bottom-0`}
            >
              <div className="ml-2 ">
                <Search
                  isFocused={isFocused}
                  handleFocus={handleFocus}
                  setShowSearch={setShowSearch}
                />
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
            {isLoggedIn && account ? (
              <Tippy
                interactive
                render={(attrs) => (
                  <div
                    className="w-[200px] px-2  border rounded-lg shadow-xl box bg-white border-dark4 pb-1 pt-1 area_input"
                    tabIndex={-1}
                    {...attrs}
                  >
                    <ul className="pb-2 mt-2">
                      <Link
                        href={`/profile?chain=${chainId}`}
                        className={`${style.itemSub}`}
                      >
                        Profile
                      </Link>
                      <Link
                        href={`/profile/edit?chain=${chainId}`}
                        className={`${style.itemSub}`}
                      >
                        Edit profile
                      </Link>
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
                      width={20}
                      height={20}
                      className="dark:fill-white"
                    />
                    {`${account.slice(0, 2)}...${account.slice(-4)}`}
                    <div className="items-center hidden pl-2 transition duration-150 ease-out border-l border-dark2 lg:flex">
                      <WalletIcon
                        width={20}
                        height={20}
                        className="dark:fill-white"
                      />
                      {isLoadingBalance ? (
                        <div className="w-[30px] h-[10px] border rounded-lg ml-2 bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
                      ) : (
                        <span className="ml-2">
                          {formatNumber(balanceToken)}
                        </span>
                      )}
                      <span className="ml-1">ETH</span>
                    </div>
                  </div>
                </div>
              </Tippy>
            ) : (
              <button className={style.btnWallet} onClick={handleOpen}>
                <WalletIcon
                  width={20}
                  height={20}
                  className="dark:fill-white"
                />
                <p>
                  Connect{" "}
                  <span className="hidden lg:inline-block md:inline-block">
                    to wallet
                  </span>
                </p>
              </button>
            )}
          </div>
        </div>
      </header>
      <Maintenance />
      <div className="absolute z-[50]">
        <ModalWallet isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
      {account && <WrongNetwork />}
    </div>
  );
}
