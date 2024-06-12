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
import Marquee from "react-fast-marquee";
import {
  CopyIcon,
  EditIcon,
  EtherIcon,
  LightIcon,
  LogoutIcon,
  SearchIcon,
  UserIcon,
  WalletIcon,
} from "../Icons";
import { LogoDeMask } from "../Logo/Logo";
import { MenuHeader } from "../Menu";
import { MenuNetwork } from "../Menu/MenuNetwork";
import { ModalWallet } from "../Modal/ModalWallet";
import { WrongNetwork } from "../Modal/ModalWrongNetwork";
import Search from "../Search/SearchHeader";
import { AvatarCustom } from "../Avatars";
import Copy from "../Common/Copy";
import BackgroundParticles from "../Backgrounds/BackGroundParticles";
const style = {
  btnWallet:
    "flex items-center h-10  pl-2 lg:px-4 pr-2 justify-center text-sm font-semibold transition duration-150 ease-out rounded-lg group bg_gradient active:bg-primary_400 text-white gap-x-2 ",
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
  const { isLoggedIn, profile } = useSelector(selectProfile);
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
              "border-shader_500"
            );
          } else {
            headerClassList.remove(
              "border-b",
              "border-solid",
              "border-shader_500"
            );
          }
          if (currentScrollPos === 0) {
            headerClassList.remove(
              "border-b",
              "border-solid",
              "border-shader_500"
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
      className="fixed top-0 left-0 right-0 z-50 transition-transform duration-500 ease-in-out"
    >
      {isEvent && (
        <a
          href="https://galxe.com/MeeT2AiDRo73NiBYKoZdwa/campaign/GCd7Ft4Npv"
          rel="noopener noreferrer"
          target="_blank"
        >
          <div className="block cursor-pointer text-white bg-event-gradient  bg-blend-screen relative overflow-hidden -z-50">
            <Marquee autoFill pauseOnHover gradient gradientColor="#7C7FF8">
              <div className="flex items-center justify-center h-11 mr-20 gap-x-3 font-semibold">
                <span>
                  <LightIcon width={24} height={24} />
                </span>
                <span>
                  Blast Big Bang - The airdrop Demask Finance x BleBle Campaign
                  on Galxe
                </span>
              </div>
            </Marquee>
            <BackgroundParticles value={8800} id="particle-container" />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEvent(false);
            }}
            className={`absolute top-2 right-4 flex items-center p-1 z-[60]`}
          >
            <CgClose className="text-xl text-white transition-colors duration-100 ease-linear hover:text-red" />
          </button>
        </a>
      )}

      <header className="flex items-center justify-between gap-2 px-4 text-sm ease-in-out shadow-md lg:shadow-none h-header">
        <div className="flex items-center flex-1 flex-shrink-0 gap-x-4 lg:gap-x-8">
          <div className="text-center">
            <Link href="https://demask.finance/" target="_blank">
              <LogoDeMask width={105} height={24} className="fill-white" />
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
          <div className="flex items-center gap-x-2">
            <div
              className="text-primary_400 lg:hidden"
              onClick={() => {
                setShowSearch(!showSearch);
                document.body.style.overflowY = "hidden";
              }}
            >
              <SearchIcon
                width={20}
                height={20}
                className="text-white cursor-pointer"
              />
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
                <CgClose className="text-xl text-white transition-colors duration-100 ease-linear hover:text-red" />
              </button>
            </div>
            <MenuNetwork />

            {isLoggedIn && account ? (
              <div className="flex items-center gap-x-2">
                <div className="flex items-center px-3 py-2 font-bold text-white rounded-lg gap-x-2 bg-shader_700">
                  {isLoadingBalance ? (
                    <div className="w-12 h-6 border rounded-lg bg-slate-700 animate-pulse"></div>
                  ) : (
                    <span className="">{formatNumber(balanceToken)}</span>
                  )}
                  <EtherIcon width={16} height={16} />
                </div>
                <Tippy
                  interactive
                  render={(attrs) => (
                    <div className="" tabIndex={-1} {...attrs}>
                      <ul className="pb-2 w-[173px] menu font-semibold">
                        <li className="text-sm p-2 rounded-lg items-center gap-x-2 bg-primary_500 bg-opacity-[0.15] flex text-primary_300">
                          {`${account.slice(0, 8)}...${account.slice(-6)}`}
                          <Copy content={account} />
                        </li>
                        <Link
                          href={`/profile?chain=${chainId}`}
                          className="text-sm item_menu gap-x-2"
                        >
                          <UserIcon width={18} height={18} />
                          My Profile
                        </Link>
                        <Link
                          href={`/profile/edit?chain=${chainId}`}
                          className="text-sm item_menu gap-x-2"
                        >
                          <EditIcon width={18} height={18} />
                          Edit profile
                        </Link>
                        <li
                          className={`text-sm item_menu gap-x-2 mb-2`}
                          onClick={disconnectWallet}
                        >
                          <LogoutIcon width={18} height={18} />
                          <div>Disconnect</div>
                        </li>
                      </ul>
                    </div>
                  )}
                >
                  <div className="flex items-center justify-center border-2 rounded-full cursor-pointer border-primary_400 h-9 w-9">
                    <AvatarCustom
                      avatarUrl={profile?.avatar}
                      size={20}
                      userAddress={profile.userAddress!}
                      className="w-full h-full rounded-full"
                    />
                  </div>
                </Tippy>
              </div>
            ) : (
              <button className={style.btnWallet} onClick={handleOpen}>
                <WalletIcon width={20} height={20} className="" />
                <p>
                  Connect{" "}
                  <span className="hidden lg:inline-block md:inline-block">
                    wallet
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
