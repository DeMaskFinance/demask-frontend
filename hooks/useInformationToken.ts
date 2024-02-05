import abiErc20 from "@/abi/abiErc20.json";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

const useInformationToken = (
  account: string,
  tokenAddress: string,
  wallet: string,
  routerAddress: string,
  rpc: string,
  nativeAddress: string,
  isOpenTransaction?: boolean,
  isOpenBuyNFT?: boolean,
  isOpenSellNFT?: boolean
) => {
  const [balanceToken, setBalanceToken] = useState("0");
  const [bigNumberBalance, setBigNumberBalance] = useState("0");
  const [decimals, setDecimals] = useState("18");
  const [allowanceToken, setAllowanceToken] = useState("");
  const provider = new ethers.providers.JsonRpcProvider(rpc);
  const [isLoadingApprove, setIsLoadingApprove] = useState<boolean>(true);
  const [isLoadingBalance, setIsLoadingBalance] = useState<boolean>(false);
  useEffect(() => {
    const getInformationToken = async () => {
      if (tokenAddress && account && nativeAddress) {
        if (tokenAddress === nativeAddress) {
          setDecimals("18");
          setIsLoadingApprove(false);
          setIsLoadingBalance(true);
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
          const contract = new ethers.Contract(
            tokenAddress,
            abiErc20,
            provider
          );

          try {
            const bigNumberBalance = await contract.balanceOf(account);
            setBigNumberBalance(bigNumberBalance.toString());
            setIsLoadingApprove(false);
            const tokenAllowance = await contract.allowance(
              account,
              routerAddress
            );
            const currentAllowance = tokenAllowance.toString();
            setAllowanceToken(currentAllowance);
            const decimals = await contract.decimals();
            const decimalsInt = Number(decimals);
            const divisor = ethers.BigNumber.from(10).pow(decimalsInt);
            const balance = bigNumberBalance.div(divisor);
            setBalanceToken(balance.toString());
            // setDecimals(decimals);
            
            
          } catch (error) {
            console.error(error);
          }
        }
      } else {
        setBalanceToken("0"); // No Account
      }
    };

    getInformationToken();
  }, [tokenAddress, account, wallet, isOpenTransaction, isOpenBuyNFT,isOpenSellNFT,routerAddress]);

  return {
    balanceToken,
    bigNumberBalance,
    decimals,
    allowanceToken,
    isLoadingApprove,
    isLoadingBalance
  };
};

export default useInformationToken;
