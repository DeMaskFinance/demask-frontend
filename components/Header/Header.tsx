import AccountContext from "@/context/AccountContext";
import useInformationToken from "@/hooks/useInformationToken";
import { getNonce, loginAuthen } from "@/libs/service/userService";
import formatNumber from "@/libs/utils/formatNumer";
import { login, logout, selectProfile } from "@/store/profileSlice";
import { CubeIcon } from "@radix-ui/react-icons";
import { useAppKit, useAppKitAccount, useDisconnect } from '@reown/appkit/react';
import Tippy from "@tippyjs/react/headless";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import "tippy.js/dist/tippy.css"; // optional
import { useSignMessage } from "wagmi";
import { AvatarCustom } from "../Avatars";
import { Button } from "../Buttons";
import Copy from "../Common/Copy";
import {
  EditIcon,
  EtherIcon,
  LogoutIcon,
  SearchIcon,
  UserIcon,
  WalletIcon
} from "../Icons";
import { DemaskIcon, LogoDeMask } from "../Logo/Logo";
import { MenuHeader } from "../Menu";
import { MenuNetwork } from "../Menu/MenuNetwork";
import { WrongNetwork } from "../Modal/ModalWrongNetwork";
import Search from "../Search/SearchHeader";
import ModalWaitingSign from "../Modal/ModalWaitingSign";

export default function Header() {

  const { account, updateAccount, wallet, isEvent, setIsEvent, chainId, demask } =
    useContext(AccountContext);


  const { isLoggedIn, profile } = useSelector(selectProfile);
  const { isLoadingBalance, balanceToken } = useInformationToken(
    account,
    wallet,
    chainId
  );

  const dispatch = useDispatch();
  const [showSearch, setShowSearch] = useState(false);

  const handleFocus = () => {
    setShowSearch(false);
    document.body.style.overflowY = "auto";
  };


  const { open } = useAppKit();
  const { address, isConnected, allAccounts } = useAppKitAccount();
  const { signMessageAsync } = useSignMessage();
  const { disconnect } = useDisconnect()
  const [isSigning, setIsSigning] = useState(false);


  const handleLogin = async () => {
    if (!isConnected) {
      await open();
      return;
    }
    if (address && !isSigning) {
      setIsSigning(true);
      await signAndAuthenticate();
    }
  };

  const signAndAuthenticate = async () => {
    try {
      if (!address) return;
      setIsSigning(true);

      const { data: sign } = await getNonce(address);
      const signedData = await signMessageAsync({ message: String(sign.nonce) });

      if (!signedData) {
        disconnect();
        return;
      }

      const loginData = await loginAuthen({
        userAddress: address,
        signature: signedData,
      });

      dispatch(login({ accessToken: loginData.accessToken, user: address }));
      updateAccount(address);
    } catch (error) {
      disconnect();
      console.error(error);
    } finally {
      setIsSigning(false);
    }
  };

  useEffect(() => {

    if (address && isConnected && !isSigning && account) {
      return;
    }

    if (address && isConnected && !isSigning) {
      signAndAuthenticate();
    }
  }, [address, isConnected]);




  const disconnectWallet = () => {
    localStorage.removeItem("ACCOUNT_DEMASK");
    updateAccount("");
    disconnect();
    dispatch(logout());
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
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
            className={`${showSearch ? "block" : "hidden"
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
              className={`${showSearch ? "translate-y-[10%]" : "translate-y-[150%]"
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

            {isConnected && account ? (
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
                  trigger="click"
                  hideOnClick={true}
                  render={(attrs) => (
                    <div className="" tabIndex={-1} {...attrs}>
                      <ul className="pb-2 w-[173px] menu font-semibold">
                        <li className="text-sm p-2 rounded-lg items-center gap-x-2 bg-primary_500 bg-opacity-[0.15] flex text-primary_300">
                          {`${account.slice(0, 8)}...${account.slice(-6)}`}
                          <Copy content={account} />
                        </li>
                        <Link href={`/profile`} className="text-sm item_menu gap-x-2">
                          <UserIcon width={18} height={18} />
                          My Profile
                        </Link>
                        <Link href={`/profile/edit`} className="text-sm item_menu gap-x-2">
                          <EditIcon width={18} height={18} />
                          Edit profile
                        </Link>
                        <Link href={`/referral`} className="text-sm item_menu gap-x-2">
                          <CubeIcon width={18} height={18} />
                          Referrals
                        </Link>
                        <li className={`text-sm text-rose-500 item_menu gap-x-2 mb-2`} onClick={() => {
                          disconnectWallet()
                        }}>
                          <LogoutIcon width={18} height={18} />
                          <div>Disconnect</div>
                        </li>
                      </ul>
                    </div>
                  )}
                >
                  <div className="flex items-center justify-center hover:opacity-80 transition border-2 rounded-full cursor-pointer border-primary_400 h-9 w-9">
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
              <Button
                gradient
                className=" h-10 px-[10px] md:px-3 flex gap-x-2"
                onClick={handleLogin}
              >
                <WalletIcon width={20} height={20} />
                <p className="hidden md:block">Connect Wallet</p>
              </Button>
            )}
          </div>
        </div>
      </header>
      {/* <Maintenance /> */}

      {account && <WrongNetwork />}

      <ModalWaitingSign isOpen={isSigning} />
    </div>
  );
}
