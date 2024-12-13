import {
  network,
  SEPOLIA_DEMASK,
  STARKNET_DEMASK,
  tokenSepolia,
  tokenStarknet,
} from "@/libs/constants";
import { createContext, useContext, useEffect, useState } from "react";
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

  const [providers, setProviders] = useState();

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
      setDemask(STARKNET_DEMASK);
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

  useEffect(() => {
    const onAnnounceProvider = async (event) => {
      setProviders((prev) => {
        const instance = [
          {
            accounts: [],
            info: event.detail.info,
            provider: event.detail.provider,
          },
        ];

        return [
          ...(prev || []),
          ...instance.filter(
            (meta) => !prev?.some((prev) => prev.info.name === meta.info.name)
          ),
        ];
      });
    };

    window.addEventListener("eip6963:announceProvider", onAnnounceProvider);

    window.dispatchEvent(new Event("eip6963:requestProvider"));

    return () => {
      window.removeEventListener(
        "eip6963:announceProvider",
        onAnnounceProvider
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AccountContext.Provider
      value={{
        account,
        updateAccount,
        updateWallet,
        wallet,
        updateChainId,
        chainId,
        providers,
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

export const useAccountContext = () => {
  const getContext = useContext(AccountContext);
  const getProviders = async (walletName) => {
    try {
      const getInject = getContext.providers?.find(
        (meta) => meta.info.name === walletName
      );
      return getInject.provider;
    } catch (error) {
      throw "Not found provider";
    }
  };

  return { ...getContext, getProviders };
};

export default AccountContext;
