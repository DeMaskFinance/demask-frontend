import { getProvider } from "@/libs/connection/getProvider";
import React, { createContext, useEffect, useState } from "react";

const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
  const [account, setAccount] = useState("");
  const [wallet, setWallet] = useState("");
  useEffect(() => {
    const storedAccount = localStorage.getItem("ACCOUNT_DEMASK");
    const storedWallet = localStorage.getItem("WALLET_DEMASK");
    if (storedAccount) {
      setAccount(storedAccount);
    }
    if (storedWallet) {
      setWallet(storedWallet);
    }
  }, [account]);
  console.log(account);
  const updateAccount = (newAccount) => {
    setAccount(newAccount);
    localStorage.setItem("ACCOUNT_DEMASK", newAccount);
  };

  const updateWallet = (newWallet) => {
    setWallet(newWallet);
    localStorage.setItem("WALLET_DEMASK", newWallet);
  };
  const provider = getProvider(wallet);
  useEffect(() => {
    console.log(wallet);
    console.log(provider);
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          updateAccount(accounts[0]);
        } else if (accounts.length === 0) {
          localStorage.removeItem("ACCOUNT_DEMASK");
          localStorage.removeItem("WALLET_DEMASK");
          updateAccount("");
        }
      };
      provider?.on("accountsChanged", handleAccountsChanged);
      return () => {
        provider?.removeAllListeners("accountsChanged", handleAccountsChanged);
      };
    }
  },[provider]);
  return (
    <AccountContext.Provider
      value={{ account, updateAccount, updateWallet, wallet }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export default AccountContext;
