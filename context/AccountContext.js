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
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = () => {
        console.log("1234");
      };
      window.ethereum?.on("accountsChanged", handleAccountsChanged);
      return () => {
        window.ethereum?.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      };
    }
  });
  return (
    <AccountContext.Provider
      value={{ account, updateAccount, updateWallet, wallet }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export default AccountContext;
