import {
  MONAD_DEMASK,
  network,
  SEPOLIA_DEMASK,
  STARKNET_DEMASK,
  tokenSepolia,
  tokenStarknet,
} from "@/libs/constants";
import { createContext, useEffect, useState } from "react";
const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
  const [account, setAccount] = useState("");
  const [wallet, setWallet] = useState("");
  const [chainId, setChainId] = useState(network[0]?.chain);
  const [demask, setDemask] = useState("");
  const [tokenDefault, setTokenDefault] = useState("");
  const [slippage, setSlippage] = useState(5);
  const [txDeadline, setTxDeadline] = useState(20);
  const [isEvent, setIsEvent] = useState(true);
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
    if (chainId === "11155111") {
      setDemask(SEPOLIA_DEMASK);
      setTokenDefault(tokenSepolia);
    } else {
      setDemask(MONAD_DEMASK);
      setTokenDefault(tokenStarknet);
    }
  }, [chainId]);
  useEffect(() => {
    let storedSlippage = localStorage.getItem("SLIPPAGE_DEMASK");
    if (storedSlippage) {
      setSlippage(Number(storedSlippage));
    }
  }, [slippage]);
  useEffect(() => {
    const storedTime = localStorage.getItem("TXDEADLINE_DEMASK");
    if (storedTime) {
      setTxDeadline(Number(storedTime));
    }
  }, [txDeadline]);
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
  const updateSlippage = (newSlippage) => {
    setSlippage(newSlippage);
    localStorage.setItem("SLIPPAGE_DEMASK", newSlippage);
  };
  const updateTxDeadline = (newTime) => {
    setTxDeadline(newTime);
    localStorage.setItem("TXDEADLINE_DEMASK", newTime);
  };
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
        txDeadline,
        updateTxDeadline,
        slippage,
        updateSlippage,
        isEvent,
        setIsEvent,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export default AccountContext;
