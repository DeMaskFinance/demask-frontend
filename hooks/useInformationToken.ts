import { getProvider } from "@/libs/connection/getProvider";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

const useInformationToken = (
  account: string,
  tokenAddress: string,
  wallet: string,
  routerAddress: string,
  rpc: string,
  nativeAddress: string,
  chainId: string,
  isOpenTransaction?: boolean,
  isOpenBuyNFT?: boolean,
  isOpenSellNFT?: boolean
) => {
  const [balanceToken, setBalanceToken] = useState("0");
  const [bigNumberBalance, setBigNumberBalance] = useState("0");
  const [isLoadingBalance, setIsLoadingBalance] = useState<boolean>(false);
  useEffect(() => {
    const getInformationToken = async () => {
      if (tokenAddress && account) {
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
        }
      } else {
        setBalanceToken("0"); // No Account
      }
    };

    getInformationToken();
  }, [
    tokenAddress,
    account,
    wallet,
    isOpenTransaction,
    isOpenBuyNFT,
    isOpenSellNFT,
    routerAddress,
    rpc,
    chainId,
  ]);

  return {
    balanceToken,
    bigNumberBalance,
    isLoadingBalance,
  };
};

export default useInformationToken;
