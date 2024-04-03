import AccountContext from "@/context/AccountContext";
import React, { Fragment, useContext, useState } from "react";
import { ActiveLink } from "../Link";
import Search from "../Search/SearchHeader";
import {  useRouter } from "next/router";
import { useSelector } from "react-redux";
import {  selectProfile } from "@/store/profileSlice";
import { ModalWallet } from "../Modal/ModalWallet";
interface MenuHeaderProps {}
const MenuHeader: React.FC<MenuHeaderProps> = () => {
  const [isFocused, setIsFocused] = useState(false);
  const { demask, chainId } = useContext(AccountContext);
  const { isLoggedIn } = useSelector(selectProfile);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();
  const data = [
    { id: 1, name: "Mint", url: "/mint" },
    { id: 2, name: "Launchpad", url: "/launchpad" },
    { id: 3, name: "Swap", url: `/swap` },
    { id: 4, name: "Pools", url: "/pools" },
    { id: 5, name: "Leaderboard", url: "/leaderboard" },
  ];
  const handleFocus = () => {
    setIsFocused(true);
  };
  const onMint = () =>{
    if(isLoggedIn){
      router.replace('/mint')
    }else{
      console.log(123);
      
    }
  }
  return (
    <div className="flex gap-x-8">
      <ul className="flex items-center text-lg font-medium 3xl:gap-x-8 text-dark2 gap-x-8">
        <li className="relative text-base hover:text-secondary5 active:text-secondary3">
          <button type="button" className="relative text-base hover:text-secondary5 active:text-secondary3" onClick={onMint}>
            <p className="text-dark3">Mint</p>
          </button>
        </li>
        <li className="relative text-base hover:text-secondary5 active:text-secondary3">
          <ActiveLink href={`/launchpad?chain=${chainId}`}>
            <p className="text-dark3">Launchpad</p>
          </ActiveLink>
        </li>
        <li className="relative text-base hover:text-secondary5 active:text-secondary3">
          <ActiveLink href={`/swap?chain=${chainId}`}>
            <p className="text-dark3">Swap</p>
          </ActiveLink>
        </li>
        <li className="relative text-base hover:text-secondary5 active:text-secondary3">
          <ActiveLink href={`/swap?chain=${chainId}`}>
            <p className="text-dark3">Pools</p>
          </ActiveLink>
        </li>
        <li className="relative text-base hover:text-secondary5 active:text-secondary3">
          <ActiveLink href={`/leaderboard?chain=${chainId}`}>
            <p className="text-dark3">Leaderboard</p>
          </ActiveLink>
        </li>
      </ul>
      <Search isFocused={isFocused} handleFocus={handleFocus} />
      <ModalWallet isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default MenuHeader;
