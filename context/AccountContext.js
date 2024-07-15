import { getProvider } from "@/libs/connection/getProvider";
import {
  BLAST_DEMASK,
  network,
  SEPOLIA_DEMASK,
  tokenBlast,
  tokenSepolia
} from "@/libs/constants";
import { ethers } from "ethers";
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
  const [balanceToken, setBalanceToken] = useState("0");
  const [bigNumberBalance, setBigNumberBalance] = useState("0");
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
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
     if (chainId === "168587773") {
      setDemask(BLAST_DEMASK);
      setTokenDefault(tokenBlast);
    }  else if (chainId === "11155111") {
      setDemask(SEPOLIA_DEMASK);
      setTokenDefault(tokenSepolia);
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
  const updateBalance = async () => {
    if (tokenDefault && account) {
      setIsLoadingBalance(true);
      const providerChoice = await getProvider(wallet);
      const provider = new ethers.providers.Web3Provider(providerChoice);
      try {
        const balance = await provider.getBalance(account);
        const balanceInMatic = parseFloat(
          ethers.utils.formatEther(balance)
        ).toFixed(4);
        setBalanceToken(balanceInMatic);
        setBigNumberBalance(balance.toString());
        setIsLoadingBalance(false);
      } catch (error) {
        console.error(error);
        setIsLoadingBalance(false);
      }
    } else {
      setBalanceToken("0"); // No Account
    }
  };

  useEffect(() => {
    updateBalance();
  }, [tokenDefault, account, wallet, chainId]);

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
        balanceToken,
        bigNumberBalance,
        isLoadingBalance,
        updateBalance,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export default AccountContext;
