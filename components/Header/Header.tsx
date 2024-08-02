import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AccountContext from "@/context/AccountContext";
import { getProvider } from "@/libs/connection/getProvider";
import formatNumber from "@/libs/utils/formatNumer";
import { logout, selectProfile } from "@/store/profileSlice";
import Tippy from "@tippyjs/react/headless";
import { ethers } from "ethers";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { CgClose } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import "tippy.js/dist/tippy.css"; // optional
import Web3 from "web3";
import { AvatarCustom } from "../Avatars";
import BackgroundParticles from "../Backgrounds/BackGroundParticles";
import { Button } from "../Buttons";
import Copy from "../Common/Copy";
import {
  EditIcon,
  EtherIcon,
  LightIcon,
  LogoutIcon,
  SearchIcon,
  UserIcon,
  WalletIcon,
} from "../Icons";
import { DemaskIcon, LogoDeMask } from "../Logo/Logo";
import { MenuHeader } from "../Menu";
import { MenuNetwork } from "../Menu/MenuNetwork";
import { ModalWallet } from "../Modal/ModalWallet";
import { WrongNetwork } from "../Modal/ModalWrongNetwork";
import Search from "../Search/SearchHeader";

export default function Header() {
  const {
    account,
    updateAccount,
    wallet,
    chainId,
    demask,
    isEvent,
    setIsEvent,
    balanceToken,
    isLoadingBalance,
  } = useContext(AccountContext);
  const { isLoggedIn, profile } = useSelector(selectProfile);

  const dispatch = useDispatch();
  const [showSearch, setShowSearch] = useState(false);

  const handleFocus = () => {
    setShowSearch(false);
    document.body.style.overflowY = "auto";
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

  return (
    <div className="fixed top-0 left-0 right-0 z-50 ">
      {isEvent && (
        <div className="relative">
          <a
            href="https://app.galxe.com/quest/MeeT2AiDRo73NiBYKoZdwa"
            rel="noopener noreferrer"
            target="_blank"
          >
            <div className="relative block overflow-hidden text-white cursor-pointer bg-event-gradient bg-blend-screen -z-50 h-11">
              <Marquee autoFill pauseOnHover gradient gradientColor="#7C7FF8">
                <div className="flex items-center justify-center mr-20 font-semibold h-11 gap-x-3">
                  <span>
                    <LightIcon width={24} height={24} />
                  </span>
                  <span>The Campaigns on Galxe, NOW LIVE!</span>
                </div>
              </Marquee>
              <BackgroundParticles value={1800} id="particles-js" />
            </div>
          </a>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEvent(false);
            }}
            className={`absolute top-2 right-4 flex items-center p-1 z-[60]`}
          >
            <CgClose className="text-xl text-white transition-colors duration-100 ease-linear hover:text-red" />
          </button>
        </div>
      )}

      <header className="text-shader_200 w-screen h-header flex md:gap-x-28 3xl:gap-x-[500px] border-b border-shader_500 px-4 bg-opacity-65 bg-shader_900 items-center justify-between font-semibold text-sm backdrop-blur-xl">
        <div className="flex items-center flex-1 flex-shrink-0 gap-x-4 lg:gap-x-8">
          <div className="text-center">
            <Link href="https://demask.finance/" target="_blank">
              <LogoDeMask
                width={105}
                height={24}
                className="hidden fill-white md:block"
              />
              <Button className="block py-[9px] px-[9px] md:hidden" gradient>
                <DemaskIcon width={22} height={22} />
              </Button>
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
            <Button
              className="md:hidden px-[9px] h-10"
              active
              onClick={() => {
                setShowSearch(!showSearch);
              }}
            >
              <SearchIcon width={20} height={20} />
            </Button>

            <div
              className={`${
                showSearch ? "translate-y-[10%]" : "translate-y-[150%]"
              } fixed w-[100%] rounded-3xl px-3 pt-12 lg:hidden h-[100vh] bg_main z-[60] shadow-home duration-300 transition-all top-0 right-0 bottom-0`}
            >
              <div className="ml-2 ">
                <Search handleFocus={handleFocus} />
              </div>

              <button
                onClick={() => {
                  setShowSearch(false);
                  document.body.style.overflowY = "auto";
                }}
                className={`absolute top-2 right-4 flex items-center p-1 rounded-full shadow-md bg-shader_300`}
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
                          href={`/profile`}
                          className="text-sm item_menu gap-x-2"
                        >
                          <UserIcon width={18} height={18} />
                          My Profile
                        </Link>
                        <Link
                          href={`/profile/edit`}
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
                      userAddress={profile?.userAddress}
                      className="w-full h-full rounded-full"
                    />
                  </div>
                </Tippy>
              </div>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    gradient
                    className=" h-10 px-[10px] md:px-3 flex gap-x-2"
                  >
                    <WalletIcon width={20} height={20} />
                    <p className="hidden md:block">Connect Wallet</p>
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[350px] p-0 border-none">
                  <ModalWallet />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </header>
      {/* <Maintenance /> */}

      {account && <WrongNetwork />}
    </div>
  );
}
