import { getProvider } from "@/libs/connection/getProvider";
import React, { createContext, useEffect, useState } from "react";
import {
  MUMBAI_DEMASK,
  BSC_DEMASK,
  tokenBsc,
  tokenMatic,
  Zksync_DEMASK,
  tokenzkSync,
  network,
} from "@/libs/constants";
const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
  const [account, setAccount] = useState("");
  const [wallet, setWallet] = useState("");
  const [chainId, setChainId] = useState(network[0]?.chain);
  const [demask, setDemask] = useState("");
  const [tokenDefault, setTokenDefault] = useState("");
  useEffect(() => {
    const storedAccount = localStorage.getItem("ACCOUNT_DEMASK");
    const storedWallet = localStorage.getItem("WALLET_DEMASK");
    const storedChainId = localStorage.getItem("CHAINID");
    if (storedAccount) {
      setAccount(storedAccount);
    }
    if (storedWallet) {
      setWallet(storedWallet);
    }
    if (storedChainId) {
      setChainId(storedChainId);
    }
  }, [account]);
  useEffect(() => {
    if (chainId === "80001") {
      setDemask(MUMBAI_DEMASK);
      setTokenDefault(tokenMatic);
    } else if (chainId === "97") {
      setDemask(BSC_DEMASK);
      setTokenDefault(tokenBsc);
    } else if (chainId === "280") {
      setDemask(Zksync_DEMASK);
      setTokenDefault(tokenzkSync);
    }
  }, [chainId]);
  // console.log(account);
  const updateAccount = (newAccount) => {
    setAccount(newAccount);
    localStorage.setItem("ACCOUNT_DEMASK", newAccount);
  };

  const updateWallet = (newWallet) => {
    setWallet(newWallet);
    localStorage.setItem("WALLET_DEMASK", newWallet);
  };

  const updateChainId = (newChainId) => {
    setChainId(newChainId);
    localStorage.setItem("CHAINID", newChainId);
  };
  const provider = getProvider(wallet);
  const PORT = process.env.NEXT_PUBLIC_APP_PORT;
  useEffect(() => {
    // console.log(wallet);
    // console.log(provider);
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
      const handleChainChanged = (networkId) => {
        if (PORT === "3000" && networkId === "280") {
          updateChainId(networkId);
        } else if (
          PORT === "1307" &&
          (networkId === "97" || networkId === "80001")
        ) {
          updateChainId(networkId);
        }
      };
      provider?.on("accountsChanged", handleAccountsChanged);
      provider?.on("networkChanged", handleChainChanged);
      return () => {
        provider?.removeAllListeners("accountsChanged", handleAccountsChanged);
        provider?.removeAllListeners("networkChanged", handleChainChanged);
      };
    }
  }, [provider]);
  return (
    <AccountContext.Provider
      value={{
        account,
        updateAccount,
        updateWallet,
        wallet,
        updateChainId,
        chainId,
        demask,
        tokenDefault,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export default AccountContext;
