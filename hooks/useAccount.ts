import React, { useEffect, useState } from "react";
import Web3 from "web3";
export function useAccount() {
  const [account, setAccount] = useState<string | null>();
  const disconnect = () => {
    setAccount(null);
  };
  useEffect(() => {
    const fetchAccount = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          const accounts = await web3.eth.getAccounts();
          console.log(accounts);
          
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          } else {
            setAccount(null);
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        console.log("Web3 provider not found");
      }
      if (window.ethereum && window.ethereum.selectedAddress) {
        setAccount(window.ethereum.selectedAddress);
      }
    };

    fetchAccount();
  }, []);
  const isLoggedIn = () => {
    return account !== null;
  };
  return { account, disconnect,isLoggedIn };
}
