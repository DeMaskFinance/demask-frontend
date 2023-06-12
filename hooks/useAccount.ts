import { getProvider } from "@/libs/connection/getProvider";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import Web3 from "web3";
export function useAccount() {
  // const [address, setAddress] = useState<string | null>();
  // const disconnect = () => {
  //   setAddress(null);
  // };
  // useEffect(() => {
  //   const fetchAccount = async () => {
  //     const wallet = localStorage.getItem("WALLET_DEMASK");
  //     if (wallet) {
  //       const providerChoice = getProvider(wallet);
  //       const provider = new ethers.providers.Web3Provider(providerChoice);
  //       const signer = provider.getSigner();
  //       const address = await signer.getAddress();
  //       setAddress(address);
  //     } else{
  //       setAddress('');
  //     }
  //   };

  //   fetchAccount();
  // }, []);
  // const isLoggedIn = () => {
  //   return address !== null;
  // };
  // return { address, disconnect, isLoggedIn };
  const [address, setAddress] = useState('');

  useEffect(() => {
    const value = localStorage.getItem('ACCOUNT');
    if(value){
      setAddress(value);
    }else{
      setAddress('');
    }
  });

  const disconnectWallet = () => {
    localStorage.removeItem('ACCOUNT');
    localStorage.removeItem('WALLET_DEMASK');
    setAddress('');
  };

  return { address, disconnectWallet };
}
